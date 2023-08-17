import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { OrganizationRole } from '@prisma/client'
import {
  createTRPCRouter,
  ensureUserIsProjectMember,
  getViewableProject,
  privateProcedure,
} from '../trpc'
import {
  NamespaceSchema,
  LabelCreationSchema,
  ProjectCreationSchema,
} from '@/lib/zod-schemas'
import { MemberAffiliation } from '@/lib/zod-types'

const LabelModifySchema = LabelCreationSchema.and(
  z.object({
    labelId: z.string(),
  })
)

export const projectsRouter = createTRPCRouter({
  create: privateProcedure
    .input(ProjectCreationSchema)
    .mutation(async ({ ctx, input }) => {
      const foundNamespace = await ctx.prisma.namespace.findUnique({
        where: {
          name: input.owner,
        },
      })

      if (!foundNamespace) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `The provided Namespace was not found.`,
        })
      }

      if (foundNamespace.userId) {
        if (foundNamespace.userId !== ctx.session.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `You do not have permission to perform this action.`,
          })
        }
      } else if (foundNamespace.organizationId) {
        const foundMember = await ctx.prisma.member.findFirst({
          where: {
            userId: ctx.session.user.id,
            organizationId: foundNamespace.organizationId,
          },
        })

        if (!foundMember || foundMember.role !== OrganizationRole.Owner) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `You do not have permission to perform this action.`,
          })
        }
      } else {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `A Project was attempted to be created on a Namespace without a userId or organizationId.`,
        })
      }

      const createdProject = await ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          private: input.visibility === 'private',
          namespaceId: foundNamespace.id,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: OrganizationRole.Owner,
              acceptedAt: new Date(),
            },
          },
          labels: {
            create: [
              { name: 'Bug', description: 'Bug description', color: '392029' },
              {
                name: 'Documentation',
                description: 'Documentation description',
                color: '122b40',
              },
              {
                name: 'Duplicate',
                description: 'Duplicate description',
                color: '373c43',
              },
            ],
          },
        },
      })

      return {
        ...createdProject,
        namespace: foundNamespace.name,
      }
    }),

  updateProject: ensureUserIsProjectMember
    .input(ProjectCreationSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.project.update({
        where: {
          id: ctx.project.id,
        },
        data: {
          name: input.newName,
          description: input.description,
          private: input.visibility === 'private',
        },
      })
    }),

  // eslint-disable-next-line @typescript-eslint/require-await
  getProject: getViewableProject.query(async ({ ctx }) => {
    return { project: ctx.project, member: ctx.member }
  }),

  /*
    Members
  */

  getMembers: getViewableProject
    .input(
      z.object({
        limit: z.number().int().max(25).default(15),
        affiliation: MemberAffiliation,
      })
    )
    .query(async ({ ctx, input }) => {
      const affiliation =
        // TODO: Cleanup
        // eslint-disable-next-line no-nested-ternary
        input.affiliation === 'direct'
          ? {
              NOT: {
                acceptedAt: null,
              },
            }
          : input.affiliation === 'outside'
          ? {
              acceptedAt: null,
            }
          : {} // Empty - fetch all

      return ctx.prisma.member.findMany({
        where: {
          projectId: ctx.project.id,
          ...affiliation,
        },
        take: input.limit,
      })
    }),

  inviteMember: ensureUserIsProjectMember
    .input(NamespaceSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.member.create({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data: {
          role: OrganizationRole.User,
          user: {
            connect: {
              username: input.name,
            },
          },
          inviteeUser: {
            connect: {
              id: ctx.member.id,
            },
          },
          projectId: ctx.project.id,
        },
      })
    }),

  removeMember: ensureUserIsProjectMember
    .input(
      z.object({
        inviteId: z.string(), // TODO: Check invite ID
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.member.delete({
        where: {
          id: input.inviteId,
        },
      })
    }),

  /*
    Labels
  */

  getLabels: getViewableProject
    .input(
      z.object({
        limit: z.number().int().max(25).default(15),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.label.findMany({
        where: {
          projectId: ctx.project.id,
        },
        take: input.limit,
      })
    }),

  createLabel: ensureUserIsProjectMember
    .input(LabelCreationSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.label.create({
        data: {
          name: input.name,
          description: input.description,
          color: input.color,
          projectId: ctx.project.id,
        },
      })
    }),

  updateLabel: ensureUserIsProjectMember
    .input(LabelModifySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.label.update({
        where: {
          id: ctx.project.id,
        },
        data: {
          name: input.name,
          description: input.description,
          color: input.color,
        },
      })
    }),

  removeLabel: ensureUserIsProjectMember
    .input(LabelModifySchema)
    .mutation(async ({ ctx }) => {
      return ctx.prisma.label.delete({
        where: {
          id: ctx.project.id,
        },
      })
    }),
})
