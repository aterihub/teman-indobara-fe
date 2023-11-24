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

        if (res.data.violation.length > 0) {
          const violation = res.data.violation.map((item) => {
            return {
              imei: item.imei,
              eventIo: item.eventIo,
              eventTime: item._time,
              deviceTime: new Date(item._time).toLocaleString(),
              violation: item.eventIoName.toUpperCase(),
              hullNumber: item.hullNumber,
              registrationNumber: item.registrationNumber,
              site: item.site,
              contractor: item.contractor,
              speed: item.speed,
              coordinate: {maps: `https://www.google.com/maps?q=${item.latitude},${item.longitude}`, latLong: `${item.latitude},${item.longitude}`}
            }
          })
          this.violationsReport = violation
        }

        this.violationStatus.isError = false
        this.getViolationReportIsLoading = false
      } catch (err) {
        this.violationStatus.isError = true
        this.violationStatus.code = err.code
        switch (this.violationStatus.code) {
          case 'ERR_NETWORK':
            this.violationStatus.message = 'Network Error'
            break;
        }
        this.getViolationReportIsLoading = false
        console.error(err)
        return err
      }
    }
  }
})