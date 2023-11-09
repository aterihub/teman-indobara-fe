import apiClient from "../API"



export default {
  getHulls() {
    return apiClient.get('hulls')
  },
  getHull(id) {
    return apiClient.get(`hulls/${id}`)
  },
  createHull(data) {
    return apiClient.post(`hulls`, data)
  },
  updateHull(id,data) {
    return apiClient.patch(`hulls/${id}`, data)
  },
  deleteHull(id) {
    return apiClient.delete(`hulls/${id}`)
  },
  
}