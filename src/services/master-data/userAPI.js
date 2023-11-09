import apiClient from "../API"



export default {
  getUser(params) {
    return apiClient.get('users',{params})
  },
  createUser(data) {
    return apiClient.post('auth/signup', data)
  },

  updatePassword(data) {
    return apiClient.post('user/update', data)
  },
}