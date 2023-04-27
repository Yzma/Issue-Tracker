import superjson from 'superjson'
import { ZodError } from 'zod';
import { TRPCError, initTRPC } from '@trpc/server';

import { getServerSession } from '@/lib/sessions';
import prisma from '@/lib/prisma/prisma';

import { CreateNextContextOptions } from '@trpc/server/adapters/next';

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerSession(req, res);

  return {
    prisma,
    req,
    res,
    session
  }
}

// export const createInnerTRPCContext = async (opts: CreateNextContextOptions) => {
//   const { req, res } = opts;

//   // Get the session from the server using the unstable_getServerSession wrapper function
//   const session = await getServerSession(req, res );

//   return createInnerTRPCContext({
//     session,
//   });
// };


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
    };
  },
});
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

// TODO: Merge into one function
const optionalUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session?.user },
    },
  });
});

export const optionalAuthedProcedure = t.procedure.use(optionalUserIsAuthed);


export const privateProcedure = t.procedure.use(enforceUserIsAuthed);

