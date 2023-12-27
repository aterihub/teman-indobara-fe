import apiClient from "../API"


export default {
  getRealtimeDevices() {
    return apiClient.get('/data-devices/realtime')
  },
  getViolationRealtime(params) {
    return apiClient.get('/violation/realtime',{params})
  }
}