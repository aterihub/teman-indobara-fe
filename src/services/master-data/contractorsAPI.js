import apiClient from "../API"



export default {
  getContractors() {
    return apiClient.get('contractors')
  },
  getContractor(uuid) {
    return apiClient.get(`contractors/${uuid}`)
  },
  createContractor(data) {
    return apiClient.post(`contractors`, data)
  },
  updateContractor(uuid,data) {
    return apiClient.patch(`contractors/${uuid}`, data)
  },
  deleteContractor(uuid) {
    return apiClient.delete(`contractors/${uuid}`)
  },
}