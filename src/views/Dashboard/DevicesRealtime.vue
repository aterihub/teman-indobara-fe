<template>
  <sideNav :isDMActive="true" />
  <div class="content">
    <div class="device-container">
      <h1 class="title"> Dashboard </h1>
      <div class="card-wrapper">
        <lazyCard v-if="loading" v-for="card in 3" />
        <div v-if="!loading" class="card">
          <div class="flex justify-between pb-4 border-b">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-4">
                <Indicator :status="adasData.status"/>
                <h1 class="font-medium text-lg text-[#353535]">CRV ADAS</h1>
              </div>
              <div class="flex gap-1">
                <label for="batt" class="font-medium text-sm text-[#353535]/70">IMEI:</label>
                <h1 class="font-medium text-sm text-[#353535]">{{adasData.imei}}</h1>
              </div>
              <div class="flex gap-1">
                <label for="batt" class="font-medium text-sm text-[#353535]/70">Last Update:</label>
                <h1 class="font-medium text-sm text-[#353535]">{{adasData.deviceHealth.time}}</h1>
              </div>
              <div class="flex gap-1">
                <label for="batt" class="font-medium text-sm text-[#353535]/70">Elapsed Time:</label>
                <h1 class="font-medium text-sm text-[#353535]">{{adasData.deviceHealth.elapsedTime}}</h1>
              </div>
              </div>
              <div class="flex flex-col gap-4">
                <div class="flex items-center gap-4">
                  <SignalIndicator :status="adasData.deviceHealth.gsmSignal" />
                  <BatteryIndicator :status="adasData.deviceHealth.batteryPercentage" />
                </div>
                <div class="flex items-center gap-4">
                <GPSIndicator :status="true" />
                <SatellitesNumberIndicator :status="adasData.deviceHealth.satellite" />
              </div>
            </div>
          </div>
          <h1 class="text-lg text-[#353535] mt-2">ADAS State</h1>
          <div class="grid grid-cols-2">
            <div class="flex flex-col gap-2">
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">Camera State</label>
                <h1 class="font-medium text-sm text-[#353535]">{{adasData.deviceHealth.adasState}}</h1>
              </div>
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">Error Code</label>
                <h1 class="font-medium text-sm text-[#353535]">{{adasData.adasDetail.errorCode}}</h1>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">SD Card Status</label>
                <h1 class="font-medium text-sm text-[#353535]">{{adasData.adasDetail.sdcard}}</h1>
              </div>
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">Recording Status</label>
                <h1 class="font-medium text-sm text-[#353535]">{{adasData.adasDetail.record}}</h1>
              </div>
            </div>
          </div>
          <h1 class="text-lg text-[#353535] mt-2">ADAS Event</h1>
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
              :class="{
                'yellow-chip': adasData.events.lwdLeft._value === 0,
                'green-chip': adasData.events.lwdLeft._value === 1,
                'red-chip': adasData.events.lwdLeft._value === 2
              }"
            >
              L Lane Departure
            </div>
            <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
              :class="{
                'yellow-chip': adasData.events.lwdLeft._value === 0,
                'green-chip': adasData.events.lwdLeft._value === 1,
                'red-chip': adasData.events.lwdLeft._value === 2
              }"
            >
              R Lane Departure
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
              :class="{
                'grey-chip': adasData.events.leftTurnSignal._value === 0,
                'green-chip': adasData.events.leftTurnSignal._value === 1
              }"
            >
              Left Turn Signal
            </div>
            <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
              :class="{
                'grey-chip': adasData.events.rightTurnSignal._value === 0,
                'green-chip': adasData.events.rightTurnSignal._value === 1
              }"
            >
              Right Turn Signal
            </div>
          </div>
          <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
              :class="{
                'grey-chip': adasData.events.brakeSignal._value === 0,
                'green-chip': adasData.events.brakeSignal._value === 1
              }"
            >
            Brake Signal
          </div>
          <div class="grid grid-cols-5 gap-2 mb-4">
            <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
              :class="{
                'yellow-chip': adasData.events.sda._value === 0,
                'green-chip': adasData.events.sda._value === 1,
                'red-chip': adasData.events.sda._value === 2
              }"
            >
              SDA
            </div>
            <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
              :class="{
                'yellow-chip': adasData.events.fvsa._value === 0,
                'green-chip': adasData.events.fvsa._value === 1,
                'red-chip': adasData.events.fvsa._value === 2
              }"
            >
              FVSA
            </div>
            <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
              :class="{
                'yellow-chip': adasData.events.fpw._value === 0,
                'green-chip': adasData.events.fpw._value === 1,
                'red-chip': adasData.events.fpw._value === 2
              }"
            >
              FPW
            </div>
            <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
              :class="{
                'yellow-chip': adasData.events.fcw._value === 0,
                'green-chip': adasData.events.fcw._value === 1,
                'red-chip': adasData.events.fcw._value === 2
              }"
            >
              FCW
            </div>
            <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
              :class="{
                'yellow-chip': adasData.events.pcw._value === 0,
                'green-chip': adasData.events.pcw._value === 1,
                'red-chip': adasData.events.pcw._value === 2
              }"
            >
              PCW
            </div>
          </div>
          <div class="grid grid-cols-3">
            <div class="flex flex-col gap-1">
              <label for="batt" class="text-sm text-[#353535]/60">Speed</label>
              <h1 class="font-medium text-sm text-[#353535]">{{adasData.events.speed._value}} km/h</h1>
            </div>
            <div class="flex flex-col gap-1">
              <label for="batt" class="text-sm text-[#353535]/60">RPM</label>
              <h1 class="font-medium text-sm text-[#353535]">{{adasData.events.rpm._value}}</h1>
            </div>
          </div>
          <div class="grid grid-cols-3">
            <div class="flex flex-col gap-1">
              <label for="batt" class="text-sm text-[#353535]/60">Time Till Collision</label>
              <h1 class="font-medium text-sm text-[#353535]">{{adasData.events.timeTillCollision._value}} second</h1>
            </div>
            <div class="flex flex-col gap-1">
              <label for="batt" class="text-sm text-[#353535]/60">Ahead Distance</label>
              <h1 class="font-medium text-sm text-[#353535]">{{adasData.events.aheadDistance._value}} </h1>
            </div>
            <div class="flex flex-col gap-1">
              <label for="batt" class="text-sm text-[#353535]/60">Ahead Speed</label>
              <h1 class="font-medium text-sm text-[#353535]">{{adasData.events.aheadSpeed._value}}</h1>
            </div>
          </div>
          <div class="grid grid-cols-3">
            <div class="flex flex-col gap-1">
              <label for="batt" class="text-sm text-[#353535]/60">Distance Left</label>
              <h1 class="font-medium text-sm text-[#353535]">{{adasData.events.distanceLeft._value}}</h1>
            </div>
            <div class="flex flex-col gap-1">
              <label for="batt" class="text-sm text-[#353535]/60">Distance Right</label>
              <h1 class="font-medium text-sm text-[#353535]">{{adasData.events.distanceRight._value}}</h1>
            </div>
          </div>
          <div class="grid grid-cols-3">
            <div class="flex flex-col gap-1">
              <label for="batt" class="text-sm text-[#353535]/60">SLR State</label>
              <h1 class="font-medium text-sm text-[#353535]">{{adasData.events.slrState._value}}</h1>
            </div>
            <div class="flex flex-col gap-1">
              <label for="batt" class="text-sm text-[#353535]/60">SLR Recognize</label>
              <h1 class="font-medium text-sm text-[#353535]">{{adasData.events.slrRecognize._value}}</h1>
            </div>
            <div class="flex flex-col gap-1">
              <label for="batt" class="text-sm text-[#353535]/60">SLR Sensitivity</label>
              <h1 class="font-medium text-sm text-[#353535]">{{adasData.events.slrSensitivity._value}}</h1>
            </div>
          </div>
        </div>
        <div v-if="!loading" class="card">
          <div class="flex justify-between pb-4 border-b">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-4">
                <Indicator :status="dsmData.status"/>
                <h1 class="font-medium text-lg text-[#353535]">CRV DSM</h1>
              </div>
              <div class="flex gap-1">
                <label for="batt" class="font-medium text-sm text-[#353535]/70">IMEI:</label>
                <h1 class="font-medium text-sm text-[#353535]">{{dsmData.imei}}</h1>
              </div>
              <div class="flex gap-1">
                <label for="batt" class="font-medium text-sm text-[#353535]/70">Last Update:</label>
                <h1 class="font-medium text-sm text-[#353535]">{{dsmData.deviceHealth.time}}</h1>
              </div>
              <div class="flex gap-1">
                <label for="batt" class="font-medium text-sm text-[#353535]/70">Elapsed Time:</label>
                <h1 class="font-medium text-sm text-[#353535]">{{dsmData.deviceHealth.elapsedTime}}</h1>
              </div>
              </div>
              <div class="flex flex-col gap-4">
                <div class="flex items-center gap-4">
                  <SignalIndicator :status="dsmData.deviceHealth.gsmSignal" />
                  <BatteryIndicator :status="dsmData.deviceHealth.batteryPercentage" />
                </div>
                <div class="flex items-center gap-4">
                <GPSIndicator :status="true" />
                <SatellitesNumberIndicator :status="dsmData.deviceHealth.satellite" />
              </div>
            </div>
          </div>
          <h1 class="text-lg text-[#353535] mt-2">DSM State</h1>
          <div class="grid grid-cols-2">
            <div class="flex flex-col gap-2">
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">State</label>
                <h1 class="font-medium text-sm text-[#353535]">{{dsmData.deviceHealth.dsmState}}</h1>
              </div>
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">Error Code</label>
                <h1 class="font-medium text-sm text-[#353535]">{{dsmData.dsmDetail.errorCode}}</h1>
              </div>
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">GPS Status</label>
                <h1 class="font-medium text-sm text-[#353535]">{{dsmData.dsmDetail.gpsStatus}}</h1>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">Recording Status</label>
                <h1 class="font-medium text-sm text-[#353535]">{{dsmData.dsmDetail.recordingStatus}}</h1>
              </div>
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">Active Driver Name</label>
                <h1 class="font-medium text-sm text-[#353535]">{{dsmData.dsmDetail.operator}}</h1>
              </div>
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">Speed</label>
                <h1 class="font-medium text-sm text-[#353535]">{{dsmData.dsmDetail.speed}}</h1>
              </div>
            </div>
          </div>
          <h1 class="text-lg text-[#353535] mt-2">DSM Violation</h1>
          <div class="grid grid-cols-1 gap-4">
            <div class="grid grid-cols-2 gap-4 items-center">
              <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
                  :class="{
                    'grey-chip': dsmData.events.drowsiness._value === 0,
                    'red-chip': dsmData.events.drowsiness._value === 1
                  }"
                >
                Drowsiness
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Last Update:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.drowsiness.time}}</h1>
                </div>
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Elapsed Time:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.drowsiness.elapsedTime}}</h1>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 items-center">
              <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
                :class="{
                  'grey-chip': dsmData.events.distraction._value === 0,
                  'red-chip': dsmData.events.distraction._value === 1
                }"
              >
                Disctraction
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Last Update:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.distraction.time}}</h1>
                </div>
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Elapsed Time:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.distraction.elapsedTime}}</h1>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 items-center">
              <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
                :class="{
                  'grey-chip': dsmData.events.yawning._value === 0,
                  'red-chip': dsmData.events.yawning._value === 1
                }"
              >
                Yawning
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Last Update:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.yawning.time}}</h1>
                </div>
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Elapsed Time:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.yawning.elapsedTime}}</h1>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 items-center">
              <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
                :class="{
                  'grey-chip': dsmData.events.phone._value === 0,
                  'red-chip': dsmData.events.phone._value === 1
                }"
              >
                Phone
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Last Update:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.phone.time}}</h1>
                </div>
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Elapsed Time:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.phone.elapsedTime}}</h1>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 items-center">
              <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
                :class="{
                  'grey-chip': dsmData.events.smoking._value === 0,
                  'red-chip': dsmData.events.smoking._value === 1
                }"
              >
                Smoking
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Last Update:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.smoking.time}}</h1>
                </div>
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Elapsed Time:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.smoking.elapsedTime}}</h1>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 items-center">
              <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
                :class="{
                  'grey-chip': dsmData.events.driverAbsence._value === 0,
                  'red-chip': dsmData.events.driverAbsence._value === 1
                }"
              >
                Driver Absence
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Last Update:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.driverAbsence.time}}</h1>
                </div>
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Elapsed Time:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.driverAbsence.elapsedTime}}</h1>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 items-center">
              <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
                :class="{
                  'grey-chip': dsmData.events.mask._value === 0,
                  'red-chip': dsmData.events.mask._value === 1
                }"
              >
                Mask
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Last Update:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.mask.time}}</h1>
                </div>
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Elapsed Time:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.mask.elapsedTime}}</h1>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 items-center">
              <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
                :class="{
                  'grey-chip': dsmData.events.seatbelt._value === 0,
                  'red-chip': dsmData.events.seatbelt._value === 1
                }"
              >
                Seatbelt
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Last Update:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.seatbelt.time}}</h1>
                </div>
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Elapsed Time:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.seatbelt.elapsedTime}}</h1>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 items-center">
              <div class="rounded-full p-2 text-center text-sm text-white font-medium h-fit" 
                :class="{
                  'grey-chip': dsmData.events.gsensor._value === 0,
                  'red-chip': dsmData.events.gsensor._value === 1
                }"
              >
                G-Sensor
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Last Update:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.gsensor.time}}</h1>
                </div>
                <div class="flex gap-1">
                  <label for="batt" class="font-medium text-sm text-[#353535]/70">Elapsed Time:</label>
                  <h1 class="font-medium text-sm text-[#353535]">{{dsmData.events.gsensor.elapsedTime}}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>  
  </div>    
</template>

<script setup>
import lazyCard from '@/components/loading/lazyCard.vue';
import sideNav from '@/components/navigation/sideNav.vue'
import { onBeforeMount, ref, onUnmounted } from 'vue';
import router from '@/router'
//indicators
import Indicator from '@/components/Indicator.vue'
import SignalIndicator from '@/components/SignalIndicator.vue';
import GPSIndicator from '@/components/GPSIndicator.vue';
import BatteryIndicator from '@/components/BatteryIndicator.vue';
import SatellitesNumberIndicator from '@/components/SatellitesNumberIndicator.vue';

//stores
import { useRealtimeDevicesStore } from '@/stores/realtime/realtimeDevicesStore'
import { storeToRefs } from 'pinia'

const realtimeDevicesStore = useRealtimeDevicesStore()
const { adasData, dsmData, getRealtimeDataIsLoading } = storeToRefs(useRealtimeDevicesStore())

const delay = require('delay')
const whileState = ref(true)
const loading = ref(true)

onBeforeMount( async () => {
  await realtimeDevicesStore.getRealtimeDevices()
  loading.value = false
  while (whileState.value) {
    await realtimeDevicesStore.getRealtimeDevices()
    await delay(10000)
  }
})

onUnmounted(() => {
  whileState.value = false
})


///DUMMIES
let cardList = 6

</script>

<style scoped>



.content {
@apply w-full h-full relative ml-[47px] pt-[50px]
}
.device-container {
@apply 
  flex flex-col gap-4 p-[32px]
}
.title {
@apply
  text-[24px] flex justify-start items-center text-black opacity-80
}
.card-wrapper {
@apply
  grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 
}
.card {
box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);
@apply 
  rounded-md bg-white cursor-pointer
  flex flex-col p-6 text-left border gap-2
}
.card:hover {
box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
}

.red-chip {
  @apply bg-[#C21629]
}
.grey-chip {
  @apply bg-[#CCD1D5]
}
.green-chip {
  @apply bg-[#34C759]
}

.yellow-chip {
  @apply bg-[#FFC700]
}

</style>