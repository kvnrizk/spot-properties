# System Health Check Guide

Comprehensive guide for monitoring, maintaining, and troubleshooting Spot Properties production system.

## Table of Contents

1. [Quick Health Check](#quick-health-check)
2. [Daily Monitoring Checklist](#daily-monitoring-checklist)
3. [Performance Benchmarks](#performance-benchmarks)
4. [Common Issues & Solutions](#common-issues--solutions)
5. [System Metrics](#system-metrics)
6. [Scaling Guidelines](#scaling-guidelines)
7. [Maintenance Schedule](#maintenance-schedule)
8. [Incident Response](#incident-response)

---

## Quick Health Check

### 5-Minute System Check

Run these checks daily to ensure system health:

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

#### 4. Vercel Analytics
1. Go to Vercel Dashboard → Analytics
2. Check:
   - ✅ No 5xx errors
   - ✅ Average response time < 500ms
   - ✅ No traffic drops

---

## Daily Monitoring Checklist

### Morning Check (9 AM)

- [ ] Review `/admin/system` dashboard
- [ ] Check error count (last 24h)
- [ ] Verify cron job executions
- [ ] Review database response time
- [ ] Check memory usage
- [ ] Scan for security alerts

### Key Metrics to Track

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

---

## Performance Benchmarks

### API Response Times (P95)

| Endpoint | Target | Warning | Action Required |
|----------|--------|---------|-----------------|
| `GET /api/properties` | <200ms | 200-500ms | >500ms |
| `POST /api/properties` | <300ms | 300-700ms | >700ms |
| `GET /api/health` | <50ms | 50-100ms | >100ms |
| `POST /api/leads` | <150ms | 150-400ms | >400ms |
| `GET /api/appointments` | <100ms | 100-300ms | >300ms |

### Database Queries

| Operation | Target | Warning | Action |
|-----------|--------|---------|--------|
| SELECT (simple) | <50ms | 50-200ms | Add index |
| SELECT (complex) | <200ms | 200-500ms | Optimize query |
| INSERT | <100ms | 100-300ms | Check constraints |
| UPDATE | <100ms | 100-300ms | Check indexes |
| DELETE | <100ms | 100-300ms | Check cascades |

### Page Load Times

| Page | Target | Warning | Critical |
|------|--------|---------|----------|
| Homepage | <1s | 1-2s | >2s |
| Properties List | <1.5s | 1.5-3s | >3s |
| Property Detail | <1s | 1-2s | >2s |
| Admin Dashboard | <2s | 2-4s | >4s |

### Web Vitals (Core)

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | <2.5s | 2.5-4s | >4s |
| FID (First Input Delay) | <100ms | 100-300ms | >300ms |
| CLS (Cumulative Layout Shift) | <0.1 | 0.1-0.25 | >0.25 |
| TTFB (Time to First Byte) | <800ms | 800-1800ms | >1800ms |

---

## Common Issues & Solutions

### Issue 1: High Error Rate

**Symptoms:**
- More than 20 errors per day
- ERROR/CRITICAL logs in system logs
- User complaints

**Diagnosis:**
```bash
# Check error distribution
curl -H "Authorization: Bearer TOKEN" \
  https://your-domain.com/api/admin/system-logs?level=ERROR&limit=50
```

**Solutions:**
1. Identify error pattern from logs
2. Check recent deployments (rollback if needed)
3. Review error stack traces
4. Fix and deploy patch
5. Monitor for recurrence

### Issue 2: Slow Database

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
   -- Example: Index for property search
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
   - Consider higher tier Neon/Supabase plan
   - Increase compute resources

### Issue 3: High Memory Usage

**Symptoms:**
- Memory > 80% in system dashboard
- Out of memory errors
- Function timeouts

**Diagnosis:**
- Check `/admin/system` memory section
- Review memory trends over time
- Identify memory leaks in logs

**Solutions:**
1. **Restart Serverless Functions:**
   - Deploy new version to Vercel
   - Triggers function cold start

2. **Optimize Code:**
   ```typescript
   // Bad: Loading all data into memory
   const allProperties = await db.property.findMany();

   // Good: Use pagination and streaming
   const properties = await db.property.findMany({
     take: 100,
     skip: page * 100,
   });
   ```

3. **Reduce Payload Size:**
   - Compress API responses
   - Lazy load images
   - Paginate large datasets

### Issue 4: Cron Job Failures

**Symptoms:**
- Failed status in `/admin/system`
- Missing weekly analytics
- Logs not being cleaned up

**Diagnosis:**
1. Check cron job logs:
   ```typescript
   import { getCronJobHistory } from "@/lib/cron-logger";
   const history = await getCronJobHistory("cleanup-logs", 10);
   ```

2. Review error messages
3. Check `CRON_SECRET` environment variable

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

### Issue 5: High 404 Error Rate

**Symptoms:**
- Many 404s in Vercel analytics
- Broken links reported
- Missing pages

**Diagnosis:**
```bash
# Check system logs for 404s
curl https://your-domain.com/api/admin/system-logs?statusCode=404
```

**Solutions:**
1. **Fix Broken Links:**
   - Use Next.js Link component
   - Validate URLs before saving

2. **Add Redirects:**
   ```javascript
   // next.config.js
   module.exports = {
     async redirects() {
       return [
         {
           source: '/old-path',
           destination: '/new-path',
           permanent: true,
         },
       ];
     },
   };
   ```

3. **Improve 404 Page:**
   - Add search functionality
   - Suggest popular pages
   - Link to homepage

---

## System Metrics

### Database Metrics

**Monitor in Neon/Supabase Dashboard:**

1. **Connection Count**
   - Healthy: < 80% of max connections
   - Warning: 80-95%
   - Critical: > 95%

2. **Storage Usage**
   - Track growth rate
   - Plan upgrades proactively
   - Clean old data regularly

3. **Query Performance**
   - Monitor slow queries (> 1s)
   - Identify N+1 query problems
   - Optimize with indexes

### API Metrics

**Track in Vercel Analytics:**

1. **Request Volume**
   - Baseline: Average requests/day
   - Monitor for unusual spikes
   - Plan scaling accordingly

2. **Error Rate**
   - Target: < 0.1%
   - Warning: 0.1-1%
   - Critical: > 1%

3. **Function Duration**
   - Most functions: < 1s
   - Heavy operations: < 5s
   - Max timeout: 10s (configured)

### Cloudinary Metrics

**Monitor in Cloudinary Dashboard:**

1. **Storage**
   - Current usage vs. plan limit
   - Growth rate
   - Unused assets

2. **Bandwidth**
   - Monthly bandwidth usage
   - Peak usage times
   - Optimization opportunities

3. **Transformations**
   - Transformation credits used
   - Caching effectiveness
   - Optimization settings

---

## Scaling Guidelines

### When to Scale Up

#### Database

**Scale up if:**
- Response times consistently > 200ms
- Connection pool frequently maxed
- Storage > 80% of plan limit
- Running out of concurrent connections

**Options:**
1. Upgrade Neon compute tier
2. Enable autoscaling
3. Add read replicas
4. Implement connection pooling

#### Serverless Functions

**Scale up if:**
- Frequent timeouts
- High function execution duration
- Memory errors
- Concurrent execution limits hit

**Options:**
1. Increase function timeout (max 300s on Pro)
2. Optimize function code
3. Split large functions
4. Use edge functions for speed

#### Storage (Cloudinary)

**Scale up if:**
- > 80% of storage used
- Bandwidth limits reached
- Transformation limits exceeded

**Options:**
1. Upgrade Cloudinary plan
2. Implement lazy loading
3. Use responsive images
4. Clean unused assets

### Horizontal Scaling

Spot Properties is designed for serverless scaling:

1. **Automatic Scaling**
   - Vercel automatically scales functions
   - No manual intervention needed
   - Pay per execution

2. **Database Scaling**
   - Neon autoscaling (Pro plan)
   - Supabase connection pooling
   - Read replicas for read-heavy loads

3. **CDN Caching**
   - Static assets cached at edge
   - Cloudinary CDN for images
   - Vercel Edge Network

---

## Maintenance Schedule

### Daily
- ✅ Review error logs
- ✅ Check system health
- ✅ Monitor cron executions

### Weekly
- ✅ Review analytics snapshot
- ✅ Check backup completion
- ✅ Review slow queries
- ✅ Update dependencies (security)

### Monthly
- ✅ Test backup restoration
- ✅ Security audit
- ✅ Performance optimization
- ✅ Review scaling needs
- ✅ Update documentation

### Quarterly
- ✅ Comprehensive security review
- ✅ Database optimization
- ✅ Cost optimization analysis
- ✅ Disaster recovery drill
- ✅ Team training/documentation review

---

## Incident Response

### Severity Levels

#### P0 - Critical (Production Down)
**Examples:**
- Site completely down
- Database unreachable
- Authentication broken

**Response:**
1. Page on-call engineer immediately
2. Create incident channel
3. Roll back recent changes
4. Restore from backup if needed
5. Post-incident review within 24h

**SLA:** 15 minutes response, 1 hour resolution

#### P1 - High (Major Functionality Broken)
**Examples:**
- Property creation failing
- Payment processing down
- Admin panel inaccessible

**Response:**
1. Notify team
2. Investigate within 30 minutes
3. Fix or roll back
4. Monitor closely

**SLA:** 30 minutes response, 4 hours resolution

#### P2 - Medium (Degraded Performance)
**Examples:**
- Slow page loads
- Intermittent errors
- Minor feature broken

**Response:**
1. Create ticket
2. Investigate within 2 hours
3. Fix in next deploy
4. Monitor

**SLA:** 2 hours response, 24 hours resolution

#### P3 - Low (Minor Issue)
**Examples:**
- Cosmetic bugs
- Non-critical feature requests
- Documentation updates

**Response:**
1. Add to backlog
2. Fix in regular cycle

**SLA:** 1 week response, flexible resolution

### Incident Template

```markdown
## Incident Report

**Date:** YYYY-MM-DD
**Severity:** P0/P1/P2/P3
**Status:** Investigating / Mitigated / Resolved

### Summary
Brief description of the incident

### Timeline
- HH:MM - Incident detected
- HH:MM - Team notified
- HH:MM - Root cause identified
- HH:MM - Fix deployed
- HH:MM - Incident resolved

### Impact
- Affected users: X
- Duration: X minutes
- Services affected: List

### Root Cause
Technical explanation of what went wrong

### Resolution
How the incident was resolved

### Action Items
- [ ] Immediate fix
- [ ] Long-term solution
- [ ] Documentation update
- [ ] Monitoring improvements

### Lessons Learned
What we learned and how to prevent recurrence
```

---

## Health Check Automation

### Setup Monitoring

**Using UptimeRobot:**
1. Create HTTP(s) monitor
2. URL: `https://your-domain.com/api/health`
3. Interval: 5 minutes
4. Alert contacts: Team email/Slack

**Using Pingdom:**
1. Create Uptime Check
2. Check type: HTTP
3. URL: `/api/health`
4. Expected HTTP status: 200
5. Alert when down

**Using Vercel Monitoring:**
1. Automatically enabled
2. View in Vercel dashboard
3. Configure alerts in settings

### Custom Alerts

Set up alerts for:
- Health check failures
- Error rate spikes (> 20/hour)
- Slow database (> 1s)
- Cron job failures
- Memory usage (> 80%)
- Disk space (> 90%)

---

## System Health Dashboard

### Key Indicators

Create a status page showing:

1. **System Status**
   - 🟢 All systems operational
   - 🟡 Degraded performance
   - 🔴 Service disruption

2. **Uptime**
   - Last 30 days
   - Last 90 days
   - Historical uptime %

3. **Performance**
   - Average response time
   - Error rate
   - Active users

4. **Scheduled Maintenance**
   - Upcoming maintenance windows
   - Expected downtime

---

## Troubleshooting Quick Reference

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

## Best Practices

1. **Proactive Monitoring**
   - Don't wait for user reports
   - Check dashboards daily
   - Set up automated alerts

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

## Emergency Procedures

### Complete System Failure

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

### Contact Information

- **Vercel Support**: support@vercel.com (include project ID)
- **Neon Support**: https://neon.tech/docs/introduction/support
- **Cloudinary Support**: support@cloudinary.com
- **On-Call Engineer**: [Your contact info]

---

## Health Check Logs

Track all system health checks and incidents:

| Date | Status | Issues | Actions Taken | Notes |
|------|--------|--------|---------------|-------|
| 2025-11-23 | ✅ Healthy | None | Regular check | All systems normal |

Keep this log in a shared document accessible to the entire team.
