/*
  Warnings:

  - You are about to drop the column `clientId` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `User` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_clientId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clientId_fkey";

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "clientId",
ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clientId",
ADD COLUMN     "companyId" TEXT;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
