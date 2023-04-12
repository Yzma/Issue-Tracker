import * as Yup from 'yup';

const VALID_CHARACTER_REGEX = /^[a-zA-Z0-9_]*$/
const BLACKLIST_NAMES = /^(?!api|_next|favicon|invites|issues|login|logout|orgs|projects|users|404|finish|index)/

const NAMESPACE_STRING = Yup.string()
  .min(3, 'Too Short!')
  .max(25, 'Too Long!')
  .matches(VALID_CHARACTER_REGEX, 'Invalid name')
  .matches(BLACKLIST_NAMES, 'Invalid name')
  .required('Required')

export const NamespaceNameCreationSchema = Yup.object({
  name: NAMESPACE_STRING
});

export const OrganizationNameCreationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .matches(VALID_CHARACTER_REGEX)
    .required('Required'),
});

export const ProjectCreationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .matches(VALID_CHARACTER_REGEX, "Invalid name!")
    .required('Required'),
  description: Yup.string()
    .max(75, 'Too Long!')
    .optional(),
  private: Yup.boolean().oneOf([true, false], 'Field must be checked').required(),
  // TODO: This is a duplicate of NamespaceNameCreationSchema - look at docs to see if that can be changed
  owner: NAMESPACE_STRING
});

export const LabelCreationSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .min(1, 'Too Short!')
    .max(150, 'Too Long!')
    .optional(),
  color: Yup.string()
    .length(6)
    .required('Required'),
});

export const IssueCreationSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .min(1, 'Too Short!')
    .max(2048, 'Too Long!')
    .required('Required'),
  labels: Yup.array().of(Yup.string()).optional()
});

export const CommentCreationSchema = Yup.object({
  description: Yup.string()
    .min(1, 'Too Short!')
    .max(2048, 'Too Long!')
    .required('Required')
});
