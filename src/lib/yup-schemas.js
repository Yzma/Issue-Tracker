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
  private: Yup.boolean(),
  // TODO: This is a duplicate of NamespaceNameCreationSchema - look at docs to see if that can be changed
  owner: Yup.string() 
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required'),
});
