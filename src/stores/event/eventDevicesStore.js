import { defineStore } from 'pinia'
import eventAPI from '@/services/event/eventAPI'
import { ref } from 'vue'
import moment from 'moment'
function camelToNormalCase(camelCaseString) {
  return camelCaseString
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}
export const useEventDevicesStore = defineStore('eventDevices', {
  state: () => ({
    eventMeta: ref(''),
    eventData: ref(''),
    eventFootageData: ref({}),
    isEventFootageDataEmpty: ref(false),
    eventStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    eventMetaStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    getEventDataIsLoading: ref(false),
    getEventMetaIsLoading: ref(false),
  }),
  actions: {
    async getEventDevices(imei, params) {
      this.getEventDataIsLoading = true
      try {
        const res = await eventAPI.getEventDevices(imei, params)
        this.eventData = res.data.eventData
        if (res.data.eventFootageData.length === 0) {
          this.isEventFootageDataEmpty =  true 
        } else {
          this.isEventFootageDataEmpty =  false 
        }
        this.eventFootageData = res.data.eventFootageData
        if (Object.keys(res.data.eventData).length > 0) {
          const tmpEventData =
          {
            _time: new Date(res.data.eventData._time).toLocaleString(),
            event: camelToNormalCase(res.data.eventData._value),
            contractor: res.data.eventData.contractor,
            hullNumber: res.data.eventData.hullNumber,
            registrationNumber: res.data.eventData.registrationNumber,
          }
          this.eventData = tmpEventData
        }
        this.eventStatus.isError = false
        this.getEventDataIsLoading = false
      } catch (err) {
        this.eventStatus.isError = true
        this.eventStatus.code = err.code
        switch (this.eventStatus.code) {
          case 'ERR_NETWORK':
            this.eventStatus.message = 'Network Error'
            break;
        }
        this.getEventDataIsLoading = false
        console.error(err)
        return err
      }
    },
    async getEventMeta(imei, path) {
      this.getEventMetaIsLoading = true
      try {
        const res = await eventAPI.getEventMeta(imei, path)
        const properties = {}
        if (res.data) {
          const lines = res.data.split('\n')
          lines.forEach((line) => {
            const match = line.match(/([^:]+):(.+)/)
            if (match) {
              const key = match[1].trim()
              const value = match[2].trim()
              properties[key] = value
            }
          })
        }
        this.eventMeta = properties
        this.eventMetaStatus.isError = false
        this.getEventMetaIsLoading = false
      } catch (err) {
        this.eventMetaStatus.isError = true
        this.eventMetaStatus.code = err.code
        switch (this.eventMetaStatus.code) {
          case 'ERR_NETWORK':
            this.eventMetaStatus.message = 'Network Error'
            break;
        }
        this.getEventMetaIsLoading = false
        console.error(err)
        return err
      }
    },
  }
})