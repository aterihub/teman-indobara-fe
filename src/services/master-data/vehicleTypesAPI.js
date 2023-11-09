import apiClient from "../API"



export default {
  getVehicleTypes() {
    return apiClient.get('vehicle-types')
  },
  getVehicleType(id) {
    return apiClient.get(`vehicle-types/${id}`)
  },
  createVehicleType(data) {
    return apiClient.post(`vehicle-types`, data)
  },
  updateVehicleType(id,data) {
    return apiClient.patch(`vehicle-types/${id}`, data)
  },
  deleteVehicleType(id) {
    return apiClient.delete(`vehicle-types/${id}`)
  },
  
}