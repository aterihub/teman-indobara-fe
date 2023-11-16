import * as yup from 'yup'

export const addVariantSchema = yup.object({
  variant: yup.string().required().label('Variant'),
  variantNotes: yup.string().required().label('Notes'),
});
export const addManufacturerSchema = yup.object({
  name: yup.string().required().label('Name'),
  variant: yup.string().required().label('Variant'),
});

export const updateManufacturerSchema = yup.object({
  name: yup.string().required().label('Name'),
  variant: yup.string().required().label('Variant'),
})


