import apiClient from "../API"



export default {
  getSites() {
    return apiClient.get('sites')
  },
  getSite(params) {
    return apiClient.get('sites/',{params})
  },
  createSite(data) {
    return apiClient.post(`sites`, data)
  },
  updateSite(uuid,data) {
    return apiClient.patch(`sites/${uuid}`, data)
  },
  deleteSite(uuid) {
    return apiClient.delete(`sites/${uuid}`)
  },
  
}