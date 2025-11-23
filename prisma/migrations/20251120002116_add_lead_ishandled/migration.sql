-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "isHandled" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Lead_isHandled_idx" ON "Lead"("isHandled");
