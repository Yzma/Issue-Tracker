import { createTRPCRouter } from './trpc';
import { projectsRouter } from "./routers/projects";
 
export const appRouter = createTRPCRouter({
  projects: projectsRouter
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
