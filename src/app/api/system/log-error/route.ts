import { NextRequest, NextResponse } from "next/server";
import { logSystemError } from "@/lib/system-logger";

/**
 * API endpoint for logging client-side errors
 * POST /api/system/log-error
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, stack, digest, source, location } = body;

    // Create error object
    const error = new Error(message);
    error.stack = stack;

    // Log the error
    await logSystemError({
      message: `Client error: ${message}`,
      error,
      source: source || "unknown",
      metadata: {
        digest,
        location,
        userAgent: req.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to log client error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log error" },
      { status: 500 }
    );
  }
}
