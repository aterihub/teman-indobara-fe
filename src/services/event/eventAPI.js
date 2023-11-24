import apiClient from "../API"


export default {
  getEventDevices(imei,params) {
    return apiClient.get(`/data-devices/event/${imei}`, {params})
  }
}