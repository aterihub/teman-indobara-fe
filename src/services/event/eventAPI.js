import apiClient from "../API"
import axios from "axios"


const eventAPIClient = axios.create({
  baseURL: process.env.VUE_APP_IMG_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  }
})

export default {
  getEventDevices(imei,params) {
    return apiClient.get(`/data-devices/event/${imei}`, {params})
  },
  getEventMeta(imei,path) {
    return eventAPIClient.get(`${imei}/${path}`)
  }
}