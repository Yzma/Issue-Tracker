import { createTRPCRouter } from './trpc'
import { projectsRouter } from './routers/projects'
import { usersRouter } from './routers/users'
import { onboardingRouter } from './routers/onboarding'
import { organizationsRouter } from './routers/organizations'
import { issuesRouter } from './routers/issues'
import { commentsRouter } from './routers/comments'
import { namespaceRouter } from './routers/namespace'

export const appRouter = createTRPCRouter({
  comments: commentsRouter,
  issues: issuesRouter,
  namespace: namespaceRouter,
  onboarding: onboardingRouter,
  organizations: organizationsRouter,
  projects: projectsRouter,
  users: usersRouter,
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
