import { defineStore } from 'pinia'
import violationAPI from '@/services/violation/violationAPi'
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
    violationsReport: ref(''),
    violationStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    notificationStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getViolationReportIsLoading: ref(false),
    getViolationNotificationIsLoading: ref(false),
  }),
  actions: {
    async getViolationReport(params) {
      this.getViolationReportIsLoading = true
      try {
        const res = await violationAPI.getViolationReport(params)
        let violation = []
        if (res.data.violation.length > 0) {
          violation = res.data.violation.map((item) => {
            return {
              imei: item.imei,
              eventIo: item.eventIo,
              eventTime: item._time,
              deviceTime: new Date(item._time).toLocaleString(),
              violation: item.eventIo.toUpperCase(),
              hullNumber: item.hullNumber,
              registrationNumber: item.registrationNumber,
              site: item.site,
              contractor: item.contractor,
              speed: item.speed,
              coordinate: {maps: `https://www.google.com/maps?q=${item.latitude},${item.longitude}`, latLong: `${item.latitude},${item.longitude}`}
            }
          })
          this.violationStatus.message = 'Violation Fetched'
        } else {
          this.violationStatus.message = 'No Violation Available'
        }
        this.violationsReport = violation
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
    async getViolationNotification() {
      this.getViolationNotificationIsLoading = true
      try {
        const res = await violationAPI.getViolationNotification()
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