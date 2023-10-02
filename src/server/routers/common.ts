import { Project as PrismaProject } from '@prisma/client'
import { z } from 'zod'
import prisma from '@/lib/prisma/prisma'
import { NAMESPACE } from '@/lib/zod-schemas'

export type Project = PrismaProject & {
  namespace: string
}

const getProjectsWithInvitationsSchema = z.object({
  namespace: NAMESPACE,
  userId: z.string().min(1),
})

const getProjectsSchema = z.object({
  namespace: NAMESPACE,
  showAllProjects: z.boolean(),
})

// Gets projects for an authenticated user who is viewing another users/organizations projects
export async function getProjectsWithInvitations(
  namespace: string,
  userId: string
) {
  if (getProjectsWithInvitationsSchema.parse({ namespace, userId })) {
    throw new Error('Invalid namespace or userId provided')
  }

  const result = await prisma.$queryRaw<Project[]>`
      SELECT "Project".*, "Namespace"."name" as namespace
      FROM public."Project"
      INNER JOIN public."Namespace" ON "Namespace".id = "Project"."namespaceId"
      WHERE "Namespace"."name" ILIKE ${namespace}
      AND (
          "Project".private = 'false'
          OR EXISTS (
              SELECT 1
              FROM public."Member"
              WHERE "Member"."projectId" = "Project".id
              AND "Member"."userId" = ${userId}
              AND "Member"."acceptedAt" IS NOT NULL
          )
      ) ORDER BY "Project"."updatedAt" DESC;`
  return result
}

// Returns the projects of a user. This function is being ran from the perspective of someone who is viewing their own projects, or isn't logged in
export async function getProjects(namespace: string, showAllProjects: boolean) {
  if (!getProjectsSchema.parse({ namespace, showAllProjects })) {
    throw new Error('Invalid namespace or showAllProjects value provided')
  }

  // It doesn't seem possible to add a condition inside the query statement as prisma just assumes it's a variable and throws an error
  if (showAllProjects) {
    return prisma.$queryRaw<Project[]>`
    SELECT "Project".*, "Namespace"."name" as namespace
    FROM public."Project"
    INNER JOIN public."Namespace" ON "Namespace".id = "Project"."namespaceId"
    WHERE "Namespace"."name" ILIKE ${namespace}
    ORDER BY "Project"."updatedAt" DESC;`
  }

  return prisma.$queryRaw<Project[]>`
    SELECT "Project".*, "Namespace"."name" as namespace
    FROM public."Project"
    INNER JOIN public."Namespace" ON "Namespace".id = "Project"."namespaceId"
    WHERE "Namespace"."name" ILIKE ${namespace}
    AND "Project".private = 'false'
    ORDER BY "Project"."updatedAt" DESC;`
}
