# Monitoring Guide for Spot Properties

This guide covers all monitoring, logging, and observability features implemented in Spot Properties.

## Table of Contents

1. [Overview](#overview)
2. [Vercel Analytics](#vercel-analytics)
3. [System Logs](#system-logs)
4. [Health Checks](#health-checks)
5. [Cron Jobs](#cron-jobs)
6. [Admin Dashboards](#admin-dashboards)
7. [Error Tracking](#error-tracking)
8. [Performance Monitoring](#performance-monitoring)

---

## Overview

Spot Properties includes comprehensive monitoring and logging infrastructure for production stability:

- **Vercel Analytics**: Web vitals, performance metrics, and visitor analytics
- **System Logs**: Centralized logging with filtering and search
- **Health Checks**: Database and environment validation
- **Cron Jobs**: Automated maintenance tasks
- **Admin Dashboards**: Real-time system status and metrics
- **Error Boundaries**: Global error tracking and logging

---

## Vercel Analytics

### What's Tracked

The application automatically tracks:

- **Web Vitals**:
  - TTFB (Time to First Byte)
  - LCP (Largest Contentful Paint)
  - CLS (Cumulative Layout Shift)
  - FCP (First Contentful Paint)
  - FID (First Input Delay)

- **Speed Insights**: Real user performance metrics
- **Visitor Analytics**: Page views, unique visitors, traffic sources

### Accessing Analytics

1. Go to your Vercel dashboard
2. Select the Spot Properties project
3. Navigate to the "Analytics" tab
4. View metrics by:
   - Time range (24h, 7d, 30d, etc.)
   - Page/route
   - Country/region
   - Device type

### Integration

Analytics are automatically enabled via:
```tsx
// src/app/layout.tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

<Analytics />
<SpeedInsights />
```

---

## System Logs

### Log Types

The application logs the following event types:

1. **API_REQUEST**: All API route requests with response times
2. **API_ERROR**: Failed API requests with stack traces
3. **SYSTEM_ERROR**: Application-level errors
4. **CRON_JOB**: Scheduled task executions
5. **DATABASE**: Database operation logs
6. **AUTH**: Authentication events
7. **PERFORMANCE**: Slow operations and bottlenecks
8. **SECURITY**: Security-related events

### Log Levels

- **INFO**: Informational messages
- **WARN**: Warning conditions
- **ERROR**: Error conditions
- **CRITICAL**: Critical errors requiring immediate attention

### Viewing Logs

**Admin Panel Access:**
1. Login as admin
2. Navigate to `/admin/system-logs`
3. Filter by:
   - Log level (INFO, WARN, ERROR, CRITICAL)
   - Log type (API_REQUEST, SYSTEM_ERROR, etc.)
   - Source (specific API route, component, or function)
4. Click "Details" to view full log entry including:
   - Error stack traces
   - Request metadata
   - User context
   - Timestamps

**API Access:**
```bash
GET /api/admin/system-logs?level=ERROR&type=API_ERROR&page=1&limit=50
```

### Log Retention

- **Activity Logs**: Retained for 90 days
- **System Logs (INFO)**: Retained for 30 days
- **System Logs (ERROR/CRITICAL)**: Retained for 60 days
- **Cron Job Logs**: Retained for 60 days

Cleanup runs automatically via the `cleanup-logs` cron job daily at 2 AM UTC.

### Using System Logger

```typescript
import { logApiRequest, logApiError, logSystemError } from "@/lib/system-logger";

// Log API request
await logApiRequest({
  method: "GET",
  url: "/api/properties",
  statusCode: 200,
  responseTime: 245,
  userEmail: "user@example.com",
});

// Log API error
await logApiError({
  method: "POST",
  url: "/api/properties",
  error: new Error("Validation failed"),
  statusCode: 400,
});

// Log system error
await logSystemError({
  message: "Failed to process image",
  error: error,
  source: "image-processor",
  metadata: { imageId: "123", size: "large" },
});
```

---

## Health Checks

### Endpoint

```
GET /api/health
```

### Response

```json
{
  "status": "healthy",
  "timestamp": "2025-11-23T03:47:26.123Z",
  "version": "abc1234",
  "checks": {
    "database": {
      "status": "pass",
      "responseTime": 45
    },
    "environment": {
      "status": "pass"
    },
    "system": {
      "status": "pass",
      "uptime": 123456,
      "nodeVersion": "v20.10.0",
      "platform": "linux"
    }
  }
}
```

### Status Codes

- `200`: Healthy or degraded but operational
- `503`: Unhealthy - service unavailable

### Detailed Health Check

For comprehensive system info:

```bash
POST /api/health
Content-Type: application/json

{
  "detailed": true
}
```

Returns additional data:
- Database record counts
- Environment variable status
- Memory usage
- Detailed error messages

### Monitoring Integration

Use the health endpoint with monitoring services:

- **UptimeRobot**: Check every 5 minutes
- **Pingdom**: HTTP check on `/api/health`
- **Datadog**: Custom health check integration
- **Vercel**: Add as deployment health check

---

## Cron Jobs

### Configured Jobs

#### 1. Log Cleanup (`cleanup-logs`)
- **Schedule**: Daily at 2 AM UTC
- **Purpose**: Delete old logs to manage database size
- **Removes**:
  - Activity logs older than 90 days
  - System info logs older than 30 days
  - Cron job logs older than 60 days

#### 2. Appointment Check (`check-appointments`)
- **Schedule**: Daily at 8 AM UTC
- **Purpose**: Identify expired appointments
- **Actions**:
  - Finds appointments past their date
  - Logs expired pending/confirmed appointments
  - Can be extended to send notifications

#### 3. Weekly Analytics (`weekly-analytics`)
- **Schedule**: Sunday at 12 AM UTC
- **Purpose**: Generate weekly performance snapshot
- **Captures**:
  - Total properties (published vs draft)
  - Leads received and handled
  - Appointments created
  - User growth
  - Lead handling rate

### Viewing Cron Status

**Admin Panel:**
1. Navigate to `/admin/system`
2. View "Cron Jobs" section
3. See last run time, status, and duration for each job

**API:**
```typescript
import { getCronJobStats } from "@/lib/cron-logger";

const stats = await getCronJobStats("cleanup-logs");
// Returns: total runs, success rate, avg duration, last run info
```

### Securing Cron Endpoints

All cron endpoints require the `CRON_SECRET` environment variable:

```env
CRON_SECRET="your-secure-random-string"
```

Set this in Vercel:
1. Go to Project Settings
2. Environment Variables
3. Add `CRON_SECRET` with a secure random value

### Manual Execution

To manually trigger a cron job:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/cleanup-logs
```

---

## Admin Dashboards

### System Status (`/admin/system`)

Real-time production monitoring dashboard showing:

**Deployment Info:**
- Git commit version
- Branch name
- Deployment timestamp

**Database Status:**
- Connection health (healthy/slow/error)
- Response time in milliseconds

**System Info:**
- Uptime
- Node.js version
- Memory usage (heap used, total, RSS)
- Memory usage percentage

**Cron Jobs:**
- Last run timestamp
- Execution status
- Duration
- Error messages

**Recent Errors:**
- Last 10 errors in 24 hours
- Error level, type, message
- Source and timestamp

**Log Statistics:**
- Total logs
- Logs in last 24h
- Error counts by level

### System Logs (`/admin/system-logs`)

Advanced log viewer with:

**Filtering:**
- By level (INFO, WARN, ERROR, CRITICAL)
- By type (API_REQUEST, SYSTEM_ERROR, etc.)
- By source (search for specific routes/components)

**Pagination:**
- 50 logs per page
- Navigate between pages

**Details View:**
- Full error stack traces
- Request metadata
- User context
- Response times
- Status codes

### Activity Logs (`/admin/activity`)

User activity tracking showing:
- Property CRUD operations
- Lead management
- Appointment changes
- Settings updates
- Image uploads

---

## Error Tracking

### Client-Side Errors

Error boundaries automatically log errors to the database:

**Public Pages:**
```tsx
// src/app/[locale]/(public)/error.tsx
// Catches errors and logs to /api/system/log-error
```

**Admin Panel:**
```tsx
// src/app/admin/error.tsx
// Catches admin errors and logs with admin context
```

### Server-Side Errors

Use the system logger in API routes:

```typescript
import { logApiError } from "@/lib/system-logger";

export async function POST(req: NextRequest) {
  try {
    // Your code
  } catch (error) {
    await logApiError({
      method: req.method,
      url: req.url,
      error: error as Error,
      statusCode: 500,
    });
    throw error;
  }
}
```

### API Route Wrapper

For automatic logging, use the API wrapper:

```typescript
import { withApiLogging } from "@/lib/api-wrapper";

export const GET = withApiLogging(async (req) => {
  // Your handler code
  // Automatically logs request/response times and errors
});
```

---

## Performance Monitoring

### Tracking Slow Operations

Log performance issues automatically:

```typescript
import { logPerformance } from "@/lib/system-logger";

const start = Date.now();
// ... expensive operation
const duration = Date.now() - start;

if (duration > 1000) {
  await logPerformance({
    message: "Slow database query",
    source: "getProperties",
    responseTime: duration,
    metadata: { filters, page, limit },
  });
}
```

### Database Performance

Monitor via `/api/health`:
- Response times > 1000ms trigger "degraded" status
- Check regularly for slow queries

### Memory Monitoring

View real-time memory usage:
1. Navigate to `/admin/system`
2. Check "Memory Usage" section
3. Monitor heap used vs total
4. Watch for memory leaks (increasing over time)

### Vercel Speed Insights

Automatic performance tracking:
- Real user metrics
- Page load times
- Core Web Vitals scores
- Performance trends over time

---

## Best Practices

### 1. Regular Monitoring

- Check `/admin/system` daily
- Review error logs weekly
- Monitor cron job execution

### 2. Alert Setup

Set up alerts for:
- Health check failures
- Error rate spikes
- Database slow responses
- Cron job failures

### 3. Log Management

- Don't log sensitive data (passwords, tokens)
- Use appropriate log levels
- Include context for debugging
- Review and act on ERROR/CRITICAL logs

### 4. Performance

- Monitor slow API routes
- Check database query times
- Review memory usage trends
- Optimize based on Speed Insights

### 5. Security

- Secure cron endpoints with `CRON_SECRET`
- Restrict admin dashboard access
- Sanitize log data
- Monitor for security events

---

## Troubleshooting

### High Error Rate

1. Check `/admin/system-logs` filtered by ERROR
2. Identify common error patterns
3. Review error stack traces
4. Fix and deploy

### Slow Performance

1. Check `/api/health` for database response time
2. Review Speed Insights in Vercel
3. Check memory usage in `/admin/system`
4. Look for slow API requests in system logs

### Cron Job Failures

1. Navigate to `/admin/system`
2. Check cron job status
3. View error message
4. Check cron job logs for details
5. Verify `CRON_SECRET` is set

### Missing Logs

1. Verify database connection
2. Check Prisma schema is up to date
3. Run `npx prisma generate`
4. Ensure SystemLog model exists

---

## Support

For issues or questions:
- Review logs in `/admin/system-logs`
- Check system status in `/admin/system`
- Verify health at `/api/health`
- Review this guide and related documentation
