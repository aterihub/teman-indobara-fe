import apiClient from "../API"



export default {
  getManufacturers() {
    return apiClient.get('manufacturers')
  },
  getManufacturer(params) {
    return apiClient.get(`manufacturers/`,{params})
  },
  createManufacturer(data) {
    return apiClient.post(`manufacturers`, data)
  },
  updateVariant(id,data) {
    return apiClient.patch(`manufacturers/${id}`, data)
  },
  deleteVariant(id) {
    return apiClient.delete(`manufacturers/${id}`)
  },
  
}