import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { executeCronJob } from "@/lib/cron-logger";

/**
 * Cron job: Check expired appointments
 * Runs daily at 8 AM UTC
 * Identifies appointments that are past their date but still pending
 */
export async function GET(req: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await executeCronJob("check-appointments", async () => {
      const now = new Date();

      // Find appointments that are:
      // 1. Past their scheduled date
      // 2. Still marked as PENDING or CONFIRMED
      const expiredAppointments = await db.appointment.findMany({
        where: {
          date: {
            lt: now,
          },
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
        include: {
          property: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      });

      // You could optionally auto-cancel or send notifications
      // For now, we'll just log and return the count

      return {
        expiredPending: expiredAppointments.filter(
          (a) => a.status === "PENDING"
        ).length,
        expiredConfirmed: expiredAppointments.filter(
          (a) => a.status === "CONFIRMED"
        ).length,
        total: expiredAppointments.length,
        appointments: expiredAppointments.map((a) => ({
          id: a.id,
          date: a.date,
          status: a.status,
          property: a.property.title,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      message: "Appointment check completed",
      result,
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
