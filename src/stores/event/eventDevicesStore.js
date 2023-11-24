import { defineStore } from 'pinia'
import eventAPI from '@/services/event/eventAPI'
import { ref } from 'vue'
import moment from 'moment'

export const useEventDevicesStore = defineStore('eventDevices', {
  state: () => ({
    eventData: ref(''),
    eventFootageData: ref(''),
    eventStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getEventDataIsLoading: ref(false),
  }),
  actions: {
    async getEventDevices(imei,params) {
      this.getEventDataIsLoading = true
      try {
        const res = await eventAPI.getEventDevices(imei,params)
        this.eventData = res.data.eventData
        this.eventFootageData = res.data.eventFootageData
        if (Object.keys(res.data.eventData).length > 0) {
          const tmpEventData =  
            {
              _time: new Date(res.data.eventData._time).toLocaleString(),
              event: res.data.eventData._field.toUpperCase(),
              contractor: res.data.eventData.contractor,
              hullNumber: res.data.eventData.hullNumber,
              registrationNumber: res.data.eventData.registrationNumber,
            }
          this.eventData = tmpEventData
        }
        console.log('event data', this.eventData, this.eventFootage)
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
    }
  }
})