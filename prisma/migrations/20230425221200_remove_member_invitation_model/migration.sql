/*
  Warnings:

  - You are about to drop the `MemberInvitation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MemberInvitation" DROP CONSTRAINT "MemberInvitation_invitedId_fkey";

-- DropForeignKey
ALTER TABLE "MemberInvitation" DROP CONSTRAINT "MemberInvitation_inviteeId_fkey";

-- DropForeignKey
ALTER TABLE "MemberInvitation" DROP CONSTRAINT "MemberInvitation_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "MemberInvitation" DROP CONSTRAINT "MemberInvitation_projectId_fkey";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "inviteeId" TEXT;

-- DropTable
DROP TABLE "MemberInvitation";

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
