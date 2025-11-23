# Backup & Disaster Recovery Guide

Complete backup strategy and disaster recovery procedures for Spot Properties.

## Table of Contents

1. [Overview](#overview)
2. [Database Backups](#database-backups)
3. [Cloudinary Asset Backups](#cloudinary-asset-backups)
4. [Environment Configuration](#environment-configuration)
5. [Backup Retention Policy](#backup-retention-policy)
6. [Restoration Procedures](#restoration-procedures)
7. [Disaster Recovery Plan](#disaster-recovery-plan)
8. [Automated Backup Scripts](#automated-backup-scripts)

---

## Overview

### Backup Components

Spot Properties consists of several components that require backup:

1. **PostgreSQL Database** (Neon/Supabase)
   - User accounts
   - Properties
   - Leads and appointments
   - Activity logs and system logs
   - Settings

2. **Cloudinary Assets**
   - Property images
   - Uploaded media files

3. **Environment Configuration**
   - API keys
   - Database credentials
   - Authentication secrets

4. **Application Code** (Git repository)
   - Source code
   - Configuration files

### Backup Frequency

| Component | Frequency | Retention |
|-----------|-----------|-----------|
| Database | Daily | 30 days |
| Database (Weekly) | Weekly | 90 days |
| Cloudinary Assets | Weekly | 30 days |
| Environment Config | On change | Indefinite (secure storage) |
| Code Repository | On commit | Indefinite (GitHub) |

---

## Database Backups

### Using Neon (Recommended)

#### Automatic Backups

Neon provides automatic daily backups:

1. **Point-in-Time Recovery (PITR)**
   - Available on Pro plans
   - Restore to any point within retention period
   - Default retention: 7 days (configurable up to 30 days)

2. **Branch-Based Backups**
   - Create database branch before major changes
   - Branches are isolated copies of your database
   - Zero-downtime testing and rollback

#### Manual Backup (pg_dump)

**Create a backup:**

```bash
# Set your database URL
export DATABASE_URL="postgresql://user:password@host:5432/neondb"

# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# With compression
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

**Backup to file with schema and data:**

```bash
pg_dump \
  --host=your-neon-host.neon.tech \
  --port=5432 \
  --username=your-username \
  --dbname=neondb \
  --format=custom \
  --file=spotproperties_backup_$(date +%Y%m%d).dump
```

#### Automated Daily Backups

**Using Neon API:**

```typescript
// Save as scripts/backup-database.ts
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function backupDatabase() {
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `backup_${timestamp}.sql.gz`;

  const command = `pg_dump ${process.env.DATABASE_URL} | gzip > ./backups/${filename}`;

  try {
    await execAsync(command);
    console.log(`Backup created: ${filename}`);

    // Upload to cloud storage (S3, R2, etc.)
    // await uploadToStorage(filename);
  } catch (error) {
    console.error("Backup failed:", error);
    throw error;
  }
}

backupDatabase();
```

**Schedule via Vercel Cron:**

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/backup-database",
      "schedule": "0 3 * * *"
    }
  ]
}
```

### Using Supabase

#### Automatic Backups

Supabase provides automated daily backups:

1. Navigate to Supabase Dashboard
2. Go to Database → Backups
3. View automatic daily backups (retained 7 days on Free, 30+ days on Pro)

#### Manual Backup

**Via Supabase Dashboard:**
1. Go to Database → Backups
2. Click "Create Backup"
3. Enter backup name
4. Wait for completion
5. Download if needed

**Via pg_dump:**
```bash
# Get connection string from Supabase Dashboard
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Database Backup Script

Create `scripts/backup-db.sh`:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="./backups/database"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="spotproperties_${DATE}.sql.gz"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Create backup
echo "Starting database backup..."
pg_dump $DATABASE_URL | gzip > "$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Backup completed: $BACKUP_FILE"

  # Delete old backups
  find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
  echo "Deleted backups older than $RETENTION_DAYS days"
else
  echo "Backup failed!"
  exit 1
fi

# Optional: Upload to cloud storage
# aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" s3://your-bucket/backups/
```

Make executable:
```bash
chmod +x scripts/backup-db.sh
```

---

## Cloudinary Asset Backups

### Manual Backup

**Using Cloudinary Admin API:**

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
    prefix: "spot-properties/", // Your folder prefix
  });

  // Save metadata
  const fs = require("fs");
  const timestamp = new Date().toISOString().split("T")[0];

  fs.writeFileSync(
    `./backups/cloudinary/assets_${timestamp}.json`,
    JSON.stringify(resources, null, 2)
  );

  console.log(`Backed up ${resources.resources.length} assets`);
}

backupCloudinaryAssets();
```

### Download Assets

**Download all images:**

```bash
# Create backup directory
mkdir -p backups/cloudinary/images

# Download using wget or curl
# Get URLs from the metadata backup above
```

**Automated download script:**

```typescript
import fs from "fs";
import https from "https";

async function downloadAsset(url: string, filename: string) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(true);
      });
    }).on("error", (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function backupAllAssets() {
  const metadata = JSON.parse(
    fs.readFileSync("./backups/cloudinary/assets_latest.json", "utf-8")
  );

  for (const resource of metadata.resources) {
    const filename = `./backups/cloudinary/images/${resource.public_id.replace(/\//g, "_")}.${resource.format}`;
    await downloadAsset(resource.secure_url, filename);
    console.log(`Downloaded: ${filename}`);
  }
}

backupAllAssets();
```

### Cloudinary Backup Add-on

For automatic backups, consider Cloudinary Backup Add-on:
- Automated daily backups
- 30-day retention
- One-click restoration
- Available on paid plans

---

## Environment Configuration

### Secure Storage

Store environment variables securely:

1. **Vercel Environment Variables**
   - Already encrypted and backed up by Vercel
   - Download via Vercel CLI:
   ```bash
   vercel env pull .env.production
   ```

2. **Local Encrypted Backup**
   ```bash
   # Create encrypted backup of .env
   gpg --symmetric --cipher-algo AES256 .env
   # Creates .env.gpg

   # Store in secure location (password manager, encrypted drive)
   ```

3. **Password Manager**
   - Store critical credentials in 1Password, LastPass, or Bitwarden
   - Share with team securely

### Environment Variables Checklist

Ensure these are backed up:

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CRON_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

---

## Backup Retention Policy

### Daily Backups

- **Frequency**: Every day at 3 AM UTC
- **Retention**: 30 days
- **Storage**: Primary backup location
- **Type**: Full database dump

### Weekly Backups

- **Frequency**: Every Sunday at 1 AM UTC
- **Retention**: 90 days (3 months)
- **Storage**: Long-term backup location
- **Type**: Full database + Cloudinary metadata

### Monthly Backups

- **Frequency**: 1st of each month
- **Retention**: 1 year
- **Storage**: Cold storage / archive
- **Type**: Complete system snapshot

### Backup Cleanup

Automated cleanup runs daily via cron:

```typescript
// Cleanup script
const RETENTION_DAYS = {
  daily: 30,
  weekly: 90,
  monthly: 365,
};

async function cleanupOldBackups() {
  const now = Date.now();

  for (const [type, days] of Object.entries(RETENTION_DAYS)) {
    const cutoffDate = now - (days * 24 * 60 * 60 * 1000);

    // Delete files older than cutoff
    // Implementation depends on storage location
  }
}
```

---

## Restoration Procedures

### Database Restoration

#### From Neon Backup

**Using Point-in-Time Recovery:**

1. Go to Neon Console
2. Select your project
3. Navigate to "Backups"
4. Choose restore point
5. Select "Restore to new branch" or "Restore in place"
6. Confirm restoration

**Using pg_restore:**

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

#### From Supabase Backup

1. Go to Supabase Dashboard
2. Database → Backups
3. Find backup to restore
4. Click "Restore"
5. Confirm action
6. Wait for completion

### Cloudinary Asset Restoration

**Re-upload from backup:**

```typescript
async function restoreCloudinaryAssets(backupDir: string) {
  const files = fs.readdirSync(backupDir);

  for (const file of files) {
    const filePath = path.join(backupDir, file);

    await cloudinary.v2.uploader.upload(filePath, {
      folder: "spot-properties",
      public_id: file.split(".")[0],
      overwrite: true,
    });

    console.log(`Restored: ${file}`);
  }
}

restoreCloudinaryAssets("./backups/cloudinary/images");
```

### Environment Restoration

1. **Decrypt environment file:**
   ```bash
   gpg --decrypt .env.gpg > .env
   ```

2. **Upload to Vercel:**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add AUTH_SECRET production
   # ... etc
   ```

3. **Verify:**
   - Check `/api/health`
   - Test authentication
   - Verify database connection

---

## Disaster Recovery Plan

### Scenario 1: Database Corruption

**Steps:**
1. Stop all write operations
2. Identify last known good backup
3. Restore from backup (see [Database Restoration](#database-restoration))
4. Verify data integrity
5. Resume operations
6. Review logs to identify cause

**Recovery Time Objective (RTO)**: 2 hours
**Recovery Point Objective (RPO)**: 24 hours (last daily backup)

### Scenario 2: Complete Data Loss

**Steps:**
1. Provision new database
2. Restore latest backup
3. Update environment variables
4. Restore Cloudinary assets
5. Verify application functionality
6. Update DNS if necessary

**RTO**: 4 hours
**RPO**: 24 hours

### Scenario 3: Vercel Account Compromise

**Steps:**
1. Contact Vercel support immediately
2. Deploy to backup hosting (e.g., separate Vercel account, Railway, Render)
3. Restore database from backup
4. Update environment variables
5. Update DNS to point to new deployment

**RTO**: 6 hours
**RPO**: 24 hours

### Scenario 4: Accidental Data Deletion

**Steps:**
1. Check activity logs for deletion records
2. If within retention period, use point-in-time recovery
3. Otherwise, restore from latest backup
4. Verify restored data
5. Implement additional safeguards (soft deletes, confirmation dialogs)

**RTO**: 1 hour
**RPO**: Depends on backup frequency

---

## Automated Backup Scripts

### Complete Backup Script

```bash
#!/bin/bash
# scripts/full-backup.sh

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_ROOT="./backups"
DB_BACKUP_DIR="$BACKUP_ROOT/database"
ASSETS_BACKUP_DIR="$BACKUP_ROOT/cloudinary"

# Create directories
mkdir -p $DB_BACKUP_DIR
mkdir -p $ASSETS_BACKUP_DIR

echo "=== Starting Full Backup: $TIMESTAMP ==="

# 1. Database Backup
echo "Backing up database..."
pg_dump $DATABASE_URL | gzip > "$DB_BACKUP_DIR/db_${TIMESTAMP}.sql.gz"
echo "✓ Database backup complete"

# 2. Cloudinary Metadata Backup
echo "Backing up Cloudinary metadata..."
node scripts/backup-cloudinary-metadata.js > "$ASSETS_BACKUP_DIR/assets_${TIMESTAMP}.json"
echo "✓ Cloudinary metadata backup complete"

# 3. Environment Backup
echo "Backing up environment..."
gpg --symmetric --cipher-algo AES256 --batch --yes --passphrase="$BACKUP_PASSPHRASE" .env -o "$BACKUP_ROOT/env_${TIMESTAMP}.env.gpg"
echo "✓ Environment backup complete"

# 4. Upload to cloud storage (optional)
if [ ! -z "$S3_BUCKET" ]; then
  echo "Uploading to S3..."
  aws s3 sync $BACKUP_ROOT s3://$S3_BUCKET/spot-properties-backups/
  echo "✓ Cloud upload complete"
fi

echo "=== Backup Complete: $TIMESTAMP ==="
```

### Schedule with GitHub Actions

```yaml
# .github/workflows/backup.yml
name: Daily Backup

on:
  schedule:
    - cron: "0 3 * * *" # 3 AM UTC daily
  workflow_dispatch: # Manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install PostgreSQL client
        run: sudo apt-get install -y postgresql-client

      - name: Create database backup
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz

      - name: Upload to artifact
        uses: actions/upload-artifact@v3
        with:
          name: database-backup
          path: backup_*.sql.gz
          retention-days: 30

      - name: Upload to S3 (optional)
        if: ${{ secrets.AWS_ACCESS_KEY_ID }}
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 cp backup_$(date +%Y%m%d).sql.gz s3://your-bucket/backups/
```

---

## Testing Backups

### Monthly Backup Test

**Procedure:**
1. Create test database/branch
2. Restore latest backup
3. Verify data integrity:
   - Count records
   - Check recent entries
   - Test relationships
4. Document results
5. Delete test instance

**Checklist:**
- [ ] Database restores without errors
- [ ] Record counts match
- [ ] Relationships intact
- [ ] No data corruption
- [ ] Images accessible
- [ ] Environment variables work

---

## Best Practices

1. **Test Regularly**
   - Test restore procedure monthly
   - Verify backup integrity
   - Document any issues

2. **Multiple Locations**
   - Keep backups in multiple locations
   - Use different cloud providers
   - Maintain local copies

3. **Encryption**
   - Encrypt sensitive backups
   - Use strong passwords
   - Rotate encryption keys annually

4. **Monitoring**
   - Monitor backup job execution
   - Alert on failures
   - Track backup size trends

5. **Documentation**
   - Keep this guide updated
   - Document restore procedures
   - Train team members

6. **Automation**
   - Automate all backups
   - Schedule regular cleanup
   - Use CI/CD for backup jobs

---

## Emergency Contacts

- **Vercel Support**: support@vercel.com
- **Neon Support**: support@neon.tech
- **Supabase Support**: support@supabase.io
- **Cloudinary Support**: support@cloudinary.com

## Backup Logs

Track all backup and restore operations:

| Date | Type | Status | Size | Notes |
|------|------|--------|------|-------|
| 2025-11-23 | Database | Success | 45MB | Automated daily |
| 2025-11-23 | Cloudinary | Success | 2GB | Weekly backup |

Keep this log updated in a secure, accessible location.
