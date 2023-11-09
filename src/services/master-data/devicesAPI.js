import apiClient from "../API"



export default {
  getDevices() {
    return apiClient.get('devices')
  },
  getDeviceDrafts() {
    return apiClient.get('devices/drafts')
  },

  getDevice(imei) {
    return apiClient.get(`devices/${imei}`) 
  },

  updateDevice(id,data) {
    return apiClient.patch(`devices/${id}`, data)
  },

  deleteDevice(id) {
    return apiClient.delete(`devices/${id}`)
  },

  createDevice(data) {
    return apiClient.post('devices', data)
  },
  
}