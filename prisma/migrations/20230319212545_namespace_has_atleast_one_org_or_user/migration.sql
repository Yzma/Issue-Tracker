-- This is an empty migration.

ALTER TABLE "Namespace" ADD CONSTRAINT "ensure_userId_or_orgId_exists" CHECK(num_nonnulls(("organizationId"), ("userId")) = 1);