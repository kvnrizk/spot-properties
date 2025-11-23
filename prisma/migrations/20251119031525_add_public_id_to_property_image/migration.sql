/*
  Warnings:

  - Added the required column `publicId` to the `PropertyImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PropertyImage" ADD COLUMN     "publicId" TEXT NOT NULL;
