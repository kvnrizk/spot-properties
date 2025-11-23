-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'LBP');

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "platformName" TEXT NOT NULL DEFAULT 'Spot Properties',
    "supportEmail" TEXT NOT NULL DEFAULT 'support@spotproperties.com',
    "defaultCurrency" "Currency" NOT NULL DEFAULT 'USD',
    "whatsappNumber" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "defaultMetaTitle" TEXT,
    "defaultMetaDescription" TEXT,
    "homepageTitle" TEXT,
    "homepageSubtitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
