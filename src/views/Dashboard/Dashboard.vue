<template>
  <sideNav :isDashboardActive="true" />
  <div class="content">
    <div class="device-container">
      <!-- <div class="datepicker-wrapper">
        <p>Date Range from</p>
        <div class="border border-[#D9D9D9] py-[7px] px-[9px] rounded">
          <input type="date" name="start_date" id="start_date">
        </div>
        <p>to</p>
        <div class="border border-[#D9D9D9] py-[7px] px-[9px] rounded">
          <input type="date" name="end_date" id="end_date">
        </div>
      </div> -->
      <div class="status-card-wrapper">
        <div class="status-card">
          <h1 class="self-end text-[58px] font-normal">{{ dashboardData.online }}</h1>
          <p class="self-start text-[18px] font-bold">Online Devices</p>
        </div>
        <div class="status-card">
          <h1 class="self-end text-[58px] font-normal">{{ dashboardData.offline }}</h1>
          <p class="self-start text-[18px] font-bold">Offline Devices</p>
        </div>
        <div class="status-card">
          <h1 class="self-end text-[58px] font-normal">{{ dashboardData.totalContractor }}</h1>
          <p class="self-start text-[18px] font-bold">Contractor</p>
        </div>
        <div class="status-card">
          <h1 class="self-end text-[58px] font-normal">{{ dashboardData.violation }}</h1>
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
              <div class="chart-card flex flex-col">
                <div class="flex justify-between">
                  <div class="flex flex-col gap-4 w-full mb-4">
                    <p class="text-md font-semibold">Top Contractor by Violations</p>
                    <select name="contractorFilter" id="contractorFilter"
                      class="outline-none text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit"
                      v-model="selectedViolation" @change="loadTopContractor()">
                      <option class="p-2 cursor-pointer" value="0">All Violations</option>
                      <option class="p-2 cursor-pointer" v-for="violation in violationFilterList" :value="violation.code">
                        {{ violation.name }}</option>
                    </select>
                  </div>
                </div>
                <canvas ref="topContractorChartCanvas"></canvas>
              </div>
            </div>
            <div class="flex flex-col text-start gap-[14px]">
              <div class="chart-card flex flex-col">
                <div class="flex justify-between">
                  <div class="flex flex-col gap-4 w-full mb-4">
                    <p class="text-md font-semibold">Top Violation by Contractors</p>
                    <select name="contractorFilter" id="contractorFilter"
                      class="outline-none text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit"
                      v-model="selectedContractor" @change="loadTopViolation()">
                      <option class="p-2 cursor-pointer" value="0">All Contractors</option>
                      <option class="p-2 cursor-pointer" v-for="contractor in contractors" :value="contractor.name">
                        {{ contractor.name }}</option>
                    </select>
                  </div>
                </div>
                <canvas ref="topViolationChartCanvas"></canvas>
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
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, PointElement, LineElement, LinearScale } from 'chart.js';
Chart.register(BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, PointElement, LineElement, LinearScale)
import { shallowRef } from 'vue'
const topContractorChartCanvas = ref(null)
let topContractorChart
const topViolationChartCanvas = ref(null)
let topViolationChart

const violationChart = ref(null)

function renderTopContractorChart() {
  if (!topContractorIsEmpty.value) {
    let topContractorChartData = {
      labels: topContractor.value.chartData.contractor,
      datasets: [
        {
          type: 'bar',
          label: 'Contractor',
          data: topContractor.value.chartData.count,
          backgroundColor: createGradient('rgba(147, 199, 106, 0.28)', 'rgba(147, 199, 106, 1)'),
          borderRadius: 10,
        },
      ],
    }

    const topContractorChartCtx = topContractorChartCanvas.value.getContext('2d')
    topContractorChart = shallowRef(new Chart(topContractorChartCtx, {
      type: 'bar',
      data: topContractorChartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }))
  }
}


function renderTopViolationChart() {
  if (!topViolationIsEmpty.value) {
    let topViolationChartData = {
      labels: topViolation.value.chartData.violation,
      datasets: [
        {
          type: 'bar',
          label: 'Violation',
          data: topViolation.value.chartData.count,
          backgroundColor: createGradient('rgba(11, 19, 84, 0.28)', 'rgba(11, 19, 84, 1)'),
          borderRadius: 10,
        },
      ],
    }

    const topViolationChartCtx = topViolationChartCanvas.value.getContext('2d')
    topViolationChart = shallowRef(new Chart(topViolationChartCtx, {
      type: 'bar',
      data: topViolationChartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }))
  }
}

function renderNoDataMessage(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#888';
  ctx.font = '18px Arial';
  ctx.fillText('No data available', ctx.canvas.width / 2, ctx.canvas.height / 2);
}

function addData(chart, label, newData) {
  chart.data.labels = []
  chart.data.labels = label;
  chart.data.datasets.forEach((dataset) => {
    dataset.data = []
  });
  chart.data.datasets.forEach((dataset) => {
    newData.forEach((data) => {
      dataset.data.push(data)
    })
  });
  console.log(chart.data.datasets)
  chart.update();
}

function updateTopContractor() {
  addData(topContractorChart.value, topContractor.value.chartData.contractor, topContractor.value.chartData.count)
}
function updateTopViolation() {
  addData(topViolationChart.value, topViolation.value.chartData.violation, topViolation.value.chartData.count)
}


import lazyCard from '@/components/loading/lazyCard.vue'
import Indicator from '@/components/Indicator.vue'
import sideNav from '@/components/navigation/sideNav.vue'
import { onBeforeMount, ref, onUnmounted, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRealtimeDevicesStore } from '@/stores/realtime/realtimeDevicesStore'
import { useReportStore } from '@/stores/report/reportStore';
import { useContractorsStore } from '@/stores/master-data/contractorsStore';

const contractorStore = useContractorsStore()
const { contractors } = storeToRefs(useContractorsStore())
const realtimeDevicesStore = useRealtimeDevicesStore()
const { dashboardData } = storeToRefs(useRealtimeDevicesStore())
const reportStore = useReportStore()
const { topContractor, topContractorIsEmpty, topViolation, topViolationIsEmpty } = storeToRefs(useReportStore())
const violationFilterList = [
  { code: "drowsiness", name: "Drowsiness" },
  { code: "distraction", name: "Distraction" },
  { code: "yawning", name: "Yawning" },
  { code: "phone", name: "Phone" },
  { code: "smoking", name: "Smoking" },
  { code: "seatbelt", name: "Seatbelt" },
  { code: "fatigueDrivingAlarmLevelOneStart", name: "Fatigue Driving Alarm Level One Start" },
  { code: "fatigueDrivingAlarmLevelTwoStart", name: "Fatigue Driving Alarm Level Two Start" },
  { code: "facialFatigueStart", name: "Facial Fatigue Start" },
  { code: "fatigueDrivingAlarmStart", name: "Fatigue Driving Alarm Start" },
  { code: "distractedDrivingAlarmLevelOneStart", name: "Distracted Driving Alarm Level One Start" },
  { code: "distractedDrivingAlarmLevelTwoStart", name: "Distracted Driving Alarm Level Two Start" },
  { code: "smokingAlarmLevelOneStart", name: "Smoking Alarm Level One Start" },
  { code: "smokingAlarmLevelTwoStart", name: "Smoking Alarm Level Two Start" },
  { code: "smokingWarningStart", name: "Smoking Warning Start" },
  { code: "callToCallTheAlarmLevelOneStart", name: "Call To Call The Alarm Level One Start" },
  { code: "callToCallTheAlarmLevelTwoStart", name: "Call To Call The Alarm Level Two Start" },
  { code: "driverAbnormalAlarmLevelOneStart", name: "Driver Abnormal Alarm Level One Start" },
  { code: "driverAbnormalAlarmLevelTwoStart", name: "Driver Abnormal Alarm Level Two Start" },
  { code: "noSeatBeltsStart", name: "No Seat Belts Start" },
  { code: "unfastenedSeatBeltLevelOneStart", name: "Unfastened Seat Belt Level One Start" },
  { code: "unfastenedSeatBeltLevelTwoStart", name: "Unfastened Seat Belt Level Two Start" },
];
const loading = ref(false)
const selectedViolation = ref('0')
const selectedContractor = ref('0')

const delay = require('delay')
const whileState = ref(true)

onMounted(async () => {
  loading.value = true
  await realtimeDevicesStore.getRealtimeDashboard()
  await reportStore.getTopContractor()
  renderTopContractorChart()
  await contractorStore.getContractors()
  await reportStore.getTopViolation()
  renderTopViolationChart()
  loading.value = false
  while (whileState.value) {
    await realtimeDevicesStore.getRealtimeDashboard()
    await delay(10000)
  }
  // this.renderChart(this.chartData, this.chartOptions)
})

onUnmounted(() => {
  whileState.value = false
})



async function loadTopContractor() {
  const queryParams = ref({})
  if (selectedViolation.value !== '0') {
    queryParams.value.violation = selectedViolation.value
  }
  await reportStore.getTopContractor(queryParams.value)
  updateTopContractor()
}

async function loadTopViolation() {
  const queryParams = ref({})
  if (selectedContractor.value !== '0') {
    queryParams.value.contractor = selectedContractor.value
  }
  await reportStore.getTopViolation(queryParams.value)
  updateTopViolation()
}


function createGradient(gradientColor, borderColor) {
  const ctx = document.createElement('canvas').getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, gradientColor);
  gradient.addColorStop(1, borderColor);
  return gradient;
}


const violationChartData = {
  labels: ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16'],
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
  @apply flex flex-col gap-[20px] p-[24px] h-full
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
  @apply text-[24px] font-thin flex justify-start items-center text-[#353535] opacity-80
}

.card-wrapper {
  @apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5
}

.card {
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);
  @apply rounded-md bg-white cursor-pointer flex flex-col p-6 text-left border gap-2
}

.card:hover {
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
}
</style>