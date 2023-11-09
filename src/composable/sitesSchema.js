import * as yup from 'yup'

export const addSiteSchema = yup.object({
  name: yup.string().required().label('Site Name'),
  phone:yup.number()
            .required('Phone number is required')
});

export const updateSiteSchema = yup.object({
  name: yup.string().required().label('Site Name'),
  phone:yup.number()
            .required('Phone number is required')
}); 