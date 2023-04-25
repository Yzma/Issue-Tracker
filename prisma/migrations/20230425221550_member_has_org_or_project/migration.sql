-- This is an empty migration.

ALTER TABLE "Member" ADD CONSTRAINT "ensure_userId_or_orgId_exists" CHECK(num_nonnulls(("organizationId"), ("projectId")) = 1);