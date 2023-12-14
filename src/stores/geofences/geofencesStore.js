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
    geofences: ref([]),
    geofence: ref([]),
    geofencesStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getGeofencesIsLoading: ref(false),
    createGeofenceIsLoading: ref(false),
    deleteGeofenceIsLoading: ref(false),
  }),
  actions: {
    async getGeofences() {
      this.getGeofencesIsLoading = true
      try {
        const res = await geofencesAPI.getGeofences()
        this.geofences = res.data.geofences
        if (this.geofences.length === 0) {
          this.geofencesStatus.message = 'No Geofences Available'
        } else {
          this.geofencesStatus.message = 'Geofences Fetched'
        }
        this.geofencesStatus.isError = false
        this.getGeofencesIsLoading = false
      } catch (err) {
        this.geofencesStatus.isError = true
        this.geofencesStatus.code = err.code
        this.status.message = err.response.data.message
        switch (this.violationStatus.code) {
          case 'ERR_NETWORK':
            this.geofencesStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.geofencesStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
            default :
              this.status.message = err.response.data.message
              break;
        }
        this.getGeofencesIsLoading = false
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
        switch (this.violationStatus.code) {
          case 'ERR_NETWORK':
            this.geofencesStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.geofencesStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
            default :
              this.status.message = err.response.data.message
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
        switch (this.violationStatus.code) {
          case 'ERR_NETWORK':
            this.geofencesStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.geofencesStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
            default :
              this.status.message = err.response.data.message
              break;
        }
        this.deleteGeofenceIsLoading = false
        console.error(err)
        return err
      }
    }
  }
})