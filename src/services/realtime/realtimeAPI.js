import apiClient from "../API"


export default {
  getRealtimeDevices() {
    return apiClient.get('/data-devices/realtime')
  },
  getRealtimeDevicesByType(type) {
    return apiClient.get(`/data-devices/device/${type}`)
  },
  getViolationRealtime(params) {
    return apiClient.get('/violation/realtime',{params})
  },
  getRealtimeDashboard() {
    return apiClient.get(`/data-devices/dashboard`)
  },
}