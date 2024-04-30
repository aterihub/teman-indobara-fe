import { defineStore } from 'pinia'
import geofencesAPI from '@/services/geofences/geofencesAPI'
import { ref } from 'vue'
import moment from 'moment'

function camelToNormalCase(camelCaseString) {
  return camelCaseString
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}

export const useGeofencesStore = defineStore('geofencesData', {
  state: () => ({
    quickCount: ref([]),
    geofences: ref([]),
    geofenceZone: ref({}),
    geofence: ref([]),
    getGeofencesStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    getGeofenceStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    geofencesStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    quickCountStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    getGeofencesIsLoading: ref(false),
    getGeofenceIsLoading: ref(false),
    createGeofenceIsLoading: ref(false),
    deleteGeofenceIsLoading: ref(false),
    getQuickCountIsLoading: ref(false),
  }),
  actions: {
    async getGeofences() {
      this.getGeofencesIsLoading = true
      try {
        const res = await geofencesAPI.getGeofences()
        let geofences = []
        if (res.data.geofences.length > 0) {
          geofences = res.data.geofences.map((item) => {
            let operandText
            switch (item.operand) {
              case 0:
                operandText = "On Exit"
                break;
              case 1:
                operandText = "On Enter"
                break;
              case 2:
                operandText = "On Both"
                break;
            }
            return {
              id: item.id,
              geofenceId: camelToNormalCase(item.geofenceId),
              name: item.name,
              operand: item.operand,
              operandText: operandText,
              eventualRecord: item.eventualRecord,
              frameBorder: item.frameBorder,
              coordinates: item.coordinates,
              maxAllowedSpeed: item.maxAllowedSpeed,
              maxAllowedSpeedLoad: item.maxAllowedSpeedLoad,
              notes: item.notes,

            }
          })
          this.geofences = geofences
          this.getGeofencesStatus.message = 'No Geofences Available'
        } else {
          this.getGeofencesStatus.message = 'Geofences Fetched'
        }
        this.getGeofencesStatus.isError = false
        this.getGeofencesIsLoading = false
      } catch (err) {
        this.getGeofencesStatus.isError = true
        this.getGeofencesStatus.code = err.code
        this.status.message = err.response.data.message
        switch (this.getGeofencesStatus.code) {
          case 'ERR_NETWORK':
            this.getGeofencesStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.getGeofencesStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
          default:
            this.getGeofencesStatus.message = err.response.data.message
            break;
        }
        this.getGeofencesIsLoading = false
        console.error(err)
        return err
      }
    },
    async getGeofence(id) {
      this.getGeofenceIsLoading = true
      try {
        const res = await geofencesAPI.getGeofence(id)
        this.geofenceZone = res.data.geofence
        if (this.geofenceZone.length === 0) {
          this.getGeofenceStatus.message = 'No Geofence Available'
        } else {
          this.getGeofenceStatus.message = 'Geofence Fetched'
        }
        this.getGeofenceStatus.isError = false
        this.getGeofenceIsLoading = false
      } catch (err) {
        this.geofenceZone = {
          name: null,
          operand: 0,
          eventualRecord: false,
          frameBorder: 0,
          maxAllowedSpeed: 0,
          notes: null
        }
        this.getGeofenceStatus.isError = true
        this.getGeofenceStatus.code = err.code
        switch (this.getGeofenceStatus.code) {
          case 'ERR_NETWORK':
            this.getGeofenceStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.getGeofenceStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
          default:
            this.getGeofenceStatus.message = err.response.data.message
            break;
        }
        this.getGeofenceIsLoading = false
        console.error(err)
        return err
      }
    },
    async createGeofence(data) {
      this.createGeofenceIsLoading = true
      try {
        const res = await geofencesAPI.createGeofence(data)
        this.geofence = res.data.geofence
        this.geofencesStatus.message = 'Geofences Created'
        this.geofencesStatus.isError = false
        this.createGeofenceIsLoading = false
      } catch (err) {
        this.geofencesStatus.isError = true
        this.geofencesStatus.code = err.code
        switch (this.geofencesStatus.code) {
          case 'ERR_NETWORK':
            this.geofencesStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.geofencesStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
          default:
            this.geofencesStatus.message = err.response.data.message
            break;
        }
        this.createGeofenceIsLoading = false
        console.error(err)
        return err
      }
    },
    async deleteGeofence(id) {
      this.deleteGeofenceIsLoading = true
      try {
        await geofencesAPI.deleteGeofence(id)
        this.geofencesStatus.message = 'Geofences Deleted'
        this.geofencesStatus.isError = false
        this.deleteGeofenceIsLoading = false
      } catch (err) {
        this.geofencesStatus.isError = true
        this.geofencesStatus.code = err.code
        switch (this.geofencesStatus.code) {
          case 'ERR_NETWORK':
            this.geofencesStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.geofencesStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
          default:
            this.geofencesStatus.message = err.response.data.message
            break;
        }
        this.deleteGeofenceIsLoading = false
        console.error(err)
        return err
      }
    },
    async getQuickCount() {
      this.getQuickCountIsLoading = true
      try {
        const res = await geofencesAPI.getQuickCount()
        this.quickCount = res.data
        let totalQuickCount = res.data.graphicData.reduce((sum, graphicData) => sum + graphicData.count, 0);
        this.quickCount.total = totalQuickCount
        console.log(this.quickCount)
        this.quickCountStatus.isError = false
        this.getQuickCountIsLoading = false
      } catch (err) {
        this.quickCountStatus.isError = true
        this.quickCountStatus.code = err.code
        switch (this.quickCountStatus.code) {
          case 'ERR_NETWORK':
            this.quickCountStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.quickCountStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
        }
        this.getQuickCountIsLoading = false
        console.error(err)
        return err
      }
    },
  }
})