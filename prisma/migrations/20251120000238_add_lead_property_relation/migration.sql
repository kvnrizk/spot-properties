/*
  Warnings:

  - Made the column `message` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `source` on table `Lead` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "propertyId" TEXT,
ALTER COLUMN "message" SET NOT NULL,
ALTER COLUMN "source" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Lead_propertyId_idx" ON "Lead"("propertyId");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
