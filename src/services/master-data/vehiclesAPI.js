import apiClient from "../API"



export default {
  getVehicles() {
    return apiClient.get('vehicles')
  },
  getVehicle(id) {
    return apiClient.get(`vehicles/${id}`)
  },

  createVehicle(data) {
    return apiClient.post(`vehicles`, data)
  },
  updateVehicle(id,data) {
    return apiClient.patch(`vehicles/${id}`, data)
  },
  deleteVehicle(id) {
    return apiClient.delete(`vehicles/${id}`)
  },
  
}