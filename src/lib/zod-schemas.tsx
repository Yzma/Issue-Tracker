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


// export const ProjectCreationSchema = Yup.object().shape({
//   name: Yup.string()
//     .min(3, 'Too Short!')
//     .max(25, 'Too Long!')
//     .matches(VALID_CHARACTER_REGEX, "Invalid name!")
//     .required('Required'),
//   description: Yup.string()
//     .max(75, 'Too Long!')
//     .optional(),
//   private: Yup.boolean().oneOf([true, false], 'Field must be checked').required(),
//   // TODO: This is a duplicate of NamespaceNameCreationSchema - look at docs to see if that can be changed
//   owner: NAMESPACE_STRING
// });
