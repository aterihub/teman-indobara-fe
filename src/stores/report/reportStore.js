import { defineStore } from 'pinia'
import reportAPI from '@/services/report/reportAPi'
import { ref } from 'vue'
import moment from 'moment'

function camelToNormalCase(camelCaseString) {
  return camelCaseString
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase());
}

export const useReportStore = defineStore('reportData', {
  state: () => ({
    devicesReport: ref(''),
    locationReport: ref([]),
    locationReportMeta: ref({}),
    getLocationStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    downloadLocationStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getDevicesReportIsLoading: ref(false),
    getLocationReportIsLoading: ref(false),
    downloadLocationReportIsLoading: ref(false),
    locationHourlyReport: ref([]),
    locationHourlyReportMeta: ref({}),
    getLocationHourlyStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    downloadLocationHourlyStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getLocationHourlyReportIsLoading: ref(false),
    downloadLocationHourlyReportIsLoading: ref(false),
  }),
  actions: {
    async getLocationReport(params) {
      this.getLocationReportIsLoading = true
      try {
        const res = await reportAPI.getLocationReport(params)
        console.log(res)
        let location = []
        let meta = {}
         if (res.data.report.data.length > 0) {
          location = res.data.report.data.map((item) => {
            return {
              contractor: item.contractor === null? '-' : item.contractor,
              fuel: item.fuel === null? '-' : item.fuel,
              geofence: item.geofence === null? '-' : item.geofence,
              gpsStatus: item.gpsStatus === null? '-' : item.gpsStatus,
              gsm: item.gsm === null? '-' : item.gsm,
              imei: item.imei === null? '-' : item.imei,
              odometer: item.odometer === null? '-' : item.odometer,
              coordinate: {maps: `https://www.google.com/maps?q=${item.latitude},${item.longitude}`, latLong: `${item.latitude}, ${item.longitude}`},
              registrationNumber: item.registrationNumber === null? '-' : item.registrationNumber,
              deviceTime: new Date(item.time).toLocaleString(),
              satellite: item.satellite === null? '-' : item.satellite,
              vehicle: item.vehicle === null? '-' : item.vehicle,
              status: item.status === null? '-' : item.status,
              site: item.location === null? '-' : item.location,
              speed: item.speed === null? '-' : item.speed,
              gps: item.gps === null? '-' : item.gps,
              track: item.track === null? '-' : item.track,
            }
          })
          meta = res.data.report.meta
          this.getLocationStatus.message = 'Location Report Fetched'
        } else {
          this.getLocationStatus.message = 'No Location Report Available'
        }
        this.locationReport = location
        this.locationReportMeta = meta
        this.getLocationStatus.isError = false
        this.getLocationReportIsLoading = false
      } catch (err) {
        this.getLocationStatus.isError = true
        this.getLocationStatus.code = err.code
        switch (this.getLocationStatus.code) {
          case 'ERR_NETWORK':
            this.getLocationStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.getLocationStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
          // default :
          //   this.getLocationStatus.message = err.response.data.message
          // break;

        }
        this.getLocationReportIsLoading = false
        console.error(err)
        return err
      }
    },
    async downloadLocationReport(params) {
      this.downloadLocationReportIsLoading = true
      try {
        const res = await reportAPI.downloadLocationReport(params)
        window.open(res.request.responseURL)
        this.downloadLocationStatus.message = 'Location Report Downloaded'
        this.downloadLocationReportIsLoading = false
      } catch (err) {
        this.downloadLocationReportIsLoading = false
        console.error(err)
        return err
      }
    },
    async getLocationHourlyReport(params) {
      this.getLocationHourlyReportIsLoading = true
      try {
        const res = await reportAPI.getLocationHourlyReport(params)
        console.log(res)
        let locationHourly = []
        let meta = {}
         if (res.data.hourly.data.length > 0) {
          locationHourly = res.data.hourly.data.map((item) => {
            return {
              contractor: item.contractor,
              geofence: item.geofence,
              id: item.id,
              imei: item.imei,
              coordinate: {maps: `https://www.google.com/maps?q=${item.latitude},${item.longitude}`, latLong: `${item.latitude}, ${item.longitude}`},
              registrationNumber: item.registrationNumber,
              deviceTime: new Date(item.time).toLocaleString(),
              vehicle: item.vehicle,
              site: item.location,
              speed: item.speed,
            }
          })
          meta = res.data.hourly.meta
          this.getLocationHourlyStatus.message = 'Location Report Fetched'
        } else {
          this.getLocationHourlyStatus.message = 'No Location Report Available'
        }
        this.locationHourlyReport = locationHourly
        this.locationHourlyReportMeta = meta
        this.getLocationHourlyStatus.isError = false
        this.getLocationHourlyReportIsLoading = false
      } catch (err) {
        this.getLocationHourlyStatus.isError = true
        this.getLocationHourlyStatus.code = err.code
        switch (this.getLocationHourlyStatus.code) {
          case 'ERR_NETWORK':
            this.getLocationHourlyStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.getLocationHourlyStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
          // default :
          //   this.getLocationHourlyStatus.message = err.response.data.message
          // break;

        }
        this.getLocationHourlyReportIsLoading = false
        console.error(err)
        return err
      }
    },
    async downloadLocationHourlyReport(params) {
      this.downloadLocationHourlyReportIsLoading = true
      try {
        const res = await reportAPI.downloadLocationHourlyReport(params)
        window.open(res.request.responseURL)
        this.downloadLocationHourlyStatus.message = 'Location Report Downloaded'
        this.downloadLocationHourlyReportIsLoading = false
      } catch (err) {
        this.downloadLocationHourlyReportIsLoading = false
        console.error(err)
        return err
      }
    },
    async getDevicesReport(params) {
      this.getDevicesReportIsLoading = true
      try {
        const res = await reportAPI.getDevicesReport(params)
        this.devicesReport = res.data.data
        console.log(this.devicesReport)
        // let locationHourly = []
        // let meta = {}
        //  if (res.data.hourly.data.length > 0) {
        //   locationHourly = res.data.hourly.data.map((item) => {
        //     return {
        //       contractor: item.contractor,
        //       geofence: item.geofence,
        //       id: item.id,
        //       imei: item.imei,
        //       coordinate: {maps: `https://www.google.com/maps?q=${item.latitude},${item.longitude}`, latLong: `${item.latitude}, ${item.longitude}`},
        //       registrationNumber: item.registrationNumber,
        //       deviceTime: new Date(item.time).toLocaleString(),
        //       vehicle: item.vehicle,
        //       site: item.location,
        //       speed: item.speed,
        //     }
        //   })
        //   meta = res.data.hourly.meta
        //   this.getLocationHourlyStatus.message = 'Location Report Fetched'
        // } else {
        //   this.getLocationHourlyStatus.message = 'No Location Report Available'
        // }
        // this.locationHourlyReport = locationHourly
        // this.locationHourlyReportMeta = meta
        this.getLocationHourlyStatus.isError = false
        this.getDevicesReportIsLoading = false
      } catch (err) {
        this.getLocationHourlyStatus.isError = true
        this.getLocationHourlyStatus.code = err.code
        switch (this.getLocationHourlyStatus.code) {
          case 'ERR_NETWORK':
            this.getLocationHourlyStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.getLocationHourlyStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
        }
        this.getDevicesReportIsLoading = false
        console.error(err)
        return err
      }
    },
  }
})