import { Project } from '@prisma/client'
import prisma from '@/lib/prisma/prisma'

export type Projects = Project & {
  namespace: {
    name: string
  }
}

// TODO: Better comments
// Gets projects for an authenticated user who is viewing another users/organizations projects
export async function getProjectsWithInvitations(
  namespace: string,
  userId: string
) {
  // TODO: Change this?
  if (!namespace || !userId) {
    throw new Error('namespace or userId cannot be undefined')
  }

  const result = await prisma.$queryRaw<Projects[]>`
      SELECT "Project".*
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

  const map = result.map((project) => {
    return {
      ...project,
      namespace: {
        name: namespace,
      },
    }
  })
  return map as Projects[]
}

// Returns the projects of a user. This function is being ran from the perspective of someone who is viewing their own projects, ir isn't logged in
// TODO: Rename these functions
export async function getProjects(namespace: string, showAllProjects: boolean) {
  const signedInUserSelect = !showAllProjects
    ? {
        private: false,
      }
    : false
  const result = await prisma.project.findMany({
    where: {
      namespace: {
        name: {
          equals: namespace,
          mode: 'insensitive',
        },
      },
      ...signedInUserSelect,
    },

    select: {
      id: true,
      name: true,
      description: true,
      private: true,
      createdAt: true,
      updatedAt: true,
      namespace: {
        select: {
          name: true,
        },
      },
    },
  })
  return result as Projects[]
}
