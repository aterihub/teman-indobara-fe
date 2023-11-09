import { defineStore } from 'pinia'
import contractorsAPI from '@/services/master-data/contractorsAPI'
import { ref } from 'vue'
import moment from 'moment'

export const useContractorsStore = defineStore('contractors', {
  state: () => ({
    contractors: ref(''),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    createContractorIsLoading: ref(false),
    getContractorIsLoading: ref(false),
    updateContractorsIsLoading: ref(false),
    deleteContractorIsLoading: ref(false)
  }),
  actions: {
    async createContractor(data) {
      this.createContractorIsLoading = true
      try {
        const res = await contractorsAPI.createContractor(data)
        console.log(res)
        this.createContractorIsLoading = false        
        this.status.isError = false
        this.status.message = 'Contractor Created'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.createContractorIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async getContractors() {
      this.getContractorIsLoading = true
      try {
        const res = await contractorsAPI.getContractors()
        this.contractors = res.data.contractors.map((item, index) => {
          const no = index+1
          const formattedContractStart = moment(item.contractStart).format("YYYY-MM-DD")
          const formattedContractEnd = moment(item.contractEnd).format("YYYY-MM-DD")
          return { ...item, formattedContractStart, formattedContractEnd, no}
        })
        console.log(this.contractors)
        this.getContractorIsLoading = false
      } catch (err) {
        this.getContractorIsLoading = false
        console.error(err)
        return err
      }
    },
    async updateContractor(id,data) {
      this.updateContractorsIsLoading = true
      try {
        const res = await contractorsAPI.updateContractor(id,data)
        console.log(res)
        this.updateContractorsIsLoading = false        
        this.status.isError = false
        this.status.message = 'Contractor Updated'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.updateContractorsIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async deleteContractor(id) {
      this.deleteContractorIsLoading = true
      try {
        const res = await contractorsAPI.deleteContractor(id)
        this.deleteContractorIsLoading = false        
        this.status.isError = false
        this.status.message = 'Contractor Deleted'
        this.status.code = res.status
        console.log(this.status)
      } catch (err) {
        console.error(err)
        this.deleteContractorIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        console.log(this.status)
        return err
      }
    },
  }

})