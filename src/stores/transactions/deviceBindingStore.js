import { defineStore } from 'pinia'
import deviceBinding from '@/services/transactions/deviceBinding'
import { ref } from 'vue'
import moment from 'moment'

export const useDeviceBindingStore = defineStore('deviceBinding', {
  state: () => ({
    bindedDevices: ref(''),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getBindedDevicesIsLoading: ref(false),
    bindDeviceBindingIsLoading: ref(false),
    unbindDeviceBindingIsLoading: ref(false),
    deleteDeviceBindingIsLoading: ref(false)
  }),
  actions: {
    async bindDevices(id,data) {
      this.bindDeviceBindingIsLoading = true
      try {
        const res = await deviceBinding.bindDevices(id,data)
        console.log(res)
        this.bindDeviceBindingIsLoading = false        
        this.status.isError = false
        this.status.message = 'Device Binding Success'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.bindDeviceBindingIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async unbindDevice(id) {
      this.unbindDeviceBindingIsLoading = true
      try {
        const res = await deviceBinding.unbindDevice(id)
        console.log(res)
        this.unbindDeviceBindingIsLoading = false        
        this.status.isError = false
        this.status.message = 'Device Binding Success'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.unbindDeviceBindingIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async getBindedDevices(uuid) {
      this.getBindedDevicesIsLoading = true
      try {
        const res = await deviceBinding.getBindedDevices(uuid)
        console.log(res)
        this.bindedDevices = res.data.vehicle.devices
        this.getBindedDevicesIsLoading = false
      } catch (err) {
        this.status.code = err.code
        this.status.isError = true
        switch (this.status.code) {
          case 'ERR_NETWORK':
            this.status.message = 'Network Error'
            break;
        }
        this.getBindedDevicesIsLoading = false
        console.error(err)
        return err
      }
    },
    // async updateSiteContract(contractorId,siteId,data) {
    //   this.updateSiteContractIsLoading = true
    //   try {
    //     const res = await deviceBinding.updateSiteContract(contractorId,siteId,data)
    //     console.log(res)
    //     this.updateSiteContractIsLoading = false        
    //     this.status.isError = false
    //     this.status.message = 'Contractor Updated'
    //     this.status.code = res.status
    //   } catch (err) {
    //     console.error(err)
    //     this.updateSiteContractIsLoading = false        
    //     this.status.isError = true
    //     this.status.message = err.response.data.message
    //     this.status.code = err.response.data.statusCode
    //     return err
    //   }
    // }
  }

})