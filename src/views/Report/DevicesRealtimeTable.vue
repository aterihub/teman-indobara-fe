<template>
  <alert :message="status.message" :modalActive="status.isError" :isError="status.isError" @close="closeNotification" />
  <sideNav :isReportActive="true" />
  <div class="device-container">
    <h1 class="title"> Devices Health Status</h1>
    <EasyDataTable header-text-direction="center" body-text-direction="center" table-class-name="customize-table"
      :headers="header" :items="items" theme-color="#1363df">
      <template #item-status="item">
        <Indicator :status="item.status" />
      </template>
      <template #item-time="item">
        {{ item.deviceHealth.time }}
      </template>
      <template #item-elapsedTime="item">
        {{ item.deviceHealth.elapsedTime }}
      </template>
      <template #item-gsmSignal="item">
        {{ item.deviceHealth.gsmSignal }}
      </template>
      <template #item-batteryPercentage="item">
        {{ item.deviceHealth.batteryPercentage }}
      </template>
      <template #item-satellite="item">
        {{ item.deviceHealth.satellite }}
      </template>
      <template #item-coordinate="item">
        <a :href="item.deviceHealth.maps" target="_blank">{{ item.deviceHealth.latLong }}</a>
      </template>
      <template #expand="item">
        <div v-if="item.adasDetail" class="grid grid-cols-3 p-2">
          <div class="col-span-1 flex flex-col gap-1 text-left">
            <h1 class="font-medium">ADAS State</h1>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>State: </p>
              <p class="font-medium">{{ item.deviceHealth.adasState }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>Error Code: </p>
              <p class="font-medium">{{ item.adasDetail.errorCode }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>SD Card Status: </p>
              <p class="font-medium">{{ item.adasDetail.sdcard }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>Recording Status: </p>
              <p class="font-medium">{{ item.adasDetail.record }}</p>
            </div>
          </div>
          <div class="col-span-2 flex flex-col gap-1 text-left">
            <h1 class="font-medium">ADAS Events</h1>
            <div class="grid grid-cols-2 gap-6">
              <div class="flex flex-col gap-1">
                <div class="grid grid-cols-2 gap-4">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.lwdLeft._value === 0,
                    'green-chip': item.events.lwdLeft._value === 1,
                    'red-chip': item.events.lwdLeft._value === 2
                  }">
                    L Lane Departure
                  </div>
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.lwdLeft._value === 0,
                    'green-chip': item.events.lwdLeft._value === 1,
                    'red-chip': item.events.lwdLeft._value === 2
                  }">
                    R Lane Departure
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': item.events.leftTurnSignal._value === 0,
                    'green-chip': item.events.leftTurnSignal._value === 1
                  }">
                    Left Turn Signal
                  </div>
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': item.events.rightTurnSignal._value === 0,
                    'green-chip': item.events.rightTurnSignal._value === 1
                  }">
                    Right Turn Signal
                  </div>
                </div>
                <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                  'grey-chip': item.events.brakeSignal._value === 0,
                  'green-chip': item.events.brakeSignal._value === 1
                }">
                  Brake Signal
                </div>
                <div class="grid grid-cols-5 gap-2 mb-4">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.sda._value === 0,
                    'green-chip': item.events.sda._value === 1,
                    'red-chip': item.events.sda._value === 2
                  }">
                    SDA
                  </div>
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.fvsa._value === 0,
                    'green-chip': item.events.fvsa._value === 1,
                    'red-chip': item.events.fvsa._value === 2
                  }">
                    FVSA
                  </div>
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.fpw._value === 0,
                    'green-chip': item.events.fpw._value === 1,
                    'red-chip': item.events.fpw._value === 2
                  }">
                    FPW
                  </div>
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.fcw._value === 0,
                    'green-chip': item.events.fcw._value === 1,
                    'red-chip': item.events.fcw._value === 2
                  }">
                    FCW
                  </div>
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.pcw._value === 0,
                    'green-chip': item.events.pcw._value === 1,
                    'red-chip': item.events.pcw._value === 2
                  }">
                    PCW
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="grid grid-cols-3">
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">Speed</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.speed._value }} km/h</h1>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">RPM</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.rpm._value }}</h1>
                  </div>
                </div>
                <div class="grid grid-cols-3">
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">Time Till Collision</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.timeTillCollision._value }} second
                    </h1>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">Ahead Distance</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.aheadDistance._value }} </h1>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">Ahead Speed</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.aheadSpeed._value }}</h1>
                  </div>
                </div>
                <div class="grid grid-cols-3">
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">Distance Left</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.distanceLeft._value }}</h1>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">Distance Right</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.distanceRight._value }}</h1>
                  </div>
                </div>
                <div class="grid grid-cols-3">
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">SLR State</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.slrState._value }}</h1>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">SLR Recognize</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.slrRecognize._value }}</h1>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">SLR Sensitivity</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.slrSensitivity._value }}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="item.dsmDetail" class="grid grid-cols-3 p-2">
          <div class="col-span-1 flex flex-col gap-1 text-left">
            <h1 class="font-medium">DSM State</h1>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>State: </p>
              <p class="font-medium">{{ item.deviceHealth.dsmState }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>Error Code: </p>
              <p class="font-medium">{{ item.dsmDetail.errorCode }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>GPS Status: </p>
              <p class="font-medium">{{ item.dsmDetail.gpsStatus }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>Recording Status: </p>
              <p class="font-medium">{{ item.dsmDetail.recordingStatus }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>Active Driver Name: </p>
              <p class="font-medium">{{ item.dsmDetail.operator }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>Speed: </p>
              <p class="font-medium">{{ item.dsmDetail.speed }}</p>
            </div>
          </div>
          <div class="col-span-2 flex flex-col gap-1 text-left">
            <h1 class="font-medium">DSM Events</h1>
            <div class="grid grid-cols-3 gap-6 h-full">
              <div class="flex flex-col justify-between">
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': item.events.drowsiness._value === 0,
                    'red-chip': item.events.drowsiness._value === 1
                  }">
                    Drowsiness
                  </div>
                  <div class="flex flex-col col-span-2 gap-1">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ item.events.drowsiness.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ item.events.drowsiness.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.distraction._value === 0,
                    'red-chip': dsmData.events.distraction._value === 1
                  }">
                    Disctraction
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.distraction.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.distraction.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.yawning._value === 0,
                    'red-chip': dsmData.events.yawning._value === 1
                  }">
                    Yawning
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.yawning.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.yawning.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-between">
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.phone._value === 0,
                    'red-chip': dsmData.events.phone._value === 1
                  }">
                    Phone
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.phone.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.phone.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.smoking._value === 0,
                    'red-chip': dsmData.events.smoking._value === 1
                  }">
                    Smoking
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.smoking.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.smoking.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.driverAbsence._value === 0,
                    'red-chip': dsmData.events.driverAbsence._value === 1
                  }">
                    Driver Absence
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.driverAbsence.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.driverAbsence.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-between">
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.mask._value === 0,
                    'red-chip': dsmData.events.mask._value === 1
                  }">
                    Mask
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.mask.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.mask.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.seatbelt._value === 0,
                    'red-chip': dsmData.events.seatbelt._value === 1
                  }">
                    Seatbelt
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.seatbelt.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.seatbelt.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.gsensor._value === 0,
                    'red-chip': dsmData.events.gsensor._value === 1
                  }">
                    G-Sensor
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.gsensor.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.gsensor.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </EasyDataTable>
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
const { adasData, dsmData, getRealtimeDataIsLoading, status } = storeToRefs(useRealtimeDevicesStore())
const header = [
  { text: "", value: "status" },
  { text: "IMEI", value: "imei" },
  { text: "Last Update", value: "time" },
  { text: "Elapsed Time", value: "elapsedTime" },
  { text: "GSM Signal", value: "gsmSignal" },
  { text: "Battery Percentage", value: "batteryPercentage" },
  { text: "Satellites Qty.", value: "satellite" },
  { text: "Coordinate", value: "coordinate" },
]
const delay = require('delay')
const whileState = ref(true)
const loading = ref(true)

const items = ref([])
onBeforeMount(async () => {
  items.value = []
  await realtimeDevicesStore.getRealtimeDevices()
  items.value.push(adasData.value)
  items.value.push(dsmData.value)
  console.log(items.value)
  loading.value = false
  while (whileState.value) {
    await realtimeDevicesStore.getRealtimeDevices()
    items.value = []
    items.value.push(adasData.value)
    items.value.push(dsmData.value)
    await delay(10000)
  }
})

onUnmounted(() => {
  whileState.value = false
})
const closeNotification = () => {
  modalActive.value = false
}

///DUMMIES

</script>

<style scoped>
.content {
  @apply w-full h-full relative ml-[47px] pt-[50px]
}

.device-container {
  @apply flex flex-col gap-4 w-full
}

.title {
  @apply text-[24px] flex justify-start items-center text-black opacity-80
}

.card-wrapper {
  @apply grid grid-cols-1 gap-5
}

.card {
  /* box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25); */
  @apply rounded-md bg-white cursor-pointer flex flex-col p-6 text-left border gap-2
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