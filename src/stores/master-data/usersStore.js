import { defineStore } from 'pinia'
import userAPI from '@/services/master-data/userAPI'
import { ref } from 'vue'
import moment from 'moment'

export const useUsersStore = defineStore('user', {
  state: () => ({
    users: ref([]),
    status: ref({
      isError:null,
      message: null,
      code: null,
    }),
    createUserIsLoading: ref(false),
    getUserIsLoading: ref(false)
  }),
  
  actions: {
    async getUsers(params) {
      this.getUserIsLoading = true
      try {
        const res = await userAPI.getUser(params)
        console.log(res)
        this.users = res.data.users.map((item, index) => {
          const no = index+1
          const createdAt = moment(item.createdAt).format("YYYY-MM-DD hh:mm")
          const contractorName = item.contractor.name
          return { ...item, createdAt, no, contractorName}
        })
        this.getUserIsLoading = false
        this.status.isError = false
        this.status.code = res.data.status
      } catch (err) {
        console.error(err)
        this.getUserIsLoading = false
        this.status.isError = true
        this.status.code = err.code
        switch (this.status.code) {
          case 'ERR_NETWORK':
            this.status.message = 'Network Error'
            break;
        }
        return err
      }
    },
    async createUser(data) {
      this.createUserIsLoading = true
      try {
        const res = await userAPI.createUser(data)
        console.log(res)
        this.createUserIsLoading = false
        this.status.isError = false
        this.status.message = 'Account Created Success'
        this.status.code = res.data.status
      } catch (err) {
        console.error(err)
        this.createUserIsLoading = false
        this.status.isError = true
        this.status.message = 'Account Created Failed'
        this.status.code = err.response.data.status
        return err
      }
    },

    async updatePassword(data) {
      this.isLoading = true
      try {
        const res = await userAPI.updatePassword(data)
        console.log(res)
        this.isLoading = false
        this.status.isError = false
        this.status.message = 'Password reset email successfully sent'
        this.status.code = res.data.status
      } catch (err) {
        this.isLoading = false
        this.status.isError = true
        this.status.message = err.response.data.error
        this.status.code = err.response.data.status
        return err
      }
    },

  }

})