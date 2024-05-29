import { defineStore } from 'pinia'
import realtimeAPI from '@/services/streaming/streamingAPI'
import { ref } from 'vue'


export const useStreamingStore = defineStore('streamingData', {
  state: () => ({
    streamingToken: ref(''),
    getStreamingTokenIsLoading: ref(false),
    streamingTokenStatus: ref({
      isError:null,
      message: null,
      code: null, 
    }),
  }),
  actions: {
    async getStreamingToken(params) {
      this.getStreamingTokenIsLoading = true
      try {
        const res = await realtimeAPI.getStreamingToken(params)
        console.log(res)
        this.streamingToken = res.data.token
        this.getStreamingTokenIsLoading = false
      } catch (err) {
        this.streamingTokenStatus.isError = true
        this.streamingTokenStatus.code = err.code
        switch (this.streamingTokenStatus.code) {
          case 'ERR_NETWORK':
            this.streamingTokenStatus.message = 'Network Error'
            break;
          case 'ERR_BAD_REQUEST':
            this.streamingTokenStatus.message = 'Invalid request. Make sure the request format and data are correct'
            break;
        }
        this.getStreamingTokenIsLoading = false
        console.error(err)
        return err
      }
    }
  }
})