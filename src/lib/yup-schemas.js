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
});
