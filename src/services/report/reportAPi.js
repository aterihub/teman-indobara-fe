import apiClient from "../API"


export default {
  getViolationReport(params) {
    return apiClient.get('/violation/report', {params})
  },
  getViolationNotification() {
    return apiClient.get('/violation/notification')
  },
  downloadViolationReport(params) {
    return apiClient.get('/violation/export', {params})
  },
  getLocationReport(params) {
    return apiClient.get('/location-report', {params})
  },
  downloadLocationReport(params) {
    return apiClient.get('/location-report/export', {params})
  },
  getLocationHourlyReport(params) {
    return apiClient.get('/location-report/hourly', {params})
  },
  downloadLocationHourlyReport(params) {
    return apiClient.get('/location-report/hourly/export', {params})
  },
}