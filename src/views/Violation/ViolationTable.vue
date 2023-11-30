<template>
  <EventDetailModal
    :isOpen="isEventModalPops"
    @close="eventModalToggle()"
    title="Event Details"
    :queryParams="eventParams"
    :imei="imei"
  />
  <alert 
    :message ="violationStatus.message"
    :modalActive="modalActive"
    :isError="violationStatus.isError"
    @close="closeNotification" 
  />
  <sideNav :is-violation-active="true" />
  <div class="table-wrap">
    <div class="table-header">
      <h1 class="title">Violation Table</h1>
      <div class="flex">
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
          <select name="contractorFilter" id="contractorFilter" 
            class="outline-none text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit"
            v-model="selectedSite"  
            @change="getContractorsList(selectedSite)">
            <option class="p-2 cursor-pointer" value="0" >All Site</option>
            <option class="p-2 cursor-pointer" v-for="site in sites" :value="site.id" >{{site.name}}</option>
          </select>
          <select name="contractorFilter" id="contractorFilter" 
            class="outline-none text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit"
            v-model="selectedContractor" >
            <option class="p-2 cursor-pointer" value="0" >All Contractor</option>
            <option class="p-2 cursor-pointer" v-for="contractor in contractors" :value="contractor.id" >{{contractor.name}}</option>
          </select>
          <select name="contractorFilter" id="contractorFilter" 
            v-model="selectedHull" 
            class="outline-none text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit">
            <option class="p-2 cursor-pointer" value="0" >All Hull</option>
            <option class="p-2 cursor-pointer" v-for="vehicle in hulls" :value="vehicle.number" >{{vehicle.number}}</option>
          </select>
          <BaseButton type="button" class="filled__green h-fit" label="Filter" :loading="getViolationReportIsLoading" @click="loadViolationReport" />
        </div>
      </div>

    </div>
    <SearchField class="outlined" v-model="searchValue" placeholder="Search by IMEI, variant, device name..."/>
    <EasyDataTable
      :rows-per-page="10"
      table-class-name="customize-table"
      :headers="header"
      :items="violationsReport"
      theme-color="#1363df"        
      :search-value="searchValue"
      :loading="getViolationReportIsLoading">
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
  </div> 
</template>
  
<script setup>
import sideNav from '@/components/navigation/sideNav.vue'
import SearchField from '@/components/SearchField.vue'
import { onMounted, ref } from 'vue'
import { useVehiclesStore } from '@/stores/master-data/vehiclesStore'
import { useHullsStore } from '@/stores/master-data/hullNumberStore'
import { useContractorsStore } from '@/stores/master-data/contractorsStore'
import { useSitesStore } from '@/stores/master-data/sitesStore'
import { useViolationsStore } from '@/stores/violation/violationsStore'
import BaseButton from '@/components/button/BaseButton.vue'
import { storeToRefs } from 'pinia'
import EventDetailModal from '@/components/modal/EventDetailModal.vue'

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

const violationsStore = useViolationsStore()
const { violationsReport, violationStatus, getViolationReportIsLoading } = storeToRefs(useViolationsStore())
const sitesStore = useSitesStore()
const { sites } = storeToRefs(useSitesStore())
const contractorsStore = useContractorsStore()
const { contractors } = storeToRefs(useContractorsStore())
const vehiclesStore = useVehiclesStore()
const { vehicles } = storeToRefs(useVehiclesStore())
const hullNumberStore = useHullsStore()
const { hulls } = storeToRefs(useHullsStore())

onMounted(() => {
  sitesStore.getSites()
  contractorsStore.getContractors()
  hullNumberStore.getHulls()
  // vehiclesStore.getVehicles()
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
// function getHullsList(item) {
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
    queryParams.hullNumber = selectedHull.value
  }
  queryParams.startTime = new Date(startDate.value + 'T' + startTime.value).toISOString()
  queryParams.endTime = new Date(endDate.value + 'T' + endTime.value).toISOString()
  console.log(queryParams)
  await violationsStore.getViolationReport(queryParams)
  modalActive.value = true
  setTimeout(closeNotification, 3000)
}

const isEventModalPops = ref(false)
function eventModalToggle() {
  isEventModalPops.value = !isEventModalPops.value
}
const eventParams = ref({})
let imei
function viewViolationFootage(item) {
  console.log(item)
  let eventStartTime = new Date(item.eventTime)
  eventParams.value = {
    event: item.eventIo,
    eventTime: item.eventTime,
    eventStartTime: new Date(eventStartTime.getTime() - 3000),
    eventEndTime: new Date(eventStartTime.getTime() + 3000),
  }
  imei = item.imei
  isEventModalPops.value = true
}

const header = [
  { text: "Time", value: "deviceTime" ,sortable: true},
  { text: "Hull Number", value: "hullNumber",sortable: true },
  { text: "Registration Number", value: "registrationNumber",sortable: true },
  { text: "Site", value: "site",sortable: true },
  { text: "Contractor", value: "contractor",sortable: true },
  { text: "Speed (KpH)", value: "speed", sortable: true },
  { text: "Violation", value: "violation", sortable: true },
  { text: "Coordinate", value: "coordinate"},
  { text: "", value: "operation"},
]

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
    overflow-auto sm:overflow-visible
}
.table-header {
  @apply
  flex flex-row w-full justify-between mb-6
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