import { defineStore } from 'pinia'
import reportAPI from '@/services/report/reportAPi'
import realtimeAPI from '@/services/realtime/realtimeAPI'
import { ref } from 'vue'
import moment from 'moment'

function camelToNormalCase(camelCaseString) {
  return camelCaseString
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase());
}

export const useViolationsStore = defineStore('violationData', {
  state: () => ({
    violationsNotification: ref(''),
    violationsRealtime: ref([]),
    violationsReport: ref(''),
    violationsReportMeta: ref(''),
    violationRealtimeStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    violationStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    downloadViolationStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    notificationStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getViolationRealtimeIsLoading: ref(false),
    getViolationReportIsLoading: ref(false),
    downloadViolationReportIsLoading: ref(false),
    getViolationNotificationIsLoading: ref(false),
  }),
  actions: {
    async getViolationRealtime(params) {
      this.getViolationRealtimeIsLoading = true
      try {
        const res = await realtimeAPI.getViolationRealtime(params)
        console.log(res)
        let violation = []
        if (res.data.realtime.length > 0) {
          violation = res.data.realtime.map((item) => {
            return {
              imei: item.imei,
              eventTime: item._time,
              deviceTime: new Date(item._time).toLocaleString(),
              eventIo: item.eventIo,
              violation: camelToNormalCase(item.eventIo),
              vehicle: item.hullNumber,
              registrationNumber: item.registrationNumber,
              site: item.site,
              contractor: item.contractor,
              speed: item.speed,
              coordinate: {maps: `https://www.google.com/maps?q=${item.latitude},${item.longitude}`, latLong: `${item.latitude}, ${item.longitude}`}
            }
          })
          this.violationRealtimeStatus.message = 'Violation Fetched'
        } else {
          this.violationRealtimeStatus.message = 'No Violation Available'
        }
        this.violationsRealtime = violation
        this.violationRealtimeStatus.isError = false
        this.getViolationRealtimeIsLoading = false
      } catch (err) {
        this.violationRealtimeStatus.isError = true
        this.violationRealtimeStatus.code = err.code
        switch (this.violationRealtimeStatus.code) {
          case 'ERR_NETWORK':
            this.violationRealtimeStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.violationRealtimeStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
        }
        this.getViolationRealtimeIsLoading = false
        console.error(err)
        return err
      }
    },
    async getViolationReport(params) {
      this.getViolationReportIsLoading = true
      try {
        const res = await reportAPI.getViolationReport(params)
        console.log(res)
        let violation = []
        let meta = []
        if (res.data.violation.data.length > 0) {
          violation = res.data.violation.data.map((item) => {
            return {
              imei: item.imei,
              eventTime: item.time,
              deviceTime: new Date(item.time).toLocaleString(),
              violation: camelToNormalCase(item.violation),
              vehicle: item.vehicle,
              registrationNumber: item.registrationNumber,
              site: item.location,
              geofence: item.geofence,
              contractor: item.contractor,
              speed: item.speed,
              coordinate: {maps: `https://www.google.com/maps?q=${item.latitude},${item.longitude}`, latLong: `${item.latitude}, ${item.longitude}`}
            }
          })
          meta = res.data.violation.meta
          this.violationStatus.message = 'Violation Fetched'
        } else {
          this.violationStatus.message = 'No Violation Available'
        }
        this.violationsReport = violation
        this.violationsReportMeta = meta
        this.violationStatus.isError = false
        this.getViolationReportIsLoading = false
      } catch (err) {
        this.violationStatus.isError = true
        this.violationStatus.code = err.code
        switch (this.violationStatus.code) {
          case 'ERR_NETWORK':
            this.violationStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.violationStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
          default :
            this.violationStatus.message = err.response.data.message
          break;

        }
        this.getViolationReportIsLoading = false
        console.error(err)
        return err
      }
    },
    async downloadViolationReport(params) {
      this.downloadViolationReportIsLoading = true
      try {
        const res = await reportAPI.downloadViolationReport(params)
        window.open(res.request.responseURL)
        this.violationStatus.message = 'Violation Downloaded'
        this.downloadViolationReportIsLoading = false
      } catch (err) {
        this.downloadViolationReportIsLoading = false
        console.error(err)
        return err
      }
    },
    async getViolationNotification() {
      this.getViolationNotificationIsLoading = true
      try {
        const res = await reportAPI.getViolationNotification()
        let notification = []
        if (res.data.event.length > 0) {
          notification = res.data.event.map((item) => {
            return {
              imei: item.imei,
              eventIo: camelToNormalCase(item._value),
              eventTime: moment(item._time).format("DD-MM-YYYY hh:mm"),
              hullNumber: item.hullNumber,
              registrationNumber: item.registrationNumber,
              site: item.site,
              contractor: item.contractor,
              // coordinate: {maps: `https://www.google.com/maps?q=${item.latitude},${item.longitude}`, latLong: `${item.latitude},${item.longitude}`}
            }
          })
        } else {
          this.notificationStatus.message = 'No Violation Available'
        }
        this.violationsNotification = notification
        console.log(this.violationsNotification)
        this.notificationStatus.isError = false
        this.getViolationNotificationIsLoading = false
      } catch (err) {
        this.notificationStatus.isError = true
        this.notificationStatus.code = err.code
        this.status.message = err.response.data.message
        switch (this.notificationStatus.code) {
          case 'ERR_NETWORK':
            this.notificationStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.notificationStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
            default :
              this.notificationStatus.message = err.response.data.message
              break;
            }
        this.getViolationReportIsLoading = false
        console.error(err)
        return err
      }
    }
  }
})