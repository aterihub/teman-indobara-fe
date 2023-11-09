<template>

  <sideNav :isDashboardActive="true" />
  <div class="content">
    <div class="device-container">
      <div class="datepicker-wrapper">
        <p>Date Range from</p>
        <div class="border border-[#D9D9D9] py-[7px] px-[9px] rounded">
          <input type="date" name="start_date" id="start_date">
        </div>
        <p>to</p>
        <div class="border border-[#D9D9D9] py-[7px] px-[9px] rounded">
          <input type="date" name="end_date" id="end_date">
        </div>
      </div>
      <div class="status-card-wrapper">
        <div class="status-card">
          <h1 class="self-end text-[58px] font-normal">721</h1>
          <p class="self-start text-[18px] font-bold">Vehicle on the Road</p>
        </div>
        <div class="status-card">
          <h1 class="self-end text-[58px] font-normal">217</h1>
          <p class="self-start text-[18px] font-bold">Vehicle on the Pool</p>
        </div>
        <div class="status-card">
          <h1 class="self-end text-[58px] font-normal">36</h1>
          <p class="self-start text-[18px] font-bold">Contractor</p>
        </div>
        <div class="status-card">
          <h1 class="self-end text-[58px] font-normal">1.213</h1>
          <p class="self-start text-[18px] font-bold">Violation</p>
        </div>
      </div>
      <!-- <div class="card-wrapper">
        <lazyCard v-if="loading" v-for="card in 4" />
        <div v-for="device in mergedList" :key="device.id" class="card" @click="router.push({ name: 'Dashboard Details', params: { id: device.IMEINumber }})">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <Indicator :status="device.indicator"/>
              <h1 class="font-medium text-lg text-[#353535]">{{device.deviceName}}</h1>
            </div>
            <SignalIndicator :status="device.GSMSignal" />
          </div>
          <div class="flex gap-2">
            <label for="batt" class="text-sm text-[#353535]/60">IMEI:</label>
            <h1 class="text-sm text-[#353535]">{{device.IMEINumber}}</h1>
          </div>
          <div class="mt-4 flex flex-col gap-2">
            <div class="grid grid-cols-2">
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">Battery Voltage</label>
                <h1 class="text-sm text-[#353535]">{{device.batteryVoltage}} mV</h1>
              </div>
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">Battery Current</label>
                <h1 class="text-sm text-[#353535]">{{device.batteryCurrent}} mA</h1>
              </div>
            </div>
            <div class="grid grid-cols-2">
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">External Voltage</label>
                <h1 class="text-sm text-[#353535]">{{device.externalVoltage}} mV</h1>
              </div>
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">Satellites Number</label>
                <h1 class="text-sm text-[#353535]">{{device.satellites}}</h1>
              </div>
            </div>
            <div class="grid grid-cols-2">
              <div class="flex flex-col gap-1">
                <label for="batt" class="text-sm text-[#353535]/60">GNSS Status</label>
                <h1 class="text-sm text-[#353535]">{{device.GNSSStatus}}</h1>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <div class="grid grid-cols-4 gap-[21px] h-52">
        <div class="flex flex-col col-span-3 gap-[21px] pb-10">
          <div class="grid grid-cols-2 gap-[21px]">
            <div class="flex flex-col text-start gap-[14px]">
              <h1 class="text-lg font-bold text-[#00000]">Truck on Duty Graph</h1>
              <div class="chart-card flex flex-col">
                <div class="flex justify-between">
                  <div class="flex flex-col text-start gap-1">
                    <p class="text-md font-semibold">Total Unit All Contractor</p>
                    <p class="text-2xl font-medium text-[#93C76A]">1.709</p>
                    <p class="text-sm font-light">2023/September/08</p>
                  </div>
                </div>
                <canvas ref="truckOnDutyChart"></canvas>
              </div>
            </div>
            <div class="flex flex-col text-start gap-[14px]">
              <h1 class="text-lg font-bold text-[#00000]">Truck on Pool Graph</h1>
              <div class="chart-card flex flex-col">
                <div class="flex justify-between">
                  <div class="flex flex-col text-start gap-1">
                    <p class="text-md font-semibold">Total Unit All Contractor</p>
                    <p class="text-2xl font-medium text-[#5863BB]">1.709</p>
                    <p class="text-sm font-light">2023/September/08</p>
                  </div>
                </div>
                <canvas ref="truckOnPoolChart"></canvas>
              </div>
            </div>
          </div>
          <div class="flex flex-col text-start gap-[14px]">
            <h1 class="text-lg font-bold text-[#00000]">Violation Graph</h1>
            <div class="chart-card flex flex-col">
              <div class="flex justify-between">
                <div class="flex flex-col text-start gap-1">
                  <p class="text-md font-semibold">Total Violation</p>
                  <p class="text-2xl font-medium text-[#C21629]">4.610</p>
                  <p class="text-sm font-light">2023/September/08</p>
                </div>
              </div>
              <canvas ref="violationChart" style="max-height: 300px;"></canvas>
            </div>
          </div>
        </div>
        <div class="flex flex-col text-start gap-[14px]">
          <h1 class="text-lg font-bold text-[#00000]">Latest Notification</h1>
          <div class="violation-card flex flex-col" v-for="item in 10">
            <div class="h-7 bg-[#C21629] p-6 flex justify-between items-center text-white text-sm font-semibold">
              <p>Overspeed</p>
              <p>2023 / 09 / 10 22:54:18</p>
            </div>
            <div class="grid grid-cols-3 justify-between items-center p-6">
              <div class="flex flex-col gap-3 col-span-2">
                <p class="text-sm font-normal">Speed 55 Kmph</p>
                <p class="text-sm font-bold text-[#C21629]">Limit 50 Kmph</p>
              </div>
              <div class="border border-[#D9D9D9] rounded h-full items-center justify-center flex col-span-1">
                <p class="text-md">KM 4</p>
              </div>
            </div>
            <div class="h-7 border-t p-6 flex justify-between items-center text-sm font-semibold">
              <p class="text-[#C21629]">GEC 9083</p>
              <p class="text-black">Kosongan</p>
            </div>
          </div>
        </div>
      </div>
    </div> 
  </div>    
</template>

<script setup>
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip,PointElement, LineElement, LinearScale} from 'chart.js';
Chart.register(BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip,PointElement, LineElement,LinearScale)

const truckOnDutyChart = ref(null)
const truckOnPoolChart = ref(null)
const violationChart = ref(null)
onMounted(() => {
  const truckOnDutyChartCtx = truckOnDutyChart.value.getContext('2d')
  const truckOnPoolChartCtx = truckOnPoolChart.value.getContext('2d')
  const violationChartCtx = violationChart.value.getContext('2d')
  new Chart(truckOnDutyChartCtx, {
    type: 'bar', 
    data: truckOnDutyChartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
  new Chart(truckOnPoolChartCtx, {
    type: 'bar', 
    data: truckOnPoolChartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
  new Chart(violationChartCtx, {
    type: 'bar', 
    data: violationChartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
})


// import { Bar } from 'vue-chartjs'
// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

import lazyCard from '@/components/loading/lazyCard.vue';
import Indicator from '@/components/Indicator.vue'
import sideNav from '@/components/navigation/sideNav.vue'
import { onBeforeMount, ref, onUnmounted, onMounted } from 'vue';
import { useDevicesStore } from '@/stores/DevicesStore'
import { useRealtimeDataStore } from '@/stores/RealtimeDataStore'
import { storeToRefs } from 'pinia'
import router from '@/router'
import SignalIndicator from '@/components/SignalIndicator.vue';
const devicesStore = useDevicesStore()
const realtimeDataStore = useRealtimeDataStore()
const { devicesList } = storeToRefs(useDevicesStore())
const { devicesStatus, devicesGeneralData } = storeToRefs(useRealtimeDataStore())
const mergedList = ref([])
const loading = ref(false)

async function getDevicesList() {
  await realtimeDataStore.getDevicesStatus()
  
  for (let index = 0; index < devicesStatus.value.length; index++) {
    await realtimeDataStore.getGeneralData(devicesStatus.value[index].imei)
    devicesStatus.value[index].batteryVoltage = devicesGeneralData.value.batteryVoltage
    devicesStatus.value[index].batteryCurrent = devicesGeneralData.value.batteryCurrent
    devicesStatus.value[index].externalVoltage = devicesGeneralData.value.externalVoltage
    devicesStatus.value[index].GSMSignal = devicesGeneralData.value.GSMSignal
    devicesStatus.value[index].satellites = devicesGeneralData.value.satellites
    devicesStatus.value[index].GNSSStatus = devicesGeneralData.value.GNSSStatus
  } 

  const defaultValue = { IPAddress: "-",imei: "-",indicator: 0,lastHandshake: "-",port: "-",status: "OFFLINE",_measurement: "-",_time: "-", batteryVoltage: "-", GSMSignal: 0,batteryCurrent: "-",externalVoltage:'-'}
  mergedList.value = devicesList.value.map(device => {
    const tcpStatusData = devicesStatus.value.find(status => status.imei === device.IMEINumber) || defaultValue
    return { ...device, ...tcpStatusData }
  })
  console.log(mergedList.value, 'Fine Data')
}

const delay = require('delay')
const whileState = ref(true)

onBeforeMount( async () => {
  loading.value = true
  await devicesStore.loadDevices()
  await getDevicesList()
  loading.value = false
  while (whileState.value) {
    await getDevicesList()
    await delay(10000)
  }
  // this.renderChart(this.chartData, this.chartOptions)
})

onUnmounted(() => {
  whileState.value = false
})
function createGradient(gradientColor, borderColor) {
  const ctx = document.createElement('canvas').getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, gradientColor);
  gradient.addColorStop(1, borderColor);
  return gradient;
}
const truckOnDutyChartData = {
  labels: ['06','07','08','09','10', '11', '12', '13', '14', '15','16'],
  datasets: [
    {
     type: 'bar',
     label: 'Active',
     data: [500, 1100, 250, 100, 1000, 800, 164, 503, 200, 400, 460],
     backgroundColor: createGradient('rgba(147, 199, 106, 0.28)', 'rgba(147, 199, 106, 1)'),
     borderRadius: 10,
    },
  ],
}
const truckOnPoolChartData = {
  labels: ['06','07','08','09','10', '11', '12', '13', '14', '15','16'],
  datasets: [
    {
     type: 'bar',
     label: 'Active',
     data: [500, 1100, 250, 100, 1000, 800, 164, 503, 200, 400, 460],
     backgroundColor: createGradient('rgba(11, 19, 84, 0.28)', 'rgba(11, 19, 84, 1)'),
     borderRadius: 10,
   }, 
  //  {
  //    type: 'line',
  //    label: 'Average',
  //    data: [600, 1200, 250, 100, 1000, 800, 164, 503, 200, 400, 460], 
  //    fill: false,
  //    borderColor: '#D9D9D9'
  //  }
  ]
}

const violationChartData = {
  labels: ['06','07','08','09','10', '11', '12', '13', '14', '15','16'],
  datasets: [
    {
     type: 'bar',
     label: 'Active',
     data: [500, 1100, 250, 100, 1000, 800, 164, 503, 200, 400, 460],
     backgroundColor: createGradient('rgba(194, 22, 41, 0.28)', 'rgba(194, 22, 41, 1)'),
     borderRadius: 10,
    },
  ],
}
</script>

<style scoped>


.content {
@apply w-full h-full relative ml-[47px] mt-[47px]
}
.device-container {
@apply 
  flex flex-col gap-[20px] p-[24px] h-full 
}

.datepicker-wrapper {
border-radius: 3.526px;
background: #FFF;
box-shadow: 0px 1.17545px 5.87724px 0px rgba(0, 0, 0, 0.10);
@apply w-full py-[14px] flex justify-center items-center gap-3
}

.status-card-wrapper {
@apply grid grid-cols-2 sm:grid-cols-4 gap-[21px]
}
.status-card {
font-family: 'Plus Jakarta Sans', sans-serif;
@apply rounded-[5px] bg-[#5863BB] text-white flex flex-col justify-between px-[12px] pb-[14px]
}

.chart-card {
border-radius: 3.526px;
background: #FFF;
box-shadow: 0px 1.17545px 5.87724px 0px rgba(0, 0, 0, 0.10);
@apply py-[18px] w-full px-[21px]
}
.violation-card {
border-radius: 5px;
background: #FFF;
box-shadow: 0px 1.17545px 5.87724px 0px rgba(0, 0, 0, 0.10);
@apply w-full overflow-hidden border border-[#D9D9D9]
}
.title {
@apply
  text-[24px] font-thin flex justify-start items-center text-[#353535] opacity-80
}
.card-wrapper {
@apply
  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 
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

</style>