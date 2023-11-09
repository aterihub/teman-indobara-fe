import apiClient from "../API"



export default {
  getVehicleBrands() {
    return apiClient.get('vehicle-brands')
  },
  getVehicleBrand(id) {
    return apiClient.get(`vehicle-brands/${id}`)
  },
  createVehicleBrand(data) {
    return apiClient.post(`vehicle-brands`, data)
  },
  updateVehicleBrand(id,data) {
    return apiClient.patch(`vehicle-brands/${id}`, data)
  },
  deleteVehicleBrand(id) {
    return apiClient.delete(`vehicle-brands/${id}`)
  },
  
}