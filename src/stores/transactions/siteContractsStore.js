import { defineStore } from 'pinia'
import siteContracts from '@/services/transactions/sitesContractsAPI'
import { ref } from 'vue'
import moment from 'moment'

export const useSiteContractsStore = defineStore('siteContracts', {
  state: () => ({
    siteContracts: ref(''),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getSiteContractsIsLoading: ref(false),
    createSiteContractIsLoading: ref(false),
    updateSiteContractIsLoading: ref(false),
  }),
  actions: {
    async createSiteContract(id,data) {
      this.createSiteContractIsLoading = true
      try {
        const res = await siteContracts.createSiteContract(id,data)
        console.log(res)
        this.createSiteContractIsLoading = false        
        this.status.isError = false
        this.status.message = 'Contractor Created'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.createSiteContractIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async getSiteContracts(uuid) {
      this.getSiteContractsIsLoading = true
      try {
        const res = await siteContracts.getSiteContracts(uuid)
        console.log(res)
        this.siteContracts = res.data.contracts.map((item) => {
          const contractStart = moment(item.contractStart).format("LL")
          const contractEnd = moment(item.contractEnd).format("LL")
          const site = item.site.name
          const statusToggle = item.status == 'ACTIVE' ? true : false
          const expiredIn = moment(item.contractEnd).endOf('day').fromNow()
          console.log(expiredIn)
          return { ...item, contractStart, contractEnd, site, statusToggle, expiredIn}
        })
        this.getSiteContractsIsLoading = false
      } catch (err) {
        this.status.code = err.code
        this.status.isError = true
        switch (this.status.code) {
          case 'ERR_NETWORK':
            this.status.message = 'Network Error'
            break;
        }
        this.getSiteContractsIsLoading = false
        console.error(err)
        return err
      }
    },
    async updateSiteContract(contractorId,siteId,data) {
      this.updateSiteContractIsLoading = true
      try {
        const res = await siteContracts.updateSiteContract(contractorId,siteId,data)
        console.log(res)
        this.updateSiteContractIsLoading = false        
        this.status.isError = false
        this.status.message = 'Contractor Updated'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.updateSiteContractIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    }
  }

})