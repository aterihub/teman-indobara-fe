import apiClient from "../API"



export default {

  getSiteContracts(contractorId) {
    return apiClient.get(`contractors/${contractorId}/siteContract`)
  },
  createSiteContract(contractorId,data) {
    return apiClient.post(`contractors/${contractorId}/siteContract`,data)
  },
  updateSiteContract(contractorId,siteId,data) {
    return apiClient.patch(`contractors/${contractorId}/siteContract/${siteId}`, data)
  }
}