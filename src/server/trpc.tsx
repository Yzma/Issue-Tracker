import superjson from 'superjson'
import { ZodError } from 'zod'
import { TRPCError, initTRPC } from '@trpc/server'

import { OrganizationRole } from '@prisma/client'
import { GetServerSidePropsContext } from 'next'
import { getServerSideSession } from '@/lib/sessions'
import prisma from '@/lib/prisma/prisma'

import { GetIssueSchema, ProjectNamespaceSchema } from '@/lib/zod-schemas'
import { NEXT_AUTH_SESSION_COOKIE } from '@/lib/constants'

export const createTRPCContext = async (opts: GetServerSidePropsContext) => {
  const { req, res } = opts

  const session = !req.cookies[NEXT_AUTH_SESSION_COOKIE]
    ? null
    : await getServerSideSession(opts)

  return {
    session,
    prisma,
    req,
    res,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

const ensureUserIsAuthorized = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const privateProcedure = t.procedure.use(ensureUserIsAuthorized)

export const getViewableProject = publicProcedure
  .input(ProjectNamespaceSchema)
  .use(async ({ ctx, input, next }) => {
    const foundProject = await ctx.prisma.project.findFirst({
      where: {
        name: input.name,
        AND: [
          {
            namespace: {
              name: input.owner,
            },
          },
        ],
      },
      include: {
        namespace: true,
      },
    })

    if (!foundProject) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `The provided Project was not found.`,
      })
    }

    // Conditions:
    // 1. The user is a part of the same organization that owns the project
    // 2. The user is a part of the project (manually invited)
    const searchCondition = foundProject.namespace.organizationId
      ? // Condition 1 - The user is a part of the same organization that owns the project
        {
          userId_organizationId: {
            userId: ctx.session?.user.id,
            organizationId: foundProject.namespace.organizationId,
          },
        }
      : // Condition 2 - A part of the Project by invite
        {
          userId_projectId: {
            userId: ctx.session?.user.id,
            projectId: foundProject.id,
          },
        }

    const foundMember = await ctx.prisma.member.findUnique({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      where: {
        ...searchCondition,
        AND: [
          {
            NOT: {
              acceptedAt: null,
            },
          },
        ],
      },
    })

    if (foundProject.private) {
      // If the user isn't logged in or isn't a part of the project, deny them
      if (ctx.session === null || !foundMember) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `The provided Project was not found.`,
        })
      }
    }

    return next({
      ctx: {
        project: foundProject,
        member: foundMember,
      },
    })
  })

export const getViewableIssue = getViewableProject
  .input(GetIssueSchema)
  .use(async ({ ctx, input, next }) => {
    const issue = await ctx.prisma.issue.findUnique({
      where: {
        id: input.issueId,
      },
    })

    if (!issue) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Issue not found',
      })
    }

    return next({
      ctx: {
        issue,
        ...ctx,
      },
    })
  })

export const ensureUserIsProjectMember = getViewableProject.use(
  async ({ ctx, next }) => {
    if (!ctx.member || ctx.member.role !== OrganizationRole.Owner) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `The provided Project was not found.`,
      })
    }

    const { session, member, ...rest } = ctx

    // Assert that ctx.session is not null or undefined
    const updatedCtx = {
      ...rest,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      session,
      member,
    }

    return next({ ctx: updatedCtx })

    //   return next({ ctx: {
    //     ...ctx,
    //     session: ctx.session!,
    //     member: ctx.member!,
    //   } });
    // })
  }
)
