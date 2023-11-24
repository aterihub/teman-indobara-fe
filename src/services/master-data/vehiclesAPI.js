import apiClient from "../API"



export default {
  getVehicles(params) {
    return apiClient.get('vehicles', {params})
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