import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMasterDataStore = defineStore('master', {
  state: () => ({
    variants: ref(''),
    vehicles: ref('test'),
    isLoading: ref(false),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    })
  }),

  actions: {
    
    //variant
    async createVariant(data) {
      this.isLoading = true
      try {
        const res = await masterDataAPI.createVariant(data)
        console.log(res)
        this.isLoading = false        
        this.status.isError = false
        this.status.message = 'Variant Created'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.isLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async getVariants() {
      this.isLoading = true
      try {
        const res = await masterDataAPI.getVariants()
        this.variants = res.data.map(item => ({
          id: item.id,
          name: item.name,
          createdAt: item.createdAt,
          notes: item.notes,
          manufacturerName: item.manufacturer.name,
          manufacturerId: item.manufacturer.id
        }))
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
        console.error(err)
        return err
      }
    },
    async updateVariant(id,data) {
      this.isLoading = true
      try {
        const res = await masterDataAPI.updateVariant(id,data)
        console.log(res)
        this.isLoading = false        
        this.status.isError = false
        this.status.message ='Variant Updated'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.isLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async deleteVariant(id) {
      this.isLoading = true
      try {
        const res = await masterDataAPI.deleteVariant(id)
        this.isLoading = false        
        this.status.isError = false
        this.status.message = 'Variant Deleted'
        this.status.code = res.status
        console.log(this.status)
      } catch (err) {
        console.error(err)
        this.isLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        console.log(this.status)
        return err
      }
    },
    //vehicle
    async createVehicle(data) {
      this.isLoading = true
      try {
        const res = await masterDataAPI.createVehicle(data)
        console.log(res)
        this.isLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Created'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.isLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async getVehicles() {
      this.isLoading = true
      try {
        const res = await masterDataAPI.getVehicles()
        console.log(res)
        this.vehicles = res.data
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
        console.error(err)
        return err
      }
    },
    async updateVehicle(id,data) {
      this.isLoading = true
      try {
        const res = await masterDataAPI.updateVehicle(id,data)
        console.log(res)
        this.isLoading = false        
        this.status.isError = false
        this.status.message ='Vehicle Updated'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.isLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async deleteVehicle(id) {
      this.isLoading = true
      try {
        const res = await masterDataAPI.deleteVehicle(id)
        this.isLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Deleted'
        this.status.code = res.status
        console.log(this.status)
      } catch (err) {
        console.error(err)
        this.isLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        console.log(this.status)
        return err
      }
    }
  }
})
