-- CreateTable
CREATE TABLE "MemberInvitation" (
    "id" TEXT NOT NULL,
    "role" "OrganizationRole" NOT NULL DEFAULT 'User',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitedId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "organizationId" TEXT,
    "projectId" TEXT,

    CONSTRAINT "MemberInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "role" "OrganizationRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "projectId" TEXT,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberInvitation_invitedId_organizationId_key" ON "MemberInvitation"("invitedId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_organizationId_key" ON "Member"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_projectId_key" ON "Member"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "MemberInvitation" ADD CONSTRAINT "MemberInvitation_invitedId_fkey" FOREIGN KEY ("invitedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberInvitation" ADD CONSTRAINT "MemberInvitation_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberInvitation" ADD CONSTRAINT "MemberInvitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberInvitation" ADD CONSTRAINT "MemberInvitation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
