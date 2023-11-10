import apiClient from "../API"


export default {
  getRealtimeDevices() {
    return apiClient.get('/data-devices/realtime')
  }
}