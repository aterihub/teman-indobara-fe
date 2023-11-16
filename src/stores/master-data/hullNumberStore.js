import { defineStore } from 'pinia'
import hullNumberAPI from '@/services/master-data/hullNumberAPI'
import { ref } from 'vue'
import moment from 'moment'

export const useHullsStore = defineStore('hulls', {
  state: () => ({
    hulls: ref(''),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    createHullIsLoading: ref(false),
    getHullIsLoading: ref(false),
    updateHullIsLoading: ref(false),
    deleteHullIsLoading: ref(false)
  }),
  actions: {
    async createHull(data) {
      this.createHullIsLoading = true
      try {
        const res = await hullNumberAPI.createHull(data)
        console.log(res)
        this.createHullIsLoading = false        
        this.status.isError = false
        this.status.message = 'Hull Number Created'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.createHullIsLoading = false        
        this.status.code = err.response.status
        this.status.isError = true
        if (this.status.code == 409) {
          this.status.message = 'Already Registered'
        }
        return err
      }
    },
    async getHulls() {
      this.getHullIsLoading = true
      try {
        const res = await hullNumberAPI.getHulls()
        this.hulls = res.data.hulls.map((item, index) => {
          const no = index+1
          const createdAt = moment(item.createdAt).format("YYYY-MM-DD hh:mm")
          return { ...item, createdAt, no}
        })
        this.getHullIsLoading = false
      } catch (err) {
        this.getStatus.code = err.code
        this.getStatus.isError = true
        switch (this.getStatus.code) {
          case 'ERR_NETWORK':
            this.getStatus.message = 'Network Error'
            break;
        }
        this.getHullIsLoading = false
        console.error(err)
        return err
      }
    },
    async updateHull(id,data) {
      this.updateHullIsLoading = true
      try {
        const res = await hullNumberAPI.updateHull(id,data)
        console.log(res)
        this.status.message = 'Hull Number Updated'
        this.updateHullIsLoading = false        
        this.status.isError = false
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.updateHullIsLoading = false                
        this.status.code = err.response.status
        this.status.isError = true
        if (this.status.code == 409) {
          this.status.message = 'Already Registered'
        }
        return err
      }
    },
    async deleteHull(id) {
      this.deleteHullIsLoading = true
      try {
        const res = await hullNumberAPI.deleteHull(id)
        this.deleteHullIsLoading = false        
        this.status.isError = false
        this.status.message = 'Hull Number Deleted'
        this.status.code = res.status
        console.log(this.status)
      } catch (err) {
        console.error(err)
        this.deleteHullIsLoading = false        
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        console.log(this.status)
        return err
      }
    },
  }

})