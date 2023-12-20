import apiClient from "../API"


export default {
  getGeofences() {
    return apiClient.get('/geofences')
  },
  getGeofence(id) {
    return apiClient.get(`/geofences/${id}`)
  },
  createGeofence(data) {
    return apiClient.post('/geofences', data)
  },
  deleteGeofence(id) {
    return apiClient.delete(`/geofences/${id}`)
  }
}