import { defineStore } from 'pinia'
import devicesAPI from '@/services/master-data/devicesAPI'
import { ref } from 'vue'

export const useDevicesStore = defineStore('devices', {
  state: () => ({
    devices: ref(''),
    deviceDrafts: ref(''),
    device: ref(''),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    createDeviceIsLoading: ref(false),
    deleteDeviceIsLoading: ref(false),
    updateDeviceIsLoading: ref(false),
    getDevicesIsLoading: ref(false),
    getDeviceDraftsIsLoading: ref(false),
    getDeviceIsLoading: ref(false)
  }),
  actions: {
    async createDevice(data) {
      this.createDeviceIsLoading = true
      try {
        const res = await devicesAPI.createDevice(data)
        console.log(res)
        this.createDeviceIsLoading = false        
        this.status.isError = false
        this.status.message = 'Device Created'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.createDeviceIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async getDeviceDrafts() {
      this.getDeviceDraftsIsLoading = true
      try {
        const res = await devicesAPI.getDeviceDrafts()
        this.deviceDrafts = res.data.devices
        this.getDeviceDraftsIsLoading = false
      } catch (err) {
        this.getDeviceDraftsIsLoading = false
        console.error(err)
        return err
      }
    },
    async getDevices() {
      this.getDevicesIsLoading = true
      try {
        const res = await devicesAPI.getDevices()
        this.devices = res.data.devices.map((item, index) => {
          const no = index+1
          return { ...item, no}
        })
        this.getDevicesIsLoading = false
      } catch (err) {
        this.getDevicesIsLoading = false
        console.error(err)
        return err
      }
    },
    async getDevice() {
      this.getDeviceIsLoading = true
      try {
        const res = await devicesAPI.getDevice()
        this.device = res.datadevice
        this.getDeviceIsLoading = false
      } catch (err) {
        this.getDeviceIsLoading = false
        console.error(err)
        return err
      }
    },
    async updateDevice(id,data) {
      this.updateDeviceIsLoading = true
      try {
        const res = await devicesAPI.updateDevice(id,data)
        console.log(res)
        this.updateDeviceIsLoading = false        
        this.status.isError = false
        this.status.message = 'Device Updated'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.updateDeviceIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async deleteDevice(id) {
      this.deleteDeviceIsLoading = true
      try {
        const res = await devicesAPI.deleteDevice(id)
        this.deleteDeviceIsLoading = false        
        this.status.isError = false
        this.status.message = 'Device Deleted'
        this.status.code = res.status
        console.log(this.status)
      } catch (err) {
        console.error(err)
        this.deleteDeviceIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        console.log(this.status)
        return err
      }
    },
  }

})