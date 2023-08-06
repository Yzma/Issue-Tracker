import { Project, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Projects = Project & {
  namespaceName: string
}

export default async function getProjects(namespace: string, userId: string) {
  // TODO: Change this?
  if (!namespace || !userId) {
    throw new Error('namespace or userId cannot be undefined')
  }

  return prisma.$queryRaw<Projects[]>`
      SELECT "Project".*, "Namespace"."name" as namespaceName
      FROM public."Project"
      INNER JOIN public."Namespace" ON "Namespace".id = "Project"."namespaceId"
      WHERE LOWER("Namespace"."name") = LOWER(${namespace})
      AND (
          "Project".private = 'false'
          OR EXISTS (
              SELECT 1
              FROM public."Member"
              WHERE "Member"."projectId" = "Project".id
              AND "Member"."userId" = ${userId}
              AND "Member"."acceptedAt" IS NOT NULL
          )
      );
      `
}
