import apiClient from "../API"


export default {
  getViolationReport(params) {
    return apiClient.get('/violation/report', {params})
  },
  getViolationGraphic() {
    return apiClient.get('/violation/graphic')
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
  getDevicesReport(params) {
    return apiClient.get('/data-devices/history', {params})
  },
  getDensityReport(params) {
    return apiClient.get('/location-report/geofence', {params})
  },
  getDensityDetail(params) {
    return apiClient.get('/location-report/geofence/detail', {params})
  },
}