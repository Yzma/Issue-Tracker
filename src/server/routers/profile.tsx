
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
  echo: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      return {
        test: `Hello ${input.username}`
      }
    }),
});
