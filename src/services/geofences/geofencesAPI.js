import apiClient from "../API"


export default {
  getQuickCount() {
    return apiClient.get('/geofences/area/graphic')
  },
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