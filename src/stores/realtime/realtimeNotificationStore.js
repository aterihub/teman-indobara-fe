import { defineStore } from 'pinia'
import { ref } from 'vue'
import moment from 'moment'
import { useLocalStorage } from '@vueuse/core'

function camelToNormalCase(camelCaseString) {
  return camelCaseString
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase());
}

export const useRealtimeNofiticationStore = defineStore('realtimeNotification', {
  state: () => ({
    notifications: useLocalStorage('notifications', ''),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getRealtimeNotificationIsLoading: ref('false'),
    isNewMessage: useLocalStorage('isNewMessage', false),
    notifAlertActive: useLocalStorage('notifAlertActive', false)
  }),
  actions: {
    async getRealtimeNotification() {
      this.getRealtimeNotificationIsLoading = true
      try {
        const socket = new WebSocket(process.env.VUE_APP_WS_URL)
        socket.onerror = (event) => {
          console.error('WebSocket Error:', event)
        }
        socket.onopen = (event) => {
          console.log('WebSocket Connection Opened:', event)
        }
        socket.onclose = (event) => {
          console.log('WebSocket Connection Closed:', event)
        }
        socket.onmessage = (event) => {
          console.log('new message',event.data)
          this.notifications = JSON.parse(event.data)
          this.notifications.eventIo = camelToNormalCase(this.notifications.eventIo)
          this.notifications.timestamp = moment(this.notifications.timestamp).format("DD-MM-YYYY hh:mm").toLocaleString()
          this.isNewMessage = true
          this.notifAlertActive = true
        }
      } catch (err) {
        this.status.isError = true
        this.status.code = err.code
        switch (this.status.code) {
          case 'ERR_NETWORK':
            this.status.message = 'Network Error'
            break;
        }
        this.getRealtimeNotificationIsLoading = false
        console.error(err)
        return err
      }
    }
  }
})