import * as Yup from 'yup';

export const NamespaceNameCreationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
});

export const OrganizationNameCreationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
});

export const ProjectCreationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .max(75, 'Too Long!')
    .optional(),
  private: Yup.boolean()
  .oneOf([true, false], 'Field must be checked').required(),
  // TODO: This is a duplicate of NamespaceNameCreationSchema - look at docs to see if that can be changed
  owner: Yup.string() 
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
});

export const LabelCreationSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .min(1, 'Too Short!')
    .max(150, 'Too Long!')
    .optional('Optional'),
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
  labels: Yup.array().of(Yup.string()).optional('Optional')
});
