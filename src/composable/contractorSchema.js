import * as yup from 'yup'

export const addContractorSchema = yup.object({
  name: yup.string().required().label('Name'),
  address: yup.string().required().label('Address'),
  picName: yup.string().required().label('PIC Name'),
  picPhone: yup.number().required().label('PIC Phone'),
  // contractStart: yup.date().required().label('Contract Start Date'),
  // contractEnd: yup.date().required().label('Contract End Date'),
  // siteIds: yup.array().label('Sites')

});

export const updateContractorSchema = yup.object({
  name: yup.string().required().label('Name'),
  address: yup.string().required().label('Address'),
  picName: yup.string().required().label('PIC Name'),
  picPhone: yup.number().required().label('PIC Phone'),
  // contractStart: yup.date().required().label('Contract Start Date'),
  // contractEnd: yup.date().required().label('Contract End Date'),
  // siteIds: yup.array().label('Sites')
})

