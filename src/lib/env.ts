/**
 * Environment configuration and URL helpers
 * This file validates and exports environment variables for use across the application
 */

function getBaseUrl(): string {
  // Check if we're in the browser
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Check for explicit base URL (production)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Vercel deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback to localhost for development
  return "http://localhost:3000";
}

// Validate and export base URL
export const baseUrl = getBaseUrl();

// Ensure URL doesn't end with a slash for consistency
export const cleanBaseUrl = baseUrl.endsWith("/")
  ? baseUrl.slice(0, -1)
  : baseUrl;

/**
 * Generates an absolute URL for a given path
 * @param path - The path to append to the base URL (with or without leading slash)
 * @returns Absolute URL
 */
export function getAbsoluteUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBaseUrl}${cleanPath}`;
}

/**
 * Environment variable validation
 */
export function validateEnv() {
  const requiredEnvVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    // NEXTAUTH_URL can be auto-generated from VERCEL_URL in Vercel deployments
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
  };

  const missing = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Warn about missing optional variables in production
  if (process.env.NODE_ENV === "production") {
    const optionalEnvVars = {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
    };

    const missingOptional = Object.entries(optionalEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingOptional.length > 0) {
      console.warn(
        `⚠️ Missing optional environment variables: ${missingOptional.join(", ")}`
      );
    }
  }
}

// Note: Validation is not run automatically to allow builds to succeed
// Environment variables are validated at runtime in API routes and server components
// For Vercel deployments, NEXTAUTH_URL is auto-generated from VERCEL_URL
