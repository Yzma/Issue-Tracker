import { TRPCError } from "@trpc/server"
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc"
import { z } from "zod"

// TODO: Move to constants
const VALID_CHARACTER_REGEX = /^[a-zA-Z0-9_]*$/

const organizationSchema = z.object({
  name: z.string().min(3).max(25).regex(VALID_CHARACTER_REGEX),
})

export const organizationsRouter = createTRPCRouter({

  createOrganization: privateProcedure.input(organizationSchema).mutation(async ({ ctx, input }) => {

  }),

  updateOrganization: privateProcedure.input(organizationSchema).mutation(async ({ ctx, input }) => {

  }),

  getMembers: privateProcedure.input(organizationSchema).mutation(async ({ ctx, input }) => {

  }),

  inviteMember: privateProcedure.input(organizationSchema).mutation(async ({ ctx, input }) => {

  }),

  getOutgoingInvites: privateProcedure.input(organizationSchema).mutation(async ({ ctx, input }) => {

  }),

  cancelInvite: privateProcedure.input(organizationSchema).mutation(async ({ ctx, input }) => {

  }),

  removeMember: privateProcedure.input(organizationSchema).mutation(async ({ ctx, input }) => {

  }),

  updateMemberRole: privateProcedure.input(organizationSchema).mutation(async ({ ctx, input }) => {

  }),

  deleteOrganization: privateProcedure.input(organizationSchema).mutation(async ({ ctx, input }) => {

  })
})
