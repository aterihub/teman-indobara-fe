import { defineStore } from 'pinia'
import realtimeAPI from '@/services/realtime/realtimeAPI'
import { ref } from 'vue'
import moment from 'moment'

export const useRealtimeDevicesStore = defineStore('realtimeDevices', {
  state: () => ({
    vehicles: ref(''),
    adasData: ref(''),
    dsmData: ref(''),
    status: ref({
      isError:null,
      message: null,
      code: null, 
    }),
    getRealtimeDataIsLoading: ref(false),
  }),
  actions: {
    async getRealtimeDevices() {
      this.getRealtimeDataIsLoading = true
      try {
        const res = await realtimeAPI.getRealtimeDevices()
        console.log(res)
        this.adasData = res.data.vehicles[0].adas
        this.adasData.deviceHealth.time = moment(this.adasData.deviceHealth.time).format("YYYY-MM-DD hh:mm")
        this.adasData.adasDetail.time = moment(this.adasData.adasDetail.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.timeTillCollision.time = moment(this.adasData.events.timeTillCollision.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.leftTurnSignal.time = moment(this.adasData.events.leftTurnSignal.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.rightTurnSignal.time = moment(this.adasData.events.rightTurnSignal.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.brakeSignal.time = moment(this.adasData.events.brakeSignal.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.lwdLeft.time = moment(this.adasData.events.lwdLeft.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.lwdRight.time = moment(this.adasData.events.lwdRight.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.sda.time = moment(this.adasData.events.sda.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.fvsa.time = moment(this.adasData.events.fvsa.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.fpw.time = moment(this.adasData.events.fpw.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.fcw.time = moment(this.adasData.events.fcw.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.pcw.time = moment(this.adasData.events.pcw.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.slrState.time = moment(this.adasData.events.slrState.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.slrRecognize.time = moment(this.adasData.events.slrRecognize.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.slrSensitivity.time = moment(this.adasData.events.slrSensitivity.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.distanceLeft.time = moment(this.adasData.events.distanceLeft.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.distanceRight.time = moment(this.adasData.events.distanceRight.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.rpm.time = moment(this.adasData.events.rpm.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.speed.time = moment(this.adasData.events.speed.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.aheadDistance.time = moment(this.adasData.events.aheadDistance.time).format("YYYY-MM-DD hh:mm")
        this.adasData.events.aheadSpeed.time = moment(this.adasData.events.aheadSpeed.time).format("YYYY-MM-DD hh:mm")
        this.dsmData = res.data.vehicles[0].dsm
        this.dsmData.deviceHealth.time = moment(this.dsmData.deviceHealth.time).format("YYYY-MM-DD hh:mm")
        this.dsmData.dsmDetail.time = moment(this.dsmData.dsmDetail.time).format("YYYY-MM-DD hh:mm")
        this.dsmData.events.drowsiness.time = moment(this.dsmData.events.drowsiness.time).format("YYYY-MM-DD hh:mm")
        this.dsmData.events.distraction.time = moment(this.dsmData.events.distraction.time).format("YYYY-MM-DD hh:mm")
        this.dsmData.events.yawning.time = moment(this.dsmData.events.yawning.time).format("YYYY-MM-DD hh:mm")
        this.dsmData.events.phone.time = moment(this.dsmData.events.phone.time).format("YYYY-MM-DD hh:mm")
        this.dsmData.events.smoking.time = moment(this.dsmData.events.smoking.time).format("YYYY-MM-DD hh:mm")
        this.dsmData.events.driverAbsence.time = moment(this.dsmData.events.driverAbsence.time).format("YYYY-MM-DD hh:mm")
        this.dsmData.events.mask.time = moment(this.dsmData.events.mask.time).format("YYYY-MM-DD hh:mm")
        this.dsmData.events.seatbelt.time = moment(this.dsmData.events.seatbelt.time).format("YYYY-MM-DD hh:mm")
        this.dsmData.events.gsensor.time = moment(this.dsmData.events.gsensor.time).format("YYYY-MM-DD hh:mm")
        this.getRealtimeDataIsLoading = false
      } catch (err) {
        this.getRealtimeDataIsLoading = false
        console.error(err)
        return err
      }
    }
  }
})