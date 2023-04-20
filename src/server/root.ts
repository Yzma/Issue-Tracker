import { createTRPCRouter } from './trpc';
import { profileRouter } from "./routers/profile";
 
export const appRouter = createTRPCRouter({
  profile: profileRouter
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
