import * as yup from 'yup'

export const addDeviceSchema = yup.object({
  imeiNumber: yup.string().required().label('Device Name'),
  simProvider: yup.string().required().label('IMEI Number'),
  simNumber: yup.number().required().label('SIM Number'),
});

export const updateDeviceSchema = yup.object({
  imeiNumber: yup.string().required().label('Device Name'),
  simProvider: yup.string().required().label('IMEI Number'),
  simNumber: yup.number().required().label('SIM Number'),
}); 