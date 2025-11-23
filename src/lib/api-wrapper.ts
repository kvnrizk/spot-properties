import { NextRequest, NextResponse } from "next/server";
import { logApiRequest, logApiError } from "@/lib/system-logger";

type ApiHandler = (
  req: NextRequest,
  context?: any
) => Promise<NextResponse> | NextResponse;

/**
 * Wrapper for API route handlers that adds automatic logging
 * Tracks request/response times, status codes, and errors
 */
export function withApiLogging(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, context?: any) => {
    const startTime = Date.now();
    const method = req.method;
    const url = req.url;

    // Extract request context
    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      undefined;

    try {
      // Execute the handler
      const response = await handler(req, context);
      const responseTime = Date.now() - startTime;
      const statusCode = response.status;

      // Log the request (async, non-blocking)
      logApiRequest({
        method,
        url,
        statusCode,
        responseTime,
        userAgent,
        ipAddress,
      }).catch((error) => {
        console.error("Failed to log API request:", error);
      });

      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const err = error instanceof Error ? error : new Error(String(error));

      // Log the error (async, non-blocking)
      logApiError({
        method,
        url,
        error: err,
        statusCode: 500,
        userAgent,
        ipAddress,
      }).catch((logError) => {
        console.error("Failed to log API error:", logError);
      });

      // Re-throw the error for standard error handling
      throw error;
    }
  };
}

/**
 * Extract user email from request (if authenticated)
 */
export async function getUserEmailFromRequest(
  req: NextRequest
): Promise<string | undefined> {
  try {
    // This would integrate with your auth system
    // For now, return undefined
    // You can enhance this to extract from session/token
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Wrapper with authentication context
 */
export function withAuthenticatedApiLogging(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, context?: any) => {
    const startTime = Date.now();
    const method = req.method;
    const url = req.url;

    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      undefined;
    const userEmail = await getUserEmailFromRequest(req);

    try {
      const response = await handler(req, context);
      const responseTime = Date.now() - startTime;
      const statusCode = response.status;

      logApiRequest({
        method,
        url,
        statusCode,
        responseTime,
        userEmail,
        userAgent,
        ipAddress,
      }).catch((error) => {
        console.error("Failed to log API request:", error);
      });

      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const err = error instanceof Error ? error : new Error(String(error));

      logApiError({
        method,
        url,
        error: err,
        statusCode: 500,
        userEmail,
        userAgent,
        ipAddress,
      }).catch((logError) => {
        console.error("Failed to log API error:", logError);
      });

      throw error;
    }
  };
}

/**
 * Create a JSON response with proper headers
 */
export function jsonResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
    },
    { status }
  );
}
