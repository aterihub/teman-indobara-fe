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
    async getLocationHourlyReport(params) {
      this.getLocationHourlyReportIsLoading = true
      try {
        const res = await reportAPI.getLocationHourlyReport(params)
        console.log(res)
        let locationHourly = []
        let meta = []
         if (res.data.hourly.data.length > 0) {
          locationHourly = res.data.hourly.data.map((item) => {
            return {
              contractor: item.contractor,
              geofence: item.geofence,
              id: item.id,
              imei: item.imei,
              coordinate: {maps: `https://www.google.com/maps?q=${item.latitude},${item.longitude}`, latLong: `${item.latitude},${item.longitude}`},
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
    }
  }
})