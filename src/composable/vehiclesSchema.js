import * as yup from 'yup'

export const addVehicleSchema = yup.object({
  name: yup.string().required().label('Variant Name'),
  brand: yup.string().required().label('Brand'),
  type: yup.string().required().label('Type'),
  registrationNumber: yup.string().required().label('Registration Number'),
});

export const updateVehicleSchema = yup.object({
  name: yup.string().required().label('Name'),
  address: yup.string().required().label('Address'),
  picName: yup.string().required().label('PIC Name'),
  picPhone: yup.number().required().label('PIC Phone'),
  contractStart: yup.date().required().label('Contract Start Date'),
  contractEnd: yup.date().required().label('Contract End Date'),
  siteIds: yup.array().label('Sites')
}); 