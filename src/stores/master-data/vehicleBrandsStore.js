import { defineStore } from 'pinia'
import vehicleBrandsAPI from '@/services/master-data/vehicleBrandsAPI'
import { ref } from 'vue'
import moment from 'moment'
export const useVehicleBrandsStore = defineStore('vehicleBrands', {
  state: () => ({
    vehicleBrands: ref(''),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    createBrandIsLoading: ref(false),
    getBrandIsLoading: ref(false),
    updateBrandIsLoading: ref(false),
    deleteBrandIsLoading: ref(false)
  }),
  actions: {
    async createVehicleBrand(data) {
      this.createBrandIsLoading = true
      try {
        const res = await vehicleBrandsAPI.createVehicleBrand(data)
        console.log(res)
        this.createBrandIsLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Brand Created'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.createBrandIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async getVehicleBrands() {
      this.getBrandIsLoading = true
      try {
        const res = await vehicleBrandsAPI.getVehicleBrands()
        this.vehicleBrands = res.data.vehicleBrands.map((item, index) => {
          const no = index+1
          const createdAt = moment(item.createdAt).format("YYYY-MM-DD hh:mm")
          return { ...item, createdAt, no}
        })
        this.getBrandIsLoading = false
      } catch (err) {
        this.status.code = err.code
        this.status.isError = true
        switch (this.status.code) {
          case 'ERR_NETWORK':
            this.status.message = 'Network Error'
            break;
        }
        this.getBrandIsLoading = false
        console.error(err)
        return err
      }
    },
    async updateVehicleBrand(id,data) {
      this.updateBrandIsLoading = true
      try {
        const res = await vehicleBrandsAPI.updateVehicleBrand(id,data)
        console.log(res)
        this.updateBrandIsLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Brand Updated'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.updateBrandIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async deleteVehicleBrand(id) {
      this.deleteBrandIsLoading = true
      try {
        const res = await vehicleBrandsAPI.deleteVehicleBrand(id)
        this.deleteBrandIsLoading = false        
        this.status.isError = false
        this.status.message = 'Vehicle Brand Deleted'
        this.status.code = res.status
        console.log(this.status)
      } catch (err) {
        console.error(err)
        this.deleteBrandIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        console.log(this.status)
        return err
      }
    },
  }

})