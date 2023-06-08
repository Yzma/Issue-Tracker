import { z } from "zod"

const VALID_CHARACTER_REGEX = /^[a-zA-Z0-9_]*$/
const BLACKLIST_NAMES = /^(?!api|_next|favicon|invites|issues|login|logout|orgs|projects|users|404|finish|index)/

export const NAMESPACE = z.string()
  .min(3)
  .max(25)
  .regex(VALID_CHARACTER_REGEX)
  .regex(BLACKLIST_NAMES)

export const SHORT_DESCRIPTION = z.string()
  .max(75)
  .optional()

export const LONG_DESCRIPTION = z.string()
  .min(1)
  .max(2048)
  .regex(VALID_CHARACTER_REGEX)

export const LABEL_NAME = z.string()
  .min(1)
  .max(50)
  .regex(VALID_CHARACTER_REGEX)

export const NamespaceSchema = z.object({
  name: NAMESPACE,
});

export const ProjectCreationSchema = z.object({
  owner: NAMESPACE,
  name: NAMESPACE,
  description: SHORT_DESCRIPTION,
  visibility: z.union([
    z.literal('public'),
    z.literal('private'),
  ])
});

export const LabelCreationSchema = z.object({
  name: LABEL_NAME,
  description: SHORT_DESCRIPTION,
  color: z.string().length(6)
});

export const IssueCreationSchema = z.object({
  title: z.string().min(1).max(200),
  description: LONG_DESCRIPTION,
  labels: z.array(LABEL_NAME).optional()
});

export const CommentCreationSchema = z.object({
  description: LONG_DESCRIPTION
});
