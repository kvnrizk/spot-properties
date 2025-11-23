# Spot Properties - Complete Documentation

This is the comprehensive documentation for the Spot Properties Next.js application, covering everything from development setup to production deployment and maintenance.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Project Overview](#project-overview)
4. [Development Setup](#development-setup)
5. [Deployment Guide](#deployment-guide)
6. [Code Quality & Linting](#code-quality--linting)
7. [Production Monitoring](#production-monitoring)
8. [Backup & Disaster Recovery](#backup--disaster-recovery)
9. [System Health & Maintenance](#system-health--maintenance)
10. [Troubleshooting](#troubleshooting)
11. [Support & Resources](#support--resources)

---

## Introduction

Spot Properties is a modern real estate platform built with:
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Prisma** ORM with PostgreSQL
- **next-intl** for internationalization (EN/AR)
- **Tailwind CSS** for styling
- **Cloudinary** for image management
- **Resend** for email delivery
- **NextAuth** for authentication

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database (Neon, Supabase, or similar)
- Cloudinary account
- Resend account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd spot-properties
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local`:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/spotproperties"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   RESEND_API_KEY="your-resend-key"
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="your-password"
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database** (optional, run once)
   ```bash
   npx prisma db seed
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Visit [http://localhost:3000/en](http://localhost:3000/en)

---

## Project Overview

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Internationalization**: next-intl
- **Image Storage**: Cloudinary
- **Email**: Resend
- **Deployment**: Vercel

### Project Structure

```
spot-properties/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── [locale]/               # Internationalized routes
│   │   │   ├── (public)/           # Public pages
│   │   │   └── layout.tsx          # Locale layout
│   │   ├── admin/                  # Admin panel
│   │   ├── api/                    # API routes
│   │   └── login/                  # Authentication
│   ├── components/                 # Reusable components
│   ├── lib/                        # Utilities & helpers
│   ├── locales/                    # Translation files
│   └── middleware.ts               # Route protection
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migrations
├── public/                         # Static assets
├── .env.production                 # Environment template
├── next.config.ts                  # Next.js configuration
├── vercel.json                     # Vercel configuration
└── package.json                    # Dependencies
```

### Key Features

- Bilingual support (English/Arabic)
- Property listing and management
- Admin dashboard with CRUD operations
- Image upload and optimization
- Contact forms and appointment booking
- Activity logging and system monitoring
- SEO optimization with sitemap and metadata
- WhatsApp integration
- Email notifications

---

## Development Setup

### Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a migration
npx prisma migrate dev --name describe_your_changes

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
npx prisma db seed

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Run production build locally
npm start

# Lint code
npm run lint

# Fix linting issues
npm run lint -- --fix
```

---

## Deployment Guide

### Quick Deployment (5 Steps)

#### 1. Prepare Environment Variables

Generate your secrets:
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

Have ready:
- PostgreSQL database connection string (Neon/Supabase)
- Cloudinary credentials
- Resend API key
- Admin email and password

#### 2. Deploy to Vercel

**Via Dashboard:**
1. Go to https://vercel.com/new
2. Import your Git repository
3. Select Framework: **Next.js**
4. Add environment variables
5. Click **Deploy**

**Via CLI:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

#### 3. Run Database Migration

After first deployment:
```bash
vercel env pull .env.production.local
npx prisma migrate deploy
```

#### 4. Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update environment variables:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

#### 5. Verify Deployment

Test these URLs:
- `https://yourdomain.com/en` - Homepage
- `https://yourdomain.com/ar` - Arabic version
- `https://yourdomain.com/admin` - Admin login
- `https://yourdomain.com/sitemap.xml` - Sitemap
- `https://yourdomain.com/api/health` - Health check

### Environment Variables Reference

#### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `NEXTAUTH_SECRET` | NextAuth encryption key | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Production URL | `https://yourdomain.com` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://yourdomain.com` |
| `ADMIN_EMAIL` | Admin login email | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Admin password | Strong password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From Cloudinary dashboard |
| `RESEND_API_KEY` | Resend email API key | From Resend dashboard |

#### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp contact number | `1234567890` (no + or spaces) |
| `CRON_SECRET` | Secure cron endpoints | Random secure string |

### Detailed Deployment Checklist

#### Pre-Deployment

- [ ] All environment variables ready
- [ ] Database created and accessible
- [ ] Cloudinary account configured
- [ ] Resend account with verified domain
- [ ] Local build tested successfully
- [ ] All tests passing
- [ ] Code committed to Git repository

#### During Deployment

- [ ] Repository connected to Vercel
- [ ] Framework preset: Next.js
- [ ] All environment variables added
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Deploy button clicked

#### Post-Deployment

- [ ] Build completed successfully
- [ ] Homepage loads correctly (EN and AR)
- [ ] Properties page displays
- [ ] Admin panel accessible
- [ ] Images load from Cloudinary
- [ ] Contact form works
- [ ] Email notifications send
- [ ] Sitemap accessible
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)

### Getting Service Credentials

#### Database (Neon)
1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Enable connection pooling

#### Cloudinary
1. Go to https://cloudinary.com
2. Sign up / Login
3. Dashboard → Account Details
4. Copy Cloud Name, API Key, API Secret

#### Resend
1. Go to https://resend.com
2. Sign up / Login
3. API Keys → Create API Key
4. Copy key (starts with `re_`)

### Deployment Troubleshooting

#### Build Fails

**Error: Cannot find module '@prisma/client'**
```bash
# Ensure postinstall script in package.json runs
npm install
npx prisma generate
```

**Error: Environment variable not found**
- Check Vercel Dashboard → Settings → Environment Variables
- Ensure variable names match exactly (case-sensitive)
- Redeploy after adding new variables

#### Database Connection Errors

**Error: Can't reach database server**
- Verify `DATABASE_URL` is correct
- Ensure database accepts connections from Vercel
- Add `?sslmode=require` to connection string

#### Images Not Loading

**Images not displaying**
- Verify Cloudinary credentials
- Check `next.config.ts` has Cloudinary in `remotePatterns`
- Test upload in admin panel

#### 404 on Routes
- Check file naming conventions
- Verify `[locale]` folder structure
- Ensure middleware configuration is correct

---

## Code Quality & Linting

### TypeScript Issues

#### Using `any` Type

**Problem:** Using `any` type instead of proper types

**Fix:** Replace with proper types

```typescript
// Before
export default auth(async function middleware(req: any) {

// After
import { NextRequest } from "next/server";
export default auth(async function middleware(req: NextRequest) {
```

#### Unused Variables

**Problem:** Variables defined but never used

**Fix:** Remove unused imports or prefix with underscore

```typescript
// Before
import { Home, CheckCircle, Calendar } from "lucide-react";

// After (if CheckCircle is not used)
import { Home, Calendar } from "lucide-react";
```

#### React Hooks Dependencies

**Problem:** Missing dependency in useEffect

**Fix:** Add dependency or move function inside useEffect

```typescript
// Option 1: Add to dependencies
useEffect(() => {
  fetchProperty();
}, [fetchProperty]);

// Option 2: Move function inside useEffect
useEffect(() => {
  const fetchProperty = async () => {
    // ... implementation
  };
  fetchProperty();
}, [id]);
```

#### Prefer const over let

**Problem:** Variable never reassigned, should use const

**Fix:**
```typescript
// Before
let locale = await getLocale(config);

// After
const locale = await getLocale(config);
```

### Automated Fixes

```bash
# Fix all auto-fixable issues
npm run lint -- --fix

# Or use npx
npx eslint . --fix
```

### ESLint Configuration

Create `.eslintrc.json`:

```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "warn"
  }
}
```

### Verification

```bash
# Check for linting issues
npm run lint

# Test build
npm run build

# If successful:
# ✓ Compiled successfully
```

---

## Production Monitoring

### Vercel Analytics

**What's Tracked:**
- Web Vitals (TTFB, LCP, CLS, FCP, FID)
- Speed Insights
- Visitor analytics
- Page views and traffic sources

**Accessing Analytics:**
1. Go to Vercel dashboard
2. Select your project
3. Navigate to "Analytics" tab
4. View metrics by time range, page, country, device

### System Logs

**Log Types:**
- API_REQUEST: All API route requests
- API_ERROR: Failed API requests
- SYSTEM_ERROR: Application-level errors
- CRON_JOB: Scheduled task executions
- DATABASE: Database operation logs
- AUTH: Authentication events
- PERFORMANCE: Slow operations
- SECURITY: Security-related events

**Log Levels:**
- INFO: Informational messages
- WARN: Warning conditions
- ERROR: Error conditions
- CRITICAL: Critical errors

**Viewing Logs:**
1. Login as admin
2. Navigate to `/admin/system-logs`
3. Filter by level, type, or source
4. Click "Details" for full log entry

**API Access:**
```bash
GET /api/admin/system-logs?level=ERROR&type=API_ERROR&page=1&limit=50
```

**Using System Logger:**
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

### Health Checks

**Endpoint:**
```
GET /api/health
```

**Response:**
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
      "nodeVersion": "v20.10.0"
    }
  }
}
```

**Status Codes:**
- `200`: Healthy or degraded but operational
- `503`: Unhealthy - service unavailable

### Cron Jobs

**Configured Jobs:**

1. **Log Cleanup** - Daily at 2 AM UTC
   - Removes Activity Logs > 90 days
   - Removes System Logs (INFO) > 30 days
   - Removes Cron Job Logs > 60 days

2. **Appointment Check** - Daily at 8 AM UTC
   - Identifies expired appointments
   - Logs pending/confirmed past appointments

3. **Weekly Analytics** - Sunday at 12 AM UTC
   - Generates performance snapshot
   - Tracks properties, leads, appointments

**Viewing Cron Status:**
1. Navigate to `/admin/system`
2. View "Cron Jobs" section
3. See last run time, status, and duration

**Manual Execution:**
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/cleanup-logs
```

### Admin Dashboards

**System Status (`/admin/system`):**
- Deployment information
- Database health and response time
- System uptime and memory usage
- Recent errors (last 24 hours)
- Cron job execution status
- Log statistics

**System Logs (`/admin/system-logs`):**
- Advanced filtering by level, type, source
- Pagination (50 logs per page)
- Detailed log view with stack traces
- Error metadata and user context

---

## Backup & Disaster Recovery

### Database Backups

#### Using Neon

**Automatic Backups:**
- Point-in-Time Recovery (PITR) on Pro plans
- Default retention: 7 days (configurable up to 30 days)
- Branch-based backups for testing

**Manual Backup:**
```bash
# Set your database URL
export DATABASE_URL="postgresql://user:password@host:5432/neondb"

# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# With compression
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

#### Using Supabase

**Automatic Backups:**
- Daily backups via Supabase Dashboard
- Retained 7 days (Free), 30+ days (Pro)

**Manual Backup:**
```bash
# Get connection string from Supabase Dashboard
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Backup Script

```bash
#!/bin/bash
# scripts/backup-db.sh

BACKUP_DIR="./backups/database"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="spotproperties_${DATE}.sql.gz"

mkdir -p $BACKUP_DIR

echo "Starting database backup..."
pg_dump $DATABASE_URL | gzip > "$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Backup completed: $BACKUP_FILE"
  find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
  echo "Deleted backups older than $RETENTION_DAYS days"
else
  echo "Backup failed!"
  exit 1
fi
```

### Cloudinary Asset Backups

**Manual Backup:**
```typescript
// scripts/backup-cloudinary.ts
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function backupCloudinaryAssets() {
  const resources = await cloudinary.v2.api.resources({
    type: "upload",
    max_results: 500,
    prefix: "spot-properties/",
  });

  const fs = require("fs");
  const timestamp = new Date().toISOString().split("T")[0];

  fs.writeFileSync(
    `./backups/cloudinary/assets_${timestamp}.json`,
    JSON.stringify(resources, null, 2)
  );

  console.log(`Backed up ${resources.resources.length} assets`);
}
```

### Backup Retention Policy

| Type | Frequency | Retention | Storage |
|------|-----------|-----------|---------|
| Daily | Every day at 3 AM | 30 days | Primary backup |
| Weekly | Every Sunday | 90 days | Long-term backup |
| Monthly | 1st of month | 1 year | Cold storage/archive |

### Restoration Procedures

#### Database Restoration

**From pg_dump backup:**
```bash
# Restore from .dump file
pg_restore \
  --host=your-host.neon.tech \
  --port=5432 \
  --username=your-username \
  --dbname=neondb \
  --clean \
  --if-exists \
  backup_20251123.dump

# Restore from .sql.gz file
gunzip -c backup_20251123.sql.gz | psql $DATABASE_URL
```

#### Environment Restoration

```bash
# Decrypt environment file
gpg --decrypt .env.gpg > .env

# Upload to Vercel
vercel env add DATABASE_URL production
vercel env add AUTH_SECRET production
```

### Disaster Recovery Plan

#### Scenario 1: Database Corruption

**Steps:**
1. Stop all write operations
2. Identify last known good backup
3. Restore from backup
4. Verify data integrity
5. Resume operations

**Recovery Time Objective (RTO):** 2 hours
**Recovery Point Objective (RPO):** 24 hours

#### Scenario 2: Complete Data Loss

**Steps:**
1. Provision new database
2. Restore latest backup
3. Update environment variables
4. Restore Cloudinary assets
5. Verify application functionality

**RTO:** 4 hours
**RPO:** 24 hours

---

## System Health & Maintenance

### Quick Health Check (5 Minutes)

#### 1. Health Endpoint
```bash
curl https://your-domain.com/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "checks": {
    "database": { "status": "pass", "responseTime": <100 },
    "environment": { "status": "pass" },
    "system": { "status": "pass" }
  }
}
```

**Red Flags:**
- ❌ `status: "unhealthy"`
- ❌ Database response time > 1000ms
- ❌ Missing environment variables

#### 2. Admin Dashboard
1. Visit `/admin/system`
2. Check:
   - ✅ Database: Healthy (green)
   - ✅ Recent Errors: 0 in last 24h
   - ✅ Cron Jobs: All successful
   - ✅ Memory Usage: < 80%

#### 3. Error Logs
1. Visit `/admin/system-logs`
2. Filter: Level = ERROR, Last 24h
3. Expected: 0-2 errors max
4. Review any CRITICAL errors immediately

### Daily Monitoring Checklist

**Morning Check (9 AM):**
- [ ] Review `/admin/system` dashboard
- [ ] Check error count (last 24h)
- [ ] Verify cron job executions
- [ ] Review database response time
- [ ] Check memory usage
- [ ] Scan for security alerts

**Key Metrics:**

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Error Rate | 0-5/day | 6-20/day | >20/day |
| DB Response | <100ms | 100-500ms | >1000ms |
| Memory Usage | <60% | 60-80% | >80% |
| API Response | <200ms | 200-500ms | >1000ms |
| Uptime | 99.9%+ | 99-99.9% | <99% |

### Weekly Deep Check (Monday 10 AM)

- [ ] Review weekly analytics snapshot
- [ ] Check backup completion
- [ ] Review cron job success rate
- [ ] Analyze slow API routes
- [ ] Check Cloudinary usage
- [ ] Review user growth trends
- [ ] Database size check

### Monthly Health Audit

- [ ] Test backup restoration
- [ ] Review all system logs
- [ ] Analyze performance trends
- [ ] Check for unused resources
- [ ] Security audit
- [ ] Dependency updates
- [ ] Database optimization

### Performance Benchmarks

**API Response Times (P95):**

| Endpoint | Target | Warning | Action Required |
|----------|--------|---------|-----------------|
| `GET /api/properties` | <200ms | 200-500ms | >500ms |
| `POST /api/properties` | <300ms | 300-700ms | >700ms |
| `GET /api/health` | <50ms | 50-100ms | >100ms |

**Page Load Times:**

| Page | Target | Warning | Critical |
|------|--------|---------|----------|
| Homepage | <1s | 1-2s | >2s |
| Properties List | <1.5s | 1.5-3s | >3s |
| Property Detail | <1s | 1-2s | >2s |

**Web Vitals:**

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | <2.5s | 2.5-4s | >4s |
| FID | <100ms | 100-300ms | >300ms |
| CLS | <0.1 | 0.1-0.25 | >0.25 |

### Scaling Guidelines

**When to Scale Up:**

**Database:**
- Response times consistently > 200ms
- Connection pool frequently maxed
- Storage > 80% of plan limit

**Options:**
1. Upgrade Neon compute tier
2. Enable autoscaling
3. Add read replicas
4. Implement connection pooling

**Serverless Functions:**
- Frequent timeouts
- High function execution duration
- Memory errors

**Options:**
1. Increase function timeout
2. Optimize function code
3. Split large functions
4. Use edge functions

---

## Troubleshooting

### Common Issues

#### Issue 1: High Error Rate

**Symptoms:**
- More than 20 errors per day
- ERROR/CRITICAL logs in system logs
- User complaints

**Diagnosis:**
```bash
curl -H "Authorization: Bearer TOKEN" \
  https://your-domain.com/api/admin/system-logs?level=ERROR&limit=50
```

**Solutions:**
1. Identify error pattern from logs
2. Check recent deployments (rollback if needed)
3. Review error stack traces
4. Fix and deploy patch
5. Monitor for recurrence

#### Issue 2: Slow Database

**Symptoms:**
- DB response time > 500ms
- "degraded" status in health check
- Slow page loads

**Diagnosis:**
```sql
-- Check for long-running queries
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Solutions:**
1. **Add Indexes:**
   ```sql
   CREATE INDEX idx_properties_search ON properties (city, status, type);
   ```

2. **Optimize Queries:**
   - Use `.select()` to limit returned fields
   - Add pagination to large queries
   - Use database-level filtering

3. **Clean Old Data:**
   - Run cleanup cron manually if needed
   - Archive old records

4. **Upgrade Database:**
   - Consider higher tier plan
   - Increase compute resources

#### Issue 3: High Memory Usage

**Symptoms:**
- Memory > 80% in system dashboard
- Out of memory errors
- Function timeouts

**Solutions:**
1. **Restart Serverless Functions:**
   - Deploy new version to Vercel

2. **Optimize Code:**
   ```typescript
   // Bad: Loading all data into memory
   const allProperties = await db.property.findMany();

   // Good: Use pagination
   const properties = await db.property.findMany({
     take: 100,
     skip: page * 100,
   });
   ```

3. **Reduce Payload Size:**
   - Compress API responses
   - Lazy load images
   - Paginate large datasets

#### Issue 4: Cron Job Failures

**Symptoms:**
- Failed status in `/admin/system`
- Missing weekly analytics
- Logs not being cleaned up

**Solutions:**
1. **Verify CRON_SECRET:**
   ```bash
   # In Vercel dashboard
   Settings → Environment Variables → CRON_SECRET
   ```

2. **Test Manually:**
   ```bash
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
     https://your-domain.com/api/cron/cleanup-logs
   ```

3. **Check Vercel Cron Logs:**
   - Go to Vercel Dashboard
   - Deployments → Functions
   - View cron execution logs

### Emergency Procedures

#### Complete System Failure

1. **Immediate Actions:**
   - Check Vercel status page
   - Verify DNS settings
   - Test health endpoint
   - Check database connectivity

2. **Diagnosis:**
   - Review recent deploys
   - Check error logs
   - Verify environment variables
   - Test in development

3. **Recovery:**
   - Roll back if recent deploy
   - Restore from backup if needed
   - Fix underlying issue
   - Verify functionality
   - Monitor closely

### Troubleshooting Quick Reference

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| Site won't load | Deployment failure | Rollback in Vercel |
| Slow pages | Database slow | Check indexes |
| 500 errors | Code error | Check error logs |
| Login fails | Auth misconfigured | Verify env vars |
| Images won't load | Cloudinary issue | Check API keys |
| Cron not running | CRON_SECRET wrong | Update env var |
| High memory | Memory leak | Redeploy |
| DB connection errors | Connection pool full | Upgrade plan |

---

## Support & Resources

### Documentation

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js 15 Documentation:** https://nextjs.org/docs
- **Prisma Documentation:** https://www.prisma.io/docs
- **next-intl Documentation:** https://next-intl-docs.vercel.app/

### Service Support

- **Vercel Support:** support@vercel.com
- **Neon Support:** https://neon.tech/docs/introduction/support
- **Supabase Support:** support@supabase.io
- **Cloudinary Support:** support@cloudinary.com
- **Resend Support:** support@resend.com

### Emergency Contacts

- **On-Call Engineer:** [Your contact info]
- **Database Emergency:** [Database provider support]
- **Deployment Issues:** support@vercel.com

### Best Practices

1. **Proactive Monitoring**
   - Check dashboards daily
   - Set up automated alerts
   - Don't wait for user reports

2. **Regular Maintenance**
   - Follow maintenance schedule
   - Keep dependencies updated
   - Clean old data regularly

3. **Documentation**
   - Keep runbooks updated
   - Document all incidents
   - Share learnings with team

4. **Testing**
   - Test in staging first
   - Have rollback plan ready
   - Monitor after deploys

5. **Communication**
   - Keep stakeholders informed
   - Use status page for outages
   - Post-mortem after incidents

---

## Appendix

### Useful Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Run production build locally

# Database
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create and apply migration
npx prisma migrate deploy # Apply migrations (production)
npx prisma studio        # Open Prisma Studio
npx prisma db seed       # Seed database

# Deployment
vercel                   # Deploy to preview
vercel --prod            # Deploy to production
vercel env pull          # Pull environment variables
vercel logs              # View deployment logs

# Code Quality
npm run lint             # Check for linting issues
npm run lint -- --fix    # Fix auto-fixable issues
```

### Environment Variables Checklist

Required for production:
- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `RESEND_API_KEY`
- [ ] `CRON_SECRET`

Optional:
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER`

---

**Last Updated:** 2025-11-23

**Version:** 1.0.0

**Status:** Production Ready ✅
