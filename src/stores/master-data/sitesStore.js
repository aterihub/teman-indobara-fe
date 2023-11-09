import { defineStore } from 'pinia'
import sitesAPI from '@/services/master-data/sitesAPI'
import { ref } from 'vue'

export const useSitesStore = defineStore('sites', {
  state: () => ({
    sites: ref(''),
    site: ref(''),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    deleteSiteIsLoading: ref(false),
    updateSiteIsLoading: ref(false),
    getSitesIsLoading: ref(false),
    getSiteIsLoading: ref(false),
    createSiteIsLoading: ref(false)
  }),
  actions: {
    async createSite(data) {
      this.createSiteIsLoading = true
      try {
        const res = await sitesAPI.createSite(data)
        this.createSiteIsLoading = false        
        this.status.isError = false
        this.status.message = 'Site Created'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.createSiteIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async getSites() {
      this.getSitesIsLoading = true
      try {
        const res = await sitesAPI.getSites()
        this.sites = res.data.sites.map((item, index) => {
          const no = index+1
          return { ...item, no}
        })
        this.getSitesIsLoading = false
      } catch (err) {
        this.getSitesIsLoading = false
        console.error(err)
        return err
      }
    },
    async getSite(params) {
      this.getSiteIsLoading = true
      try {
        const res = await sitesAPI.getSite(params)
        this.site = res.data.sites
        this.getSiteIsLoading = false
      } catch (err) {
        this.getSiteIsLoading = false
        console.error(err)
        return err
      }
    },
    async updateSite(id,data) {
      this.updateSiteIsLoading = true
      try {
        const res = await sitesAPI.updateSite(id,data)
        this.updateSiteIsLoading = false        
        this.status.isError = false
        this.status.message = 'Site Updated'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.updateSiteIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
    async deleteSite(id) {
      this.deleteSiteIsLoading = true
      try {
        const res = await sitesAPI.deleteSite(id)
        this.deleteSiteIsLoading = false        
        this.status.isError = false
        this.status.message = 'Site Deleted'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.deleteSiteIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    },
  }

})