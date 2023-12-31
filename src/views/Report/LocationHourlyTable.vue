<template>
  <alert 
    :message ="getLocationHourlyStatus.message"
    :modalActive="modalActive"
    :isError="getLocationHourlyStatus.isError"
    @close="closeNotification" 
  />
  <div class="table-wrap">
    <div class="table-header">
      <h1 class="title">Location Hourly Report</h1>
      <div class="flex justify-between w-full">
        <div class="grid grid-cols-2 gap-4">
          <div class="text-left flex items-center gap-2 border rounded-md border-[#D9D9D9] p-2 w-fit">
            <h2 class="font-semibold text-xs">From</h2>
            <div class="flex gap-6 ">
              <input class="cursor-pointer bg-transparent text-xs" type="date" name="startDate" id="startDate" v-model="startDate">
              <input class="cursor-pointer bg-transparent text-xs" type="time" name="startTime" id="startTime" v-model="startTime">
            </div>
          </div>
          <div class="text-left flex items-center gap-2 border rounded-md border-[#D9D9D9] p-2 w-fit">
            <h2 class="font-semibold text-xs">To</h2>
            <div class="flex gap-6">
              <input class="cursor-pointer bg-transparent text-xs" type="date" name="endDate" id="endDate" v-model="endDate">
              <input class="cursor-pointer bg-transparent text-xs" type="time" name="endTime" id="endTime" v-model="endTime">
            </div>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-4">
          <select name="siteFilter" id="siteFilter" 
            class="outline-none text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit"
            v-model="selectedSite"  
            @change="getContractorsList(selectedSite)">
            <option class="p-2 cursor-pointer" value="0" >All Site</option>
            <option class="p-2 cursor-pointer" v-for="site in sites" :value="site.id" >{{site.name}}</option>
          </select>
          <select name="contractorFilter" id="contractorFilter" 
            class="outline-none text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit"
            v-model="selectedContractor" 
            @change="getVehicleList(selectedContractor)">
            <option class="p-2 cursor-pointer" value="0" >All Contractor</option>
            <option class="p-2 cursor-pointer" v-for="contractor in contractors" :value="contractor.id" >{{contractor.name}}</option>
          </select>
          <select name="hullFilter" id="hullFilter" 
            v-model="selectedHull" 
            class="outline-none text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit">
            <option class="p-2 cursor-pointer" value="0" >All Hull</option>
            <option class="p-2 cursor-pointer" v-for="vehicle in hulls" :value="vehicle.number" >{{vehicle.number}}</option>
          </select>
          <BaseButton type="button" class="filled__green h-fit" label="Filter" :loading="getLocationHourlyReportIsLoading" @click="loadViolationReport" />
        </div>
      </div>

    </div>
    <SearchField class="outlined" v-model="searchValue" placeholder="Search by IMEI, variant, device name..."/>
    <EasyDataTable
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength"
      table-class-name="customize-table"
      :headers="header"
      :items="items"
      theme-color="#1363df"        
      :search-value="searchValue"
      :loading="getLocationHourlyReportIsLoading">
      <template #item-coordinate="item">
        <a :href="item.coordinate.maps" target="_blank">{{item.coordinate.latLong}}</a>
      </template>
      <template #item-operation="item">
          <div class="operation">
            <svg class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="viewViolationFootage(item)">
              <path d="M13 7H22V9H13V7ZM13 15H22V17H13V15ZM16 11H22V13H16V11ZM13 12L8 7V11H2V13H8V17L13 12Z" fill="#353535" fill-opacity="0.6"/>
            </svg>
          </div>
        </template>
    </EasyDataTable>
    <div class="w-fit self-end py-2">
      <BaseButton v-if="locationHourlyReport.length !== 0" type="button" class="outlined__green h-fit fill-[#99CC77] hover:fill-white" label="EXPORT TO EXCEL" :loading="downloadLocationHourlyReportIsLoading" @click="downloadLocationHourlyReport" >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <path d="M8.00002 10.667L4.66669 7.33366L5.60002 6.36699L7.33335 8.10033V2.66699H8.66669V8.10033L10.4 6.36699L11.3334 7.33366L8.00002 10.667ZM4.00002 13.3337C3.63335 13.3337 3.31958 13.2032 3.05869 12.9423C2.7978 12.6814 2.66713 12.3674 2.66669 12.0003V10.0003H4.00002V12.0003H12V10.0003H13.3334V12.0003C13.3334 12.367 13.2029 12.681 12.942 12.9423C12.6811 13.2037 12.3671 13.3341 12 13.3337H4.00002Z"/>
        </svg>
      </BaseButton>
    </div>
  </div> 
</template>
  
<script setup>
import SearchField from '@/components/SearchField.vue'
import { onMounted, ref, watch } from 'vue'
import { useVehiclesStore } from '@/stores/master-data/vehiclesStore'
import { useHullsStore } from '@/stores/master-data/hullNumberStore'
import { useContractorsStore } from '@/stores/master-data/contractorsStore'
import { useSitesStore } from '@/stores/master-data/sitesStore'
import { useReportStore } from '@/stores/report/reportStore'
import BaseButton from '@/components/button/BaseButton.vue'
import { storeToRefs } from 'pinia'
import { useGeoDataStore } from '@/stores/GeoDataStore'

const searchValue = ref('')
const selectedSite = ref('0')
const selectedContractor = ref('0')
const selectedHull = ref('0')
const modalActive = ref(false)

const getDateNdaysAgo = (n) => {
  const date = new Date()
  date.setDate(date.getDate() - n)
  return date.toLocaleDateString('en-CA')
}

const startDate = ref(getDateNdaysAgo(7))
const startTime = ref(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
const endDate = ref(new Date().toLocaleDateString('en-CA'))
const endTime = ref(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))

const reportStore = useReportStore()
const { getLocationHourlyReportIsLoading, getLocationHourlyStatus, locationHourlyReport, downloadLocationHourlyReportIsLoading, locationHourlyReportMeta } = storeToRefs(useReportStore())
const sitesStore = useSitesStore()
const { sites } = storeToRefs(useSitesStore())
const contractorsStore = useContractorsStore()
const { contractors } = storeToRefs(useContractorsStore())
const vehiclesStore = useVehiclesStore()
const { vehicles } = storeToRefs(useVehiclesStore())
const hullNumberStore = useHullsStore()
const { hulls } = storeToRefs(useHullsStore())
const geoDataStore = useGeoDataStore()
const { vehicleHistoryGeo, status } = storeToRefs(useGeoDataStore())

onMounted(async() => {
  sitesStore.getSites()
  contractorsStore.getContractors()
  hullNumberStore.getHulls()
  // await vehiclesStore.getVehicles()
})

function getContractorsList(item) {
  if (item !== '0') {
    let params = {
      siteId: item
    }
    contractorsStore.getContractors(params)
  } else {
    contractorsStore.getContractors()
  }
}

const closeNotification = () => {
  modalActive.value = false
}
// function getVehicleList(item) {
//   if (item !== '0') {
//     let params = {
//       contractorId: item
//     }
//     vehiclesStore.getVehicles(params)
//   } else {
//     vehiclesStore.getVehicles()
//   }
// }

async function loadViolationReport() {
  const queryParams = {}
  if (selectedSite.value !== '0') {
    queryParams.siteId = selectedSite.value
  }
  if (selectedContractor.value !== '0') {
    queryParams.contractorId = selectedContractor.value
  }
  if (selectedHull.value !== '0') {
    queryParams.vehicle = selectedHull.value
  }
  queryParams.startTime = new Date(startDate.value + 'T' + startTime.value).toISOString()
  queryParams.endTime = new Date(endDate.value + 'T' + endTime.value).toISOString()
  queryParams.page = serverOptions.value.page
  queryParams.rowsPerPage = serverOptions.value.rowsPerPage
  queryParams.orderBy = orderBy.value

  console.log(queryParams)
  await reportStore.getLocationHourlyReport(queryParams)
  serverItemsLength.value = locationHourlyReportMeta.value.total
  items.value = locationHourlyReport.value
  console.log(serverItemsLength.value)
  modalActive.value = true
  setTimeout(closeNotification, 3000)
}

async function downloadLocationHourlyReport() {
  const queryParams = {}
  if (selectedSite.value !== '0') {
    queryParams.siteId = selectedSite.value
  }
  if (selectedContractor.value !== '0') {
    queryParams.contractorId = selectedContractor.value
  }
  if (selectedHull.value !== '0') {
    queryParams.vehicle = selectedHull.value
  }
  queryParams.startTime = new Date(startDate.value + 'T' + startTime.value).toISOString()
  queryParams.endTime = new Date(endDate.value + 'T' + endTime.value).toISOString()
  console.log(queryParams)
  await reportStore.downloadLocationHourlyReport(queryParams)
  modalActive.value = true
  setTimeout(closeNotification, 3000)
}

const header = [
  { text: "Time", value: "deviceTime" },
  { text: "IMEI", value: "imei" },
  { text: "Hull Number", value: "vehicle"},
  { text: "Registration Number", value: "registrationNumber"},
  { text: "Site", value: "site"},
  { text: "Contractor", value: "contractor"},
  { text: "Geofence", value: "geofence",},
  { text: "Coordinate", value: "coordinate"},
]

const items = ref([])
const serverItemsLength = ref(0)
const serverOptions = ref({
  page: 1,
  rowsPerPage: 15,
})


const orderBy = ref('time desc')

watch(serverOptions, (value) => { loadViolationReport(); }, { deep: true })


</script>
    
  <style scoped>
.content {
  @apply w-full h-full relative ml-[70px] pt-[82px] mr-[26px]
}
  .navigation {
  @apply flex w-fit
}

.title {
  @apply
    text-[24px] font-medium flex justify-start items-center text-[#353535]
}
.table-wrap {
  @apply
    overflow-auto sm:overflow-visible w-full flex flex-col
}
.table-header {
  @apply
  flex flex-col w-full mb-4 gap-6
}
/* .search-wrapper {
  @apply
    w-[280px] h-[40px]
} */
.operation {
  @apply flex gap-4
}

.customize-table {
  --easy-table-border:	1px solid #EBEBED;	
  --easy-table-header-font-size: 14px;
  --easy-table-header-background-color: transparent;
  --easy-table-header-font-color:	#6E6E78;
  --easy-table-header-height:	40px;

  --easy-table-body-row-font-size:	14px;
  --easy-table-body-font-color:	#3A3A3E;
  --easy-table-body-row-height:	46px;

  --easy-table-footer-font-size:	12px;
  --easy-table-footer-height:	40px;
  --easy-table-footer-font-color:	#6E6E78;
  border-collapse: collapse;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
  
    </style>