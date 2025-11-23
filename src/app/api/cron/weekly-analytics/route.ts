import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { executeCronJob } from "@/lib/cron-logger";

/**
 * Cron job: Generate weekly analytics snapshot
 * Runs every Sunday at midnight UTC
 * Creates a snapshot of key metrics for historical tracking
 */
export async function GET(req: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await executeCronJob("weekly-analytics", async () => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Gather weekly metrics
      const [
        totalProperties,
        publishedProperties,
        newPropertiesThisWeek,
        totalLeads,
        newLeadsThisWeek,
        handledLeads,
        totalAppointments,
        newAppointmentsThisWeek,
        totalUsers,
      ] = await Promise.all([
        db.property.count(),
        db.property.count({ where: { isPublished: true } }),
        db.property.count({
          where: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        }),
        db.lead.count(),
        db.lead.count({
          where: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        }),
        db.lead.count({ where: { isHandled: true } }),
        db.appointment.count(),
        db.appointment.count({
          where: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        }),
        db.user.count(),
      ]);

      const snapshot = {
        weekEnding: now.toISOString(),
        properties: {
          total: totalProperties,
          published: publishedProperties,
          newThisWeek: newPropertiesThisWeek,
        },
        leads: {
          total: totalLeads,
          newThisWeek: newLeadsThisWeek,
          handled: handledLeads,
          handledRate:
            totalLeads > 0 ? ((handledLeads / totalLeads) * 100).toFixed(2) : 0,
        },
        appointments: {
          total: totalAppointments,
          newThisWeek: newAppointmentsThisWeek,
        },
        users: {
          total: totalUsers,
        },
      };

      // Log the snapshot as a system log for historical tracking
      await db.systemLog.create({
        data: {
          level: "INFO",
          type: "CRON_JOB",
          message: "Weekly analytics snapshot generated",
          source: "weekly-analytics",
          metadata: JSON.stringify(snapshot),
        },
      });

      return snapshot;
    });

    return NextResponse.json({
      success: true,
      message: "Weekly analytics snapshot generated",
      snapshot: result,
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
