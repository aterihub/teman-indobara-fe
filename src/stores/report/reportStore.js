import { defineStore } from 'pinia'
import reportAPI from '@/services/report/reportAPi'
import { ref } from 'vue'
import moment from 'moment'

function camelToNormalCase(camelCaseString) {
  return camelCaseString
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}
function convertCamelCaseToNormalCase(obj) {
  const convertedObject = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const convertedKey = key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase())
      convertedObject[convertedKey] = obj[key];
    }
  }
  return convertedObject;
}

export const useReportStore = defineStore('reportData', {
  state: () => ({
    densityDetailLength: ref(0),
    densityDetail: ref([]),
    densityReport: ref([]),
    devicesReport: ref(''),
    locationReport: ref([]),
    locationReportMeta: ref({}),
    locationHourlyReport: ref([]),
    locationHourlyReportMeta: ref({}),
    downloadLocationReportIsLoading: ref(false),
    getDevicesReportIsLoading: ref(false),
    getLocationReportIsLoading: ref(false),
    getLocationHourlyReportIsLoading: ref(false),
    downloadLocationHourlyReportIsLoading: ref(false),
    getDensityReportIsLoading: ref(false),
    getDensityDetailIsLoading: ref(false),
    getDensityDetailStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    getLocationStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    downloadLocationStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    getLocationHourlyStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    getDevicesReportStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    downloadLocationHourlyStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    getDensityReportStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
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
              contractor: item.contractor === null ? '-' : item.contractor,
              fuel: item.fuel === null ? '-' : item.fuel,
              geofence: item.geofence === null ? '-' : item.geofence,
              gpsStatus: item.gpsStatus === null ? '-' : item.gpsStatus,
              gsm: item.gsm === null ? '-' : item.gsm,
              imei: item.imei === null ? '-' : item.imei,
              odometer: item.odometer === null ? '-' : item.odometer,
              coordinate: { maps: `https://www.google.com/maps?q=${item.latitude},${item.longitude}`, latLong: `${item.latitude}, ${item.longitude}` },
              registrationNumber: item.registrationNumber === null ? '-' : item.registrationNumber,
              deviceTime: new Date(item.time).toLocaleString(),
              satellite: item.satellite === null ? '-' : item.satellite,
              vehicle: item.vehicle === null ? '-' : item.vehicle,
              status: item.status === null ? '-' : item.status,
              site: item.location === null ? '-' : item.location,
              speed: item.speed === null ? '-' : item.speed,
              gps: item.gps === null ? '-' : item.gps,
              track: item.track === null ? '-' : item.track,
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
              coordinate: { maps: `https://www.google.com/maps?q=${item.latitude},${item.longitude}`, latLong: `${item.latitude}, ${item.longitude}` },
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
        if (res.data.type !== 'MDVR') {
          this.devicesReport.map((data) => {
            data._time = new Date(data._time).toLocaleString()
            data.batteryPercentage = data.batteryPercentage.toFixed(2)
            data.event = convertCamelCaseToNormalCase(data.event)
          })
        } else {
          this.devicesReport.map((data) => {
            data._time = new Date(data._time).toLocaleString()
          })
        }
        console.log(this.devicesReport)
        this.getDevicesReportStatus.isError = false
        this.getDevicesReportStatus.message = 'Report Fetched'
        this.getDevicesReportIsLoading = false
      } catch (err) {
        this.getDevicesReportStatus.isError = true
        this.getDevicesReportStatus.code = err.code
        switch (this.getDevicesReportStatus.code) {
          case 'ERR_NETWORK':
            this.getDevicesReportStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.getDevicesReportStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
        }
        this.getDevicesReportIsLoading = false
        console.error(err)
        return err
      }
    },
    async getDensityReport(params) {
      this.getDensityReportIsLoading = true
      try {
        const res = await reportAPI.getDensityReport(params)
        console.log(res)
        this.densityReport = res.data.report
        this.getDensityReportStatus.message = 'Density Fetched'
        this.getDensityReportStatus.isError = false
        this.getDensityReportIsLoading = false
      } catch (err) {
        this.densityReport = []
        this.getDensityReportStatus.isError = true
        this.getDensityReportStatus.code = err.code
        switch (this.getDensityReportStatus.code) {
          case 'ERR_NETWORK':
            this.getDensityReportStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.getDensityReportStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
        }
        this.getDensityReportIsLoading = false
        console.error(err)
        return err
      }
    },
    async getDensityDetail(params) {
      this.getDensityDetailIsLoading = true
      try {
        const res = await reportAPI.getDensityDetail(params)
        console.log(res)
        this.densityDetail = res.data.detail
        this.densityDetailLength = res.data.detail.geofenceData.length
        this.getDensityDetailStatus.message = 'Detail Fetched'
        this.getDensityDetailStatus.isError = false
        this.getDensityDetailIsLoading = false
      } catch (err) {
        this.getDensityDetailStatus.message = 'Detail Not Found'
        this.getDensityDetailStatus.isError = true
        this.getDensityDetailStatus.code = err.code
        switch (this.getDensityDetailStatus.code) {
          case 'ERR_NETWORK':
            this.getDensityDetailStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.getDensityDetailStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
        }
        this.getDensityDetailIsLoading = false
        console.error(err)
        return err
      }
    },
  }
})