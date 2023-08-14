-- CreateIndex
CREATE INDEX "Comment_userId_issueId_idx" ON "Comment"("userId", "issueId");

-- CreateIndex
CREATE INDEX "Issue_name_open_createdAt_updatedAt_userId_projectId_idx" ON "Issue"("name", "open", "createdAt", "updatedAt", "userId", "projectId");

-- CreateIndex
CREATE INDEX "Label_projectId_idx" ON "Label"("projectId");

-- CreateIndex
CREATE INDEX "Member_userId_inviteeId_organizationId_projectId_idx" ON "Member"("userId", "inviteeId", "organizationId", "projectId");

-- CreateIndex
CREATE INDEX "Project_name_namespaceId_idx" ON "Project"("name", "namespaceId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
