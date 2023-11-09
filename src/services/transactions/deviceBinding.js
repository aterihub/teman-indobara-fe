import apiClient from "../API"



export default {

  getBindedDevices(id) {
    return apiClient.get(`vehicles/${id}`)
  },
  bindDevices(id,devices) {
    return apiClient.post(`vehicles/${id}/devices`, devices)
  },
  unbindDevice(id) {
    return apiClient.delete(`devices/${id}/vehicles`)
  }
}