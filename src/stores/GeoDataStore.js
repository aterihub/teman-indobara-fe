import { defineStore } from 'pinia'
import dataAPI from '@/services/dataAPI'
import { ref } from 'vue'
function camelToNormalCase(camelCaseString) {
  return camelCaseString
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase());
}

export const useGeoDataStore = defineStore('geo', {
  state: () => ({
    deviceGeo: ref({
      altitude: null,
      angle: null,
      external_power: null,
      fix_flag: null,
      gsm_signal: null,
      hdop: null,
      internal_battery: null,
      latitude: null,
      longitude: null,
      result: null,
      satellites: null,
      speed: null
    }),
    deviceHistoryGeo: ref([{
      altitude: null,
      angle: null,
      external_power: null,
      fix_flag: null,
      gsm_signal: null,
      hdop: null,
      internal_battery: null,
      latitude: null,
      longitude: null,
      result: null,
      satellites: null,
      speed: null
    }]),
    vehicleLastGeo: ref({
      lastData: {
        altitude: null,
        angle: null,
        external_power: null,
        fix_flag: null,
        gsm_signal: null,
        hdop: null,
        internal_battery: null,
        latitude: null,
        longitude: null,
        result: null,
        satellites: null,
        speed: null
      }
    }),
    vehicleHistoryGeo: ref([{
      lastData: {
        altitude: null,
        angle: null,
        external_power: null,
        fix_flag: null,
        gsm_signal: null,
        hdop: null,
        internal_battery: null,
        latitude: null,
        longitude: null,
        result: null,
        satellites: null,
        speed: null
      }
    }]),
    isLoading: ref(false),
    status: ref({
      state:null,
      message: null,
      code: null,
    })
  }),

  actions: {
    async getLastDeviceGeo(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getLastDeviceGeo(params)
        this.deviceGeo = res.data
        this.isLoading = false
      } catch (err) {
        console.error(err)
        this.isLoading = false
        return err
      }
    },
    async getHistoryDeviceGeo(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getHistoryDeviceGeo(params)
        this.deviceHistoryGeo = res.data
        this.isLoading = false
      } catch (err) {
        console.error(err)
        this.isLoading = false
        return err
      }
    },
    async getVehicleLastDeviceGeo(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getVehicleLastDeviceGeo(params)
        this.vehicleLastGeo = res.data.vehicle
        res.data.vehicle.map((data, index) => {
          let radius = parseFloat(data.gnssHdop) * 2.5
          let diameter = radius * 2
          this.vehicleLastGeo[index].radius = diameter
          this.vehicleLastGeo[index]._time = new Date(data._time).toLocaleString()
          this.vehicleLastGeo[index].storedTime = new Date(data.storedTime).toLocaleString()
        })
        console.log(this.vehicleLastGeo)
        this.isLoading = false
        if (res.data.vehicle.length === 0) {
          this.status.isError = true
          this.status.message = 'No Vehicle Found'
        }
      } catch (err) {
        console.error(err)
        this.isLoading = false
        return err
      }
    },
    async getVehicleHistoryDeviceGeo(id,params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getVehicleHistoryDeviceGeo(id,params)
        console.log(res.data)
        res.data.vehicle.devices.map((data) => {
          // if (data.variant.manufacturer.name === 'Istartek') {
          //   data.historyData.map((data) => {
          //     let gsm_signal = Math.floor((data.gsm_signal/31)*5)
          //     data.gsm_signal = gsm_signal
          //     // console.log(gsm_signal)
          //   })
          // }
          // if (data.variant.manufacturer.name === 'Teltonika') {
          //   data.historyData.map((data) => {
          //     let gsm_signal = Math.floor(data.gsm_signal)
          //     data.gsm_signal = gsm_signal
          //     // console.log(gsm_signal)
          //   })
          // }
          
          data.history.map((data) => {
            let radius = parseFloat(data.hdop) * 2.5
            let diameter = radius * 2
            data.radius = diameter
            let unix_stored_time = Math.floor(new Date(data.storedTime).getTime() / 1000)
            let unix_time = Math.floor(new Date(data._time).getTime() / 1000)
            data.diff_time = Math.abs(unix_stored_time - unix_time)
            data.deviceTime = new Date(data._time).toLocaleString()
            data.storedTime = new Date(data.storedTime).toLocaleString()
            data.batteryVoltage = data.batteryVoltage/1000
            data.externalVoltage = data.externalVoltage/1000
            data.eventIo = camelToNormalCase(data.eventIo)
            data.coordinate = {maps: `https://www.google.com/maps?q=${data.latitude},${data.longitude}`, latLong: `${data.latitude},${data.longitude}`}
          })
        })

        this.vehicleHistoryGeo = res.data
        this.isLoading = false
        this.status.isError = false
        this.status.message ='Route Fetched'
        this.status.code = res.status
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.status.isError = true
        this.status.message = err.response.data.message
        this.status.code = err.response.data.statusCode
        return err
      }
    }
  }
})
