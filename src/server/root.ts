import { createTRPCRouter } from './trpc';
import { projectsRouter } from "./routers/projects";
import { usersRouter } from './routers/users';
import { onboardingRouter } from './routers/onboarding';
import { organizationsRouter } from './routers/organizations';
 
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  onboarding: onboardingRouter,
  users: usersRouter,
  organizations: organizationsRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
