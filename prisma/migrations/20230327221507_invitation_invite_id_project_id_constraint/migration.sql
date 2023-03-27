/*
  Warnings:

  - A unique constraint covering the columns `[invitedId,projectId]` on the table `MemberInvitation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MemberInvitation_invitedId_projectId_key" ON "MemberInvitation"("invitedId", "projectId");
