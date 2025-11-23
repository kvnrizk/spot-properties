import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  checks: {
    database: {
      status: "pass" | "fail";
      responseTime?: number;
      error?: string;
    };
    environment: {
      status: "pass" | "warn" | "fail";
      missing?: string[];
    };
    system: {
      status: "pass";
      uptime: number;
      nodeVersion: string;
      platform: string;
    };
  };
}

/**
 * Health check endpoint for monitoring and debugging
 * GET /api/health
 */
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const result: HealthCheckResult = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || "dev",
    checks: {
      database: { status: "pass" },
      environment: { status: "pass" },
      system: {
        status: "pass",
        uptime: process.uptime(),
        nodeVersion: process.version,
        platform: process.platform,
      },
    },
  };

  // Database health check
  try {
    const dbStartTime = Date.now();
    await db.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - dbStartTime;

    result.checks.database = {
      status: "pass",
      responseTime,
    };

    // Warn if database is slow
    if (responseTime > 1000) {
      result.status = "degraded";
    }
  } catch (error) {
    result.checks.database = {
      status: "fail",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    result.status = "unhealthy";
  }

  // Environment variables check
  const requiredEnvVars = [
    "DATABASE_URL",
    "AUTH_SECRET",
    "NEXTAUTH_URL",
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    result.checks.environment = {
      status: "warn",
      missing: missingEnvVars,
    };
    if (result.status === "healthy") {
      result.status = "degraded";
    }
  }

  // Set response status based on health
  const statusCode =
    result.status === "healthy"
      ? 200
      : result.status === "degraded"
        ? 200
        : 503;

  return NextResponse.json(result, {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

/**
 * Detailed health check for admin/monitoring
 * Includes more comprehensive checks
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const includeDetails = body.detailed === true;

  if (!includeDetails) {
    return GET(req);
  }

  const result: any = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || "dev",
    checks: {
      database: { status: "pass" },
      environment: { status: "pass" },
      system: {
        status: "pass",
        uptime: process.uptime(),
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          used: process.memoryUsage().heapUsed,
          total: process.memoryUsage().heapTotal,
          rss: process.memoryUsage().rss,
        },
      },
    },
  };

  // Database health with additional checks
  try {
    const dbStartTime = Date.now();
    await db.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - dbStartTime;

    // Count total records
    const [propertyCount, userCount, leadCount] = await Promise.all([
      db.property.count(),
      db.user.count(),
      db.lead.count(),
    ]);

    result.checks.database = {
      status: "pass",
      responseTime,
      counts: {
        properties: propertyCount,
        users: userCount,
        leads: leadCount,
      },
    };

    if (responseTime > 1000) {
      result.status = "degraded";
    }
  } catch (error) {
    result.checks.database = {
      status: "fail",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    result.status = "unhealthy";
  }

  // Environment check
  const requiredEnvVars = [
    "DATABASE_URL",
    "AUTH_SECRET",
    "NEXTAUTH_URL",
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  const envStatus: Record<string, boolean> = {};
  requiredEnvVars.forEach((varName) => {
    envStatus[varName] = !!process.env[varName];
  });

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    result.checks.environment = {
      status: "warn",
      variables: envStatus,
      missing: missingEnvVars,
    };
    if (result.status === "healthy") {
      result.status = "degraded";
    }
  } else {
    result.checks.environment = {
      status: "pass",
      variables: envStatus,
    };
  }

  const statusCode =
    result.status === "healthy"
      ? 200
      : result.status === "degraded"
        ? 200
        : 503;

  return NextResponse.json(result, {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
