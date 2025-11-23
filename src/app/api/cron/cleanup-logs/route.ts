import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { executeCronJob } from "@/lib/cron-logger";

/**
 * Cron job: Cleanup old logs
 * Runs daily at 2 AM UTC
 * Removes ActivityLogs older than 90 days
 * Removes SystemLogs older than 30 days (except errors)
 * Removes CronJobLogs older than 60 days
 */
export async function GET(req: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await executeCronJob("cleanup-logs", async () => {
      const now = new Date();
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Delete old activity logs (90 days)
      const deletedActivityLogs = await db.activityLog.deleteMany({
        where: {
          createdAt: {
            lt: ninetyDaysAgo,
          },
        },
      });

      // Delete old system logs (30 days), but keep errors longer
      const deletedSystemLogs = await db.systemLog.deleteMany({
        where: {
          createdAt: {
            lt: thirtyDaysAgo,
          },
          level: {
            in: ["INFO"],
          },
        },
      });

      // Delete old cron job logs (60 days)
      const deletedCronLogs = await db.cronJobLog.deleteMany({
        where: {
          startedAt: {
            lt: sixtyDaysAgo,
          },
        },
      });

      return {
        activityLogs: deletedActivityLogs.count,
        systemLogs: deletedSystemLogs.count,
        cronLogs: deletedCronLogs.count,
        total:
          deletedActivityLogs.count +
          deletedSystemLogs.count +
          deletedCronLogs.count,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Log cleanup completed",
      deleted: result,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
