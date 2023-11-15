import { defineStore } from 'pinia'
import manufacturersAPI from '@/services/master-data/manufacturersAPI'
import { ref } from 'vue'
import moment from 'moment'

export const useManufacturersStore = defineStore('manufacturers', {
  state: () => ({
    manufacturers: ref(''),
    manufacturer: ref(''),
    variants: ref(''),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    createManufactureIsLoading: ref(false),
    getManufacturersIsLoading: ref(false),
    getManufacturerIsLoading: ref(false),
    updateVariantIsLoading: ref(false),
    deleteVariantIsLoading: ref(false)
  }),
  actions: {
    async createManufacturer(data) {
      this.createManufactureIsLoading = true
      try {
        const res = await manufacturersAPI.createManufacturer(data)
        console.log(res)
        this.createManufactureIsLoading = false        
        this.status.isError = false
        this.status.message = 'Manufacture Created'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.createManufactureIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async getManufacturer(params) {
      this.getManufacturerIsLoading = true
      try {
        const res = await manufacturersAPI.getManufacturer(params)
        console.log(res)
        this.manufacturer = res.data.manufacturers[0].manufacturerName
        this.variants = res.data.manufacturers[0].variants.map((item, index) => {
          const no = index+1
          return { ...item, no}
        })
        this.getManufacturerIsLoading = false
      } catch (err) {
        this.getManufacturerIsLoading = false
        console.error(err)
        return err
      }
    },
    async getManufacturers() {
      this.getManufacturersIsLoading = true
      try {
        const res = await manufacturersAPI.getManufacturers()
        this.manufacturers = res.data.manufacturers.map((item, index) => {
          const no = index+1
          const createdAt = moment(item.createdAt).format("YYYY-MM-DD hh:mm")
          const variantName = []
          item.variants.map((item) => {
            variantName.push(item.variant)
          })
          return { ...item, createdAt, no, variantName}
        })
        this.getManufacturersIsLoading = false
      } catch (err) {
        this.status.code = err.code
        this.status.isError = true
        switch (this.status.code) {
          case 'ERR_NETWORK':
            this.status.message = 'Network Error'
            break;
        }
        this.getManufacturersIsLoading = false
        console.error(err)
        return err
      }
    },
    async updateVariant(id,data) {
      this.updateVariantIsLoading = true
      try {
        const res = await manufacturersAPI.updateVariant(id,data)
        console.log(res)
        this.updateVariantIsLoading = false        
        this.status.isError = false
        this.status.message = 'Variant Updated'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.updateVariantIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async deleteVariant(id) {
      this.deleteVariantIsLoading = true
      try {
        const res = await manufacturersAPI.deleteVariant(id)
        this.deleteVariantIsLoading = false        
        this.status.isError = false
        this.status.message = 'Variant Deleted'
        this.status.code = res.status
        console.log(this.status)
      } catch (err) {
        console.error(err)
        this.deleteVariantIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        console.log(this.status)
        return err
      }
    },
  }

})