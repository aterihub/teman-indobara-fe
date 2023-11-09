import { defineStore } from 'pinia'
import vehiclesAPI from '@/services/master-data/vehiclesAPI'
import { ref } from 'vue'

export const useVehiclesStore = defineStore('vehicles', {
  state: () => ({
    vehicles: ref(''),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    createVehicleIsLoading: ref(false),
    getVehicleIsLoading: ref(false),
    updateVehicleIsLoading: ref(false),
    deleteVehicleIsLoading: ref(false)
  }),
  actions: {
    async createVehicle(data) {
      this.createVehicleIsLoading = true
      try {
        const res = await vehiclesAPI.createVehicle(data)
        console.log(res)
        this.createVehicleIsLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Created'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.createVehicleIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async getVehicles() {
      this.getVehicleIsLoading = true
      try {
        const res = await vehiclesAPI.getVehicles()
        this.vehicles = res.data.vehicles.map((item, index) => {
          const no = index+1
          return { ...item, no}
        })
        this.getVehicleIsLoading = false
      } catch (err) {
        this.getVehicleIsLoading = false
        console.error(err)
        return err
      }
    },
    async updateVehicle(id,data) {
      this.updateVehicleIsLoading = true
      try {
        const res = await vehiclesAPI.updateVehicle(id,data)
        console.log(res)
        this.updateVehicleIsLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Updated'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.updateVehicleIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async deleteVehicle(id) {
      this.deleteVehicleIsLoading = true
      try {
        const res = await vehiclesAPI.deleteVehicle(id)
        this.deleteVehicleIsLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Deleted'
        this.status.code = res.status
        console.log(this.status)
      } catch (err) {
        console.error(err)
        this.deleteVehicleIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        console.log(this.status)
        return err
      }
    },
  }

})