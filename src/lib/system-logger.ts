import { db } from "@/lib/db";
import { LogLevel, LogType } from "@prisma/client";

interface SystemLogParams {
  level: LogLevel;
  type: LogType;
  message: string;
  source?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  errorStack?: string;
  errorName?: string;
  userEmail?: string;
  userId?: string;
  locale?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

/**
 * Log a system event to the database
 * Falls back to console logging if database write fails
 */
export async function logSystem(params: SystemLogParams): Promise<void> {
  try {
    // Convert metadata object to JSON string if provided
    const metadataString = params.metadata
      ? JSON.stringify(params.metadata)
      : null;

    await db.systemLog.create({
      data: {
        level: params.level,
        type: params.type,
        message: params.message,
        source: params.source || null,
        method: params.method || null,
        url: params.url || null,
        statusCode: params.statusCode || null,
        responseTime: params.responseTime || null,
        errorStack: params.errorStack || null,
        errorName: params.errorName || null,
        userEmail: params.userEmail || null,
        userId: params.userId || null,
        locale: params.locale || null,
        userAgent: params.userAgent || null,
        ipAddress: params.ipAddress || null,
        metadata: metadataString,
      },
    });
  } catch (error) {
    // Fallback to console logging if database write fails
    console.error("Failed to write system log:", error);
    console.log("Original log data:", params);
  }
}

/**
 * Log API request
 */
export async function logApiRequest(params: {
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  userEmail?: string;
  locale?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  const level: LogLevel =
    params.statusCode >= 500
      ? "ERROR"
      : params.statusCode >= 400
        ? "WARN"
        : "INFO";

  await logSystem({
    level,
    type: "API_REQUEST",
    message: `${params.method} ${params.url} - ${params.statusCode} (${params.responseTime}ms)`,
    source: params.url,
    method: params.method,
    url: params.url,
    statusCode: params.statusCode,
    responseTime: params.responseTime,
    userEmail: params.userEmail,
    locale: params.locale,
    userAgent: params.userAgent,
    ipAddress: params.ipAddress,
    metadata: params.metadata,
  });
}

/**
 * Log API error
 */
export async function logApiError(params: {
  method: string;
  url: string;
  error: Error;
  statusCode?: number;
  userEmail?: string;
  locale?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  await logSystem({
    level: "ERROR",
    type: "API_ERROR",
    message: params.error.message,
    source: params.url,
    method: params.method,
    url: params.url,
    statusCode: params.statusCode || 500,
    errorStack: params.error.stack,
    errorName: params.error.name,
    userEmail: params.userEmail,
    locale: params.locale,
    userAgent: params.userAgent,
    ipAddress: params.ipAddress,
    metadata: params.metadata,
  });
}

/**
 * Log system error
 */
export async function logSystemError(params: {
  message: string;
  error: Error;
  source?: string;
  userEmail?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  await logSystem({
    level: "ERROR",
    type: "SYSTEM_ERROR",
    message: params.message,
    source: params.source,
    errorStack: params.error.stack,
    errorName: params.error.name,
    userEmail: params.userEmail,
    metadata: params.metadata,
  });
}

/**
 * Log cron job execution
 */
export async function logCronJob(params: {
  jobName: string;
  status: "SUCCESS" | "FAILED" | "RUNNING";
  message?: string;
  error?: Error;
  duration?: number;
  recordsProcessed?: number;
  metadata?: Record<string, any>;
}): Promise<void> {
  const level: LogLevel =
    params.status === "FAILED"
      ? "ERROR"
      : params.status === "RUNNING"
        ? "INFO"
        : "INFO";

  await logSystem({
    level,
    type: "CRON_JOB",
    message: params.message || `Cron job ${params.jobName} - ${params.status}`,
    source: params.jobName,
    errorStack: params.error?.stack,
    errorName: params.error?.name,
    responseTime: params.duration,
    metadata: {
      ...params.metadata,
      recordsProcessed: params.recordsProcessed,
      status: params.status,
    },
  });
}

/**
 * Log performance metrics
 */
export async function logPerformance(params: {
  message: string;
  source: string;
  responseTime: number;
  metadata?: Record<string, any>;
}): Promise<void> {
  const level: LogLevel = params.responseTime > 3000 ? "WARN" : "INFO";

  await logSystem({
    level,
    type: "PERFORMANCE",
    message: params.message,
    source: params.source,
    responseTime: params.responseTime,
    metadata: params.metadata,
  });
}

/**
 * Log security events
 */
export async function logSecurity(params: {
  message: string;
  level: LogLevel;
  userEmail?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  await logSystem({
    level: params.level,
    type: "SECURITY",
    message: params.message,
    userEmail: params.userEmail,
    ipAddress: params.ipAddress,
    metadata: params.metadata,
  });
}

/**
 * Log database operations
 */
export async function logDatabase(params: {
  message: string;
  level: LogLevel;
  error?: Error;
  metadata?: Record<string, any>;
}): Promise<void> {
  await logSystem({
    level: params.level,
    type: "DATABASE",
    message: params.message,
    errorStack: params.error?.stack,
    errorName: params.error?.name,
    metadata: params.metadata,
  });
}

/**
 * Helper to sanitize sensitive data from logs
 */
export function sanitizeLogData(data: any): any {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  const sensitiveKeys = [
    "password",
    "passwordHash",
    "token",
    "secret",
    "apiKey",
    "authorization",
  ];

  const sanitized = { ...data };

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
      sanitized[key] = sanitizeLogData(sanitized[key]);
    }
  }

  return sanitized;
}
