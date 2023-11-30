import { defineStore } from 'pinia'
import violationAPI from '@/services/violation/violationAPi'
import { ref } from 'vue'
import moment from 'moment'

export const useViolationsStore = defineStore('violationData', {
  state: () => ({
    violationsReport: ref(''),
    violationStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getViolationReportIsLoading: ref(false),
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
          this.violationStatus.message = 'No Violation Avaialable'
        }
        this.violationsReport = violation
        this.violationStatus.isError = false
        this.getViolationReportIsLoading = false
      } catch (err) {
        this.violationStatus.isError = true
        this.violationStatus.code = err.code
        this.violationStatus.message = 'Network Error'
        switch (this.violationStatus.code) {
          case 'ERR_NETWORK':
            this.violationStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.violationStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
        }
        this.getViolationReportIsLoading = false
        console.error(err)
        return err
      }
    }
  }
})