import { createTRPCRouter } from './trpc';
import { projectsRouter } from "./routers/projects";
import { usersRouter } from './routers/users';
import { onboardingRouter } from './routers/onboarding';
 
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  onboarding: onboardingRouter,
  users: usersRouter
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
