import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * Get comprehensive system status
 * GET /api/admin/system-status
 */
export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get deployment info
    const deployment = {
      version: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || "dev",
      commitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || "Development",
      branch: process.env.VERCEL_GIT_COMMIT_REF || "local",
      deployedAt: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME
        ? new Date().toISOString()
        : null,
    };

    // Database status
    let databaseStatus = "healthy";
    let databaseResponseTime = 0;
    try {
      const start = Date.now();
      await db.$queryRaw`SELECT 1`;
      databaseResponseTime = Date.now() - start;
      if (databaseResponseTime > 1000) {
        databaseStatus = "slow";
      }
    } catch (error) {
      databaseStatus = "error";
    }

    // Recent errors (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentErrors = await db.systemLog.findMany({
      where: {
        level: {
          in: ["ERROR", "CRITICAL"],
        },
        createdAt: {
          gte: oneDayAgo,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        level: true,
        type: true,
        message: true,
        source: true,
        createdAt: true,
      },
    });

    // Error count by level (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const errorCounts = await db.systemLog.groupBy({
      by: ["level"],
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: {
        _all: true,
      },
    });

    // Cron job status
    const cronJobs = await Promise.all([
      db.cronJobLog.findFirst({
        where: { jobName: "cleanup-logs" },
        orderBy: { startedAt: "desc" },
      }),
      db.cronJobLog.findFirst({
        where: { jobName: "check-appointments" },
        orderBy: { startedAt: "desc" },
      }),
      db.cronJobLog.findFirst({
        where: { jobName: "weekly-analytics" },
        orderBy: { startedAt: "desc" },
      }),
    ]);

    const cronStatus = [
      {
        name: "cleanup-logs",
        displayName: "Log Cleanup",
        schedule: "Daily at 2 AM UTC",
        lastRun: cronJobs[0],
      },
      {
        name: "check-appointments",
        displayName: "Appointment Check",
        schedule: "Daily at 8 AM UTC",
        lastRun: cronJobs[1],
      },
      {
        name: "weekly-analytics",
        displayName: "Weekly Analytics",
        schedule: "Sunday at 12 AM UTC",
        lastRun: cronJobs[2],
      },
    ];

    // System info
    const systemInfo = {
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        rss: process.memoryUsage().rss,
      },
    };

    // Log statistics
    const logStats = {
      totalLogs: await db.systemLog.count(),
      last24h: await db.systemLog.count({
        where: {
          createdAt: {
            gte: oneDayAgo,
          },
        },
      }),
      errorCounts: errorCounts.reduce(
        (acc, item) => {
          acc[item.level] = item._count._all;
          return acc;
        },
        {} as Record<string, number>
      ),
    };

    return NextResponse.json({
      deployment,
      database: {
        status: databaseStatus,
        responseTime: databaseResponseTime,
      },
      recentErrors,
      cronStatus,
      systemInfo,
      logStats,
    });
  } catch (error) {
    console.error("Failed to fetch system status:", error);
    return NextResponse.json(
      { error: "Failed to fetch system status" },
      { status: 500 }
    );
  }
}
