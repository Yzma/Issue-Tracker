import { z } from 'zod'

export const SortTypeSchema = z.union([
  z.literal('newest'),
  z.literal('oldest'),
  z.literal('recently-updated'),
  z.literal('least-recently-updated'),
])

export const MemberAffiliation = z.union([
  z.literal('outside'),
  z.literal('direct'),
  z.literal('all'),
])
