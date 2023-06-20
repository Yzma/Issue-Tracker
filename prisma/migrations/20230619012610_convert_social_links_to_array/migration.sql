/*
  Warnings:

  - You are about to drop the column `socialLink1` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `socialLink2` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `socialLink3` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `socialLink4` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "socialLink1",
DROP COLUMN "socialLink2",
DROP COLUMN "socialLink3",
DROP COLUMN "socialLink4",
ADD COLUMN     "socialLinks" TEXT[];
