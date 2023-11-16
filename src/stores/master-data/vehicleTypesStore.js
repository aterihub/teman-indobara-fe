import { defineStore } from 'pinia'
import vehicleTypesAPI from '@/services/master-data/vehicleTypesAPI'
import { ref } from 'vue'
import moment from 'moment'

export const useVehicleTypesStore = defineStore('vehicleTypes', {
  state: () => ({
    vehicleTypes: ref(''),
    getStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    createTypeIsLoading: ref(false),
    getTypeIsLoading: ref(false),
    updateTypeIsLoading: ref(false),
    deleteTypeIsLoading: ref(false)
  }),
  actions: {
    async createVehicleType(data) {
      this.createTypeIsLoading = true
      try {
        const res = await vehicleTypesAPI.createVehicleType(data)
        console.log(res)
        this.createTypeIsLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Type Created'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.createTypeIsLoading = false        
        this.status.code = err.response.status
        this.status.isError = true
        if (this.status.code == 409) {
          this.status.message = 'Already Registered'
        }
        return err
      }
    },
    async getVehicleTypes() {
      this.getTypeIsLoading = true
      try {
        const res = await vehicleTypesAPI.getVehicleTypes()
        this.vehicleTypes = res.data.vehicleTypes.map((item, index) => {
          const no = index+1
          const createdAt = moment(item.createdAt).format("YYYY-MM-DD hh:mm")
          return { ...item, createdAt, no}
        })
        this.getTypeIsLoading = false
        this.getStatus.code = res.status
        this.getStatus.isError = false
      } catch (err) {        
        this.getStatus.code = err.code
        this.getStatus.isError = true
        switch (this.getStatus.code) {
          case 'ERR_NETWORK':
            this.getStatus.message = 'Network Error'
            break;
        }
        this.getTypeIsLoading = false
        console.error(err)
        return err
      }
    },
    async updateVehicleType(id,data) {
      this.updateTypeIsLoading = true
      try {
        const res = await vehicleTypesAPI.updateVehicleType(id,data)
        console.log(res)
        this.updateTypeIsLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Type Updated'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.updateTypeIsLoading = false                
        this.status.code = err.response.status
        this.status.isError = true
        if (this.status.code == 409) {
          this.status.message = 'Already Registered'
        }
        return err
      }
    },
    async deleteVehicleType(id) {
      this.deleteTypeIsLoading = true
      try {
        const res = await vehicleTypesAPI.deleteVehicleType(id)
        this.deleteTypeIsLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Type Deleted'
        this.status.code = res.status
        console.log(this.status)
      } catch (err) {
        console.error(err)
        this.deleteTypeIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        console.log(this.status)
        return err
      }
    },
  }

})