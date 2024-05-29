import apiClient from "../API"


export default {
  getStreamingToken() {
    return apiClient.get('/data-devices/howen-token')
  }
}