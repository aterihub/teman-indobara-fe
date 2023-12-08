import apiClient from "../API"


export default {
  getViolationReport(params) {
    return apiClient.get('/violation/report', {params})
  },
  getViolationNotification() {
    return apiClient.get('/violation/notification')
  },
}