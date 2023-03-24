/*
  Warnings:

  - You are about to drop the `OrganizationInvitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationInvitation" DROP CONSTRAINT "OrganizationInvitation_invitedId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationInvitation" DROP CONSTRAINT "OrganizationInvitation_inviteeId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationInvitation" DROP CONSTRAINT "OrganizationInvitation_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMember" DROP CONSTRAINT "OrganizationMember_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMember" DROP CONSTRAINT "OrganizationMember_userId_fkey";

-- DropTable
DROP TABLE "OrganizationInvitation";

-- DropTable
DROP TABLE "OrganizationMember";
