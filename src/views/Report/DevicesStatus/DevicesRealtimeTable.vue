<template>
  <alert :message="status.message" :modalActive="status.isError" :isError="status.isError" @close="closeNotification" />
  <sideNav :isReportActive="true" />
  <div class="device-container">
    <h1 class="title">Realtime Devices Health Status</h1>
    <div class="flex gap-4 items-center mb-4">
      <p class="font-medium">Device Type</p>
      <select name="siteFilter" id="siteFilter"
        class="outline-none text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit w-fit"
        v-model="selectedDeviceType" @change="loadRealtimeDevice()">
        <option class="p-2 cursor-pointer" value="ADAS">ADAS</option>
        <option class="p-2 cursor-pointer" value="DSM">DSM</option>
        <option class="p-2 cursor-pointer" value="MDVR">MDVR</option>
      </select>
    </div>
    <SearchField class="outlined" v-model="searchValue" placeholder="Search..." />
    <EasyDataTable header-text-direction="center" body-text-direction="center" table-class-name="customize-table"
      :headers="header" :items="devicesData" theme-color="#1363df" :loading="loading">
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
      <template #item-operation="item">
        <div class="operation">
          <svg class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg" @click="deviceHistoryDetail(item)">
            <path d="M13 7H22V9H13V7ZM13 15H22V17H13V15ZM16 11H22V13H16V11ZM13 12L8 7V11H2V13H8V17L13 12Z" fill="#353535"
              fill-opacity="0.6" />
          </svg>
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>

<script setup>
import sideNav from '@/components/navigation/sideNav.vue'
import { onBeforeMount, ref, onUnmounted, watch } from 'vue';
import SearchField from '@/components/SearchField.vue';
//indicators
import Indicator from '@/components/Indicator.vue'
import SignalIndicator from '@/components/SignalIndicator.vue';
import GPSIndicator from '@/components/GPSIndicator.vue';
import BatteryIndicator from '@/components/BatteryIndicator.vue';
import SatellitesNumberIndicator from '@/components/SatellitesNumberIndicator.vue';

//stores
import { useRealtimeDevicesStore } from '@/stores/realtime/realtimeDevicesStore'
import { storeToRefs } from 'pinia'
import { useLocalStorage } from '@vueuse/core';

const realtimeDevicesStore = useRealtimeDevicesStore()
const { devicesData, dsmData, getRealtimeDataIsLoading, status } = storeToRefs(useRealtimeDevicesStore())

let header = []
const delay = require('delay')
const whileState = ref(true)
const loading = ref(true)
const selectedDeviceType = useLocalStorage('selectedDeviceType','ADAS')

onBeforeMount(async () => {
  setFlexibleHeader()
  await realtimeDevicesStore.getRealtimeDevicesByType(selectedDeviceType.value)
  loading.value = false
  while (whileState.value) {
    await realtimeDevicesStore.getRealtimeDevicesByType(selectedDeviceType.value)
    await delay(10000)
  }
})

async function loadRealtimeDevice() {
  setFlexibleHeader()
  console.log(header)
  loading.value = true
  await realtimeDevicesStore.getRealtimeDevicesByType(selectedDeviceType.value)
  loading.value = false
}

onUnmounted(() => {
  whileState.value = false
})
const closeNotification = () => {
  modalActive.value = false
}

const emits = defineEmits(['deviceHistory'])

function deviceHistoryDetail(item) {
  item.type = selectedDeviceType.value
  emits('deviceHistory', item)
}

function setFlexibleHeader() {
  header = []
  if (selectedDeviceType.value === 'MDVR') {
    header.push(
    { text: "", value: "status" },
    { text: "IMEI", value: "imei" },
    { text: "Last Update", value: "time" },
    { text: "Elapsed Time", value: "elapsedTime" },
    { text: "Satellites Qty.", value: "satellite" },
    { text: "Coordinate", value: "coordinate" },
    { text: "", value: "operation", width: 100 },
    )
  } else {
    header.push(
    { text: "", value: "status" },
    { text: "IMEI", value: "imei" },
    { text: "Last Update", value: "time" },
    { text: "Elapsed Time", value: "elapsedTime" },
    { text: "GSM Signal", value: "gsmSignal" },
    { text: "Battery Percentage", value: "batteryPercentage" },
    { text: "Satellites Qty.", value: "satellite" },
    { text: "Coordinate", value: "coordinate" },
    { text: "", value: "operation", width: 100 },
    )
  }
}

</script>

<style scoped>
.content {
  @apply w-full h-full relative ml-[47px] pt-[50px]
}

.device-container {
  @apply flex flex-col w-full
}

.title {
  @apply text-[24px] flex justify-start items-center text-black opacity-80 mb-6
}

.customize-table {
  --easy-table-border: 1px solid #EBEBED;
  --easy-table-header-font-size: 14px;
  --easy-table-header-background-color: transparent;
  --easy-table-header-font-color: #6E6E78;
  --easy-table-header-height: 40px;

  --easy-table-body-row-font-size: 14px;
  --easy-table-body-font-color: #3A3A3E;
  --easy-table-body-row-height: 46px;

  --easy-table-footer-font-size: 12px;
  --easy-table-footer-height: 40px;
  --easy-table-footer-font-color: #6E6E78;
  border-collapse: collapse;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow-y: auto;
  height: auto;

}
</style>