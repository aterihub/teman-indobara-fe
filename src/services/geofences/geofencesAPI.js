import apiClient from "../API"


export default {
  getGeofences() {
    return apiClient.get('/geofences')
  },
  createGeofence(data) {
    return apiClient.post('/geofences', data)
  },
  deleteGeofence(id) {
    return apiClient.delete(`/geofences/${id}`)
  }
}