import { z } from "zod"

const VALID_CHARACTER_REGEX = /^[a-zA-Z0-9_]*$/
const BLACKLIST_NAMES = /^(?!api|_next|favicon|invites|issues|login|logout|orgs|projects|users|404|finish|index)/

export const NAMESPACE_STRING = z.string()
  .min(3)
  .max(25)
  .regex(VALID_CHARACTER_REGEX)
  .regex(BLACKLIST_NAMES)


export const NamespaceSchema = z.object({
  name: NAMESPACE_STRING,
});