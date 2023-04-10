/*
  Warnings:

  - You are about to drop the column `github` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `linkedIn` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `publicEmail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twitter` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "github",
DROP COLUMN "linkedIn",
DROP COLUMN "publicEmail",
DROP COLUMN "twitter",
ADD COLUMN     "socialLink1" TEXT,
ADD COLUMN     "socialLink2" TEXT,
ADD COLUMN     "socialLink3" TEXT,
ADD COLUMN     "socialLink4" TEXT;
