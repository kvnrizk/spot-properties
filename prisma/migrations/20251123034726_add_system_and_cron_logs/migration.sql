-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARN', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('API_REQUEST', 'API_ERROR', 'SYSTEM_ERROR', 'CRON_JOB', 'DATABASE', 'AUTH', 'PERFORMANCE', 'SECURITY');

-- CreateEnum
CREATE TYPE "CronJobStatus" AS ENUM ('SUCCESS', 'FAILED', 'RUNNING');

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" TEXT NOT NULL,
    "level" "LogLevel" NOT NULL,
    "type" "LogType" NOT NULL,
    "message" TEXT NOT NULL,
    "source" TEXT,
    "method" TEXT,
    "url" TEXT,
    "statusCode" INTEGER,
    "responseTime" INTEGER,
    "errorStack" TEXT,
    "errorName" TEXT,
    "userEmail" TEXT,
    "userId" TEXT,
    "locale" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CronJobLog" (
    "id" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "status" "CronJobStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "message" TEXT,
    "error" TEXT,
    "recordsProcessed" INTEGER,
    "metadata" TEXT,

    CONSTRAINT "CronJobLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SystemLog_level_idx" ON "SystemLog"("level");

-- CreateIndex
CREATE INDEX "SystemLog_type_idx" ON "SystemLog"("type");

-- CreateIndex
CREATE INDEX "SystemLog_createdAt_idx" ON "SystemLog"("createdAt");

-- CreateIndex
CREATE INDEX "SystemLog_userEmail_idx" ON "SystemLog"("userEmail");

-- CreateIndex
CREATE INDEX "SystemLog_source_idx" ON "SystemLog"("source");

-- CreateIndex
CREATE INDEX "SystemLog_statusCode_idx" ON "SystemLog"("statusCode");

-- CreateIndex
CREATE INDEX "CronJobLog_jobName_idx" ON "CronJobLog"("jobName");

-- CreateIndex
CREATE INDEX "CronJobLog_status_idx" ON "CronJobLog"("status");

-- CreateIndex
CREATE INDEX "CronJobLog_startedAt_idx" ON "CronJobLog"("startedAt");
