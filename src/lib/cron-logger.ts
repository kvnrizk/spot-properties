import { db } from "@/lib/db";
import { CronJobStatus } from "@prisma/client";

interface CronJobLogEntry {
  id: string;
  jobName: string;
  startedAt: Date;
}

/**
 * Start logging a cron job execution
 * Returns the log entry ID for later completion
 */
export async function startCronJob(
  jobName: string,
  metadata?: Record<string, any>
): Promise<CronJobLogEntry> {
  const log = await db.cronJobLog.create({
    data: {
      jobName,
      status: "RUNNING",
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });

  return {
    id: log.id,
    jobName: log.jobName,
    startedAt: log.startedAt,
  };
}

/**
 * Mark a cron job as completed successfully
 */
export async function completeCronJob(
  logId: string,
  params?: {
    message?: string;
    recordsProcessed?: number;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  const log = await db.cronJobLog.findUnique({
    where: { id: logId },
  });

  if (!log) {
    console.error(`Cron job log not found: ${logId}`);
    return;
  }

  const duration = Date.now() - log.startedAt.getTime();

  await db.cronJobLog.update({
    where: { id: logId },
    data: {
      status: "SUCCESS",
      completedAt: new Date(),
      duration,
      message: params?.message || "Completed successfully",
      recordsProcessed: params?.recordsProcessed,
      metadata: params?.metadata ? JSON.stringify(params.metadata) : undefined,
    },
  });
}

/**
 * Mark a cron job as failed
 */
export async function failCronJob(
  logId: string,
  error: Error | string,
  params?: {
    recordsProcessed?: number;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  const log = await db.cronJobLog.findUnique({
    where: { id: logId },
  });

  if (!log) {
    console.error(`Cron job log not found: ${logId}`);
    return;
  }

  const duration = Date.now() - log.startedAt.getTime();
  const errorMessage = typeof error === "string" ? error : error.message;
  const errorStack = typeof error === "string" ? undefined : error.stack;

  await db.cronJobLog.update({
    where: { id: logId },
    data: {
      status: "FAILED",
      completedAt: new Date(),
      duration,
      message: `Failed: ${errorMessage}`,
      error: errorStack || errorMessage,
      recordsProcessed: params?.recordsProcessed,
      metadata: params?.metadata ? JSON.stringify(params.metadata) : undefined,
    },
  });
}

/**
 * Get the last execution of a cron job
 */
export async function getLastCronJobRun(jobName: string) {
  return await db.cronJobLog.findFirst({
    where: { jobName },
    orderBy: { startedAt: "desc" },
  });
}

/**
 * Get all cron job executions for a specific job
 */
export async function getCronJobHistory(
  jobName: string,
  limit: number = 10
) {
  return await db.cronJobLog.findMany({
    where: { jobName },
    orderBy: { startedAt: "desc" },
    take: limit,
  });
}

/**
 * Get cron job statistics
 */
export async function getCronJobStats(jobName: string) {
  const logs = await db.cronJobLog.findMany({
    where: { jobName },
    orderBy: { startedAt: "desc" },
    take: 30, // Last 30 runs
  });

  const total = logs.length;
  const successful = logs.filter((log) => log.status === "SUCCESS").length;
  const failed = logs.filter((log) => log.status === "FAILED").length;
  const running = logs.filter((log) => log.status === "RUNNING").length;

  const completedLogs = logs.filter(
    (log) => log.status !== "RUNNING" && log.duration !== null
  );
  const avgDuration =
    completedLogs.length > 0
      ? completedLogs.reduce((sum, log) => sum + (log.duration || 0), 0) /
        completedLogs.length
      : 0;

  const lastRun = logs[0];

  return {
    total,
    successful,
    failed,
    running,
    successRate: total > 0 ? (successful / total) * 100 : 0,
    avgDuration: Math.round(avgDuration),
    lastRun: lastRun
      ? {
          status: lastRun.status,
          startedAt: lastRun.startedAt,
          completedAt: lastRun.completedAt,
          duration: lastRun.duration,
          message: lastRun.message,
        }
      : null,
  };
}

/**
 * Wrapper function to execute a cron job with automatic logging
 */
export async function executeCronJob<T>(
  jobName: string,
  jobFunction: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const log = await startCronJob(jobName, metadata);

  try {
    const result = await jobFunction();

    // Extract records processed if result is a number
    const recordsProcessed = typeof result === "number" ? result : undefined;

    await completeCronJob(log.id, {
      recordsProcessed,
      metadata: {
        ...metadata,
        result: typeof result === "object" ? result : { value: result },
      },
    });

    return result;
  } catch (error) {
    await failCronJob(
      log.id,
      error instanceof Error ? error : new Error(String(error)),
      { metadata }
    );
    throw error;
  }
}
