<template>
  <alert :message="getDensityReportStatus.message" :modalActive="modalActive" :isError="getDensityReportStatus.isError"
    @close="closeNotification" />
  <MapLoading :loading="loadingStore.loading" />
  <div class="grid grid-cols-3 w-full gap-4">
    <div ref="mapContainer" class="map-container col-span-2 relative overflow-auto">
      <div class="filter-form">
        <h1 class="text-left font-bold text-[10px] sm:text-sm">Filter</h1>
        <div class="flex gap-1 sm:gap-4 text-[10px] sm:text-xs items-start">
          <div class="text-left flex flex-col gap-2 ">
            <h2 class="font-semibold">From</h2>
            <div class="flex gap-6 ">
              <input class="cursor-pointer bg-transparent" type="date" name="startDate" id="startDate"
                v-model="startDate">
              <input class="cursor-pointer bg-transparent" type="time" name="startTime" id="startTime"
                v-model="startTime">
            </div>
          </div>
          <div class="text-left flex flex-col gap-2">
            <h2 class="font-semibold">To</h2>
            <div class="flex gap-6">
              <input class="cursor-pointer bg-transparent" type="date" name="endDate" id="endDate" v-model="endDate">
              <input class="cursor-pointer bg-transparent" type="time" name="endTime" id="endTime" v-model="endTime">
            </div>
          </div>
          <div class="flex flex-col gap-2 items-start">
            <label for="contractorFilter" class="text-xs font-semibold">Contractor</label>
            <select name="contractorFilter" id="contractorFilter"
              class="outline-none text-[12px] text-[#353535] p-1 border border-[#D9D9D9] rounded-md cursor-pointer h-fit w-fit"
              v-model="selectedContractor">
              <option class="p-2 cursor-pointer" value="0">All Contractor</option>
              <option class="p-2 cursor-pointer" v-for="contractor in contractors" :value="contractor.name">
                {{ contractor.name }}</option>
            </select>
          </div>
          <BaseButton type="button" class="filled__green mt-4" label="Filter" @click="loadDensityReport()" />
        </div>
      </div>
    </div>
    <div class="flex gap-2 w-full relative">
      <EasyDataTable :rows-per-page="20" hide-rows-per-page header-text-direction="center" body-text-direction="center"
        table-class-name="customize-table" :headers="header" :items="densityReport" theme-color="#1363df"
        @expand-row="highlightPolygon" :loading="getDensityReportIsLoading">
        <template #item-operation="item">
          <div class="flex w-full justify-center">
            <svg class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" @click="loadDensityDetail(item)">
              <path d="M13 7H22V9H13V7ZM13 15H22V17H13V15ZM16 11H22V13H16V11ZM13 12L8 7V11H2V13H8V17L13 12Z"
                fill="#353535" fill-opacity="0.6" />
            </svg>
          </div>
        </template>
        <template #expand="item">
          <div class="grid grid-cols-3 p-2">
            <div class="col-span-2 flex flex-col gap-1">
              <div class="grid grid-cols-2 text-left gap-2">
                <p>Eventual Record: </p>
                <p class="font-medium">{{ item.eventualRecord }}</p>
              </div>
              <div class="grid grid-cols-2 text-left gap-2">
                <p>Max Allowed Speed: </p>
                <p class="font-medium">{{ item.maxAllowedSpeed }}</p>
              </div>
              <div class="grid grid-cols-2 text-left gap-2">
                <p>Operand: </p>
                <p class="font-medium">{{ item.operandText }}</p>
              </div>
              <div class="grid grid-cols-2 text-left gap-2">
                <p>Frame Border: </p>
                <p class="font-medium">{{ item.frameBorder }}</p>
              </div>
            </div>
            <div class="flex flex-col gap-2 text-left">
              <p>Notes: </p>
              <p class="font-medium">{{ item.notes }}</p>
            </div>
          </div>
          <div>
            <table class="w-full">
              <tr class="bg-[#F6F6F9]">
                <th>Number</th>
                <th>Lat</th>
                <th>Long</th>
              </tr>
              <tr v-for="(coord, index) in item.coordinates">
                <td>P{{ index + 1 }}</td>
                <td>{{ coord[0] }}</td>
                <td>{{ coord[1] }}</td>
              </tr>
            </table>
          </div>
        </template>
      </EasyDataTable>
      <div class="densityDetail" :class="detailExpanded === true ? 'detailExpanded' : ''">
        <div class="w-full flex items-center justify-between pt-4">
          <p></p>
          <div class="flex gap-2">
            <h1 class="font-medium">{{ densityDetail.geofence }} :</h1>
            <h1 class="font-medium">{{ densityDetail.totalVehicles }} Vehicles</h1>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            @click="detailExpanded = false" class="cursor-pointer">
            <g clip-path="url(#clip0_617_2)">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M6.29303 6.29279C6.48056 6.10532 6.73487 6 7.00003 6C7.26519 6 7.5195 6.10532 7.70703 6.29279L12.707 11.2928C12.8945 11.4803 12.9998 11.7346 12.9998 11.9998C12.9998 12.265 12.8945 12.5193 12.707 12.7068L7.70703 17.7068C7.51843 17.8889 7.26583 17.9897 7.00363 17.9875C6.74143 17.9852 6.49062 17.88 6.30521 17.6946C6.1198 17.5092 6.01463 17.2584 6.01236 16.9962C6.01008 16.734 6.11087 16.4814 6.29303 16.2928L10.586 11.9998L6.29303 7.70679C6.10556 7.51926 6.00024 7.26495 6.00024 6.99979C6.00024 6.73462 6.10556 6.48031 6.29303 6.29279ZM12.293 6.29279C12.4806 6.10532 12.7349 6 13 6C13.2652 6 13.5195 6.10532 13.707 6.29279L18.707 11.2928C18.8945 11.4803 18.9998 11.7346 18.9998 11.9998C18.9998 12.265 18.8945 12.5193 18.707 12.7068L13.707 17.7068C13.5184 17.8889 13.2658 17.9897 13.0036 17.9875C12.7414 17.9852 12.4906 17.88 12.3052 17.6946C12.1198 17.5092 12.0146 17.2584 12.0124 16.9962C12.0101 16.734 12.1109 16.4814 12.293 16.2928L16.586 11.9998L12.293 7.70679C12.1056 7.51926 12.0002 7.26495 12.0002 6.99979C12.0002 6.73462 12.1056 6.48031 12.293 6.29279Z"
                fill="#3A3A3E" />
            </g>
            <defs>
              <clipPath id="clip0_617_2">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div class="densityDetailContent">
          <div class="flex flex-col gap-1" v-for="item in 1" v-if="getDensityDetailIsLoading">
            <div class="border  shadow rounded-full py-2 px-4 bg-slate-200">
              <div class="animate-pulse flex space-x-4">
                <div class="flex-1 space-y-6 py-1">
                  <div class="h-2 bg-slate-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="densityDetailLength === 0 && !getDensityDetailIsLoading"
            class="font-medium py-2 px-4 rounded-full bg-[#C21629] h-fit w-full text-xs text-white">
            No Vehicle
          </div>
          <table class="w-full" v-if="!getDensityDetailIsLoading && densityDetailLength !== 0">
            <tr class="bg-[#F6F6F9]">
              <th>Vehicle</th>
              <th>Contractor</th>
            </tr>
            <tr v-for="detail in densityDetail.geofenceData">
              <td>{{ detail.vehicle }}</td>
              <td>{{ detail.contractor }}</td>
            </tr>
          </table>
          <!-- <div v-for="detail in densityDetail.geofenceData" v-if="!getDensityDetailIsLoading"
            class="font-medium py-2 px-4 rounded-full bg-[#93C76A] h-fit w-fit text-xs text-white">
            {{ detail.vehicle }}
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseButton from '@/components/button/BaseButton.vue'

//maps
import { Map, View, Overlay } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import { Style, Circle, Fill, Stroke } from 'ol/style'
import Polygon from 'ol/geom/Polygon';
import Text from 'ol/style/Text';

import { useMapLoadingStore } from '@/stores/MapLoadingStore'
import MapLoading from '@/components/MapLoading.vue'
import { useReportStore } from '@/stores/report/reportStore'
import { storeToRefs } from 'pinia'
import { useContractorsStore } from '@/stores/master-data/contractorsStore'

//store
const contractorsStore = useContractorsStore()
const { contractors } = storeToRefs(useContractorsStore())
const reportStore = useReportStore()
const { densityReport, getDensityReportIsLoading, getDensityReportStatus, densityDetail, getDensityDetailIsLoading, getDensityDetailStatus, densityDetailLength } = storeToRefs(useReportStore())
//table
const header = [
  { text: "Name", value: "name" },
  { text: "Vehicle Count", value: "vehicleCount" },
  { text: "Details", value: "operation" },
]
//filter
const tempStartDate = new Date();
tempStartDate.setDate(tempStartDate.getDate() - 1);
const startDate = ref(tempStartDate.toLocaleDateString('en-CA'))
const startTime = ref(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
const endDate = ref(new Date().toLocaleDateString('en-CA'))
const endTime = ref(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))

const selectedContractor = ref('0')

onMounted(async () => {
  await contractorsStore.getContractors()
  await loadDensityReport()
  initializeMap()
})

//load report
async function loadDensityReport() {
  const queryParams = ref({
    startTime: null,
    endTime: null
  })
  queryParams.value.startTime = new Date(startDate.value + 'T' + startTime.value).toISOString()
  queryParams.value.endTime = new Date(endDate.value + 'T' + endTime.value).toISOString()
  if (selectedContractor.value !== '0') {
    queryParams.value.contractor = selectedContractor.value
  }
  await reportStore.getDensityReport(queryParams.value)
  modalActive.value = true
  setTimeout(closeNotification, 3000)
}

//density detail
const detailExpanded = ref(false)
async function loadDensityDetail(item) {
  console.log(item)
  detailExpanded.value = true
  const queryParams = ref({
    startTime: null,
    endTime: null
  })
  queryParams.value.startTime = new Date(startDate.value + 'T' + startTime.value).toISOString()
  queryParams.value.endTime = new Date(endDate.value + 'T' + endTime.value).toISOString()
  queryParams.value.geofence = item.name
  if (selectedContractor.value !== '0') {
    queryParams.value.contractor = selectedContractor.value
  }
  await reportStore.getDensityDetail(queryParams.value)
}
//map init
let map
const mapContainer = ref(null)
const loadingStore = useMapLoadingStore()
function initializeMap() {
  drawVector.value = new VectorLayer({
    source: new VectorSource(),
    style: polygonStyle,
  })
  drawPolygon()
  map = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      drawVector.value
    ],
    view: new View({
      center: fromLonLat([118.015776, -2.600029]),
      zoom: 6,
    }),
    controls: []
  })
}

//polygon init
const initialFeatures = ref([])
const drawVector = ref(null)
const polygonStyle = new Style({
  fill: new Fill({
    color: 'rgba(100, 255, 0, 0.3)',
  }),
  stroke: new Stroke({
    color: 'rgba(251, 139, 36, 0.8)',
    width: 1,
  }),
})

function drawPolygon() {
  // CODE UNDER TEST
  let vector = drawVector.value.getSource()
  vector.clear()
  const features = []
  initialFeatures.value = []
  if (densityReport.value.length !== 0) {
    densityReport.value.map(geofence => {
      if (geofence.coordinates) {
        let lonLatCoordinates = geofence.coordinates.map(coordinate => {
          return [coordinate[1], coordinate[0]]
        })
        let projectedCoordinates = lonLatCoordinates.map(coordinate => {
          return fromLonLat(coordinate)
        })
        let obj =
        {
          geometry: new Polygon([projectedCoordinates]),
          name: geofence.name,
          id: geofence.id,
          geofenceId: geofence.geofenceId,
          geofenceIdText: geofence.geofenceIdText,
          notes: geofence.notes,
          operand: geofence.operand,
          operandText: geofence.operandText,
          eventualRecord: geofence.eventualRecord,
          maxAllowedSpeed: geofence.maxAllowedSpeed,
          frameBorder: geofence.frameBorder,
          vehicleCount: geofence.vehicleCount
        }
        initialFeatures.value.push(obj)
      }

    })

    for (const initialFeature of initialFeatures.value) {
      console.log('here', initialFeature.vehicleCount)
      let polygonStyle
      let count = initialFeature.vehicleCount
      if (count >= 0 && count <= 1) {
        polygonStyle = new Style({
          fill: new Fill({
            color: 'rgba(100, 255, 0, 0.3)',
          }),
          stroke: new Stroke({
            color: 'rgba(100, 255, 0, 1)',
            width: 1,
          }),
          text: new Text({
            text: initialFeature.name,
            fill: new Fill({
              color: 'black',
            }),
            offsetY: 0, // Adjust the offset if needed
            textAlign: 'center',
            font: 'bold 14px sans-serif',
          }),
        })
      } else if (count >= 11 && count <= 100) {
        polygonStyle = new Style({
          fill: new Fill({
            color: 'rgba(255, 199, 0, 0.3)',
          }),
          stroke: new Stroke({
            color: 'rgba(255, 199, 0, 1)',
            width: 1,
          }),
          text: new Text({
            text: initialFeature.name,
            fill: new Fill({
              color: 'black',
            }),
            offsetY: 0, // Adjust the offset if needed
            textAlign: 'center',
            font: 'bold 14px sans-serif',
          }),
        })
      } else if (count >= 101 && count <= 500) {
        polygonStyle = new Style({
          fill: new Fill({
            color: 'rgba(251, 139, 36, 0.3)',
          }),
          stroke: new Stroke({
            color: 'rgba(251, 139, 36, 1)',
            width: 1,
          }),
          text: new Text({
            text: initialFeature.name,
            fill: new Fill({
              color: 'black',
            }),
            offsetY: 0, // Adjust the offset if needed
            textAlign: 'center',
            font: 'bold 14px sans-serif',
          }),
        })
      } else if (count >= 501 && count <= 1000) {
        polygonStyle = new Style({
          fill: new Fill({
            color: 'rgba(243, 0, 24, 0.3)',
          }),
          stroke: new Stroke({
            color: 'rgba(243, 0, 24, 1)',
            width: 1,
          }),
          text: new Text({
            text: initialFeature.name,
            fill: new Fill({
              color: 'black',
            }),
            offsetY: 0, // Adjust the offset if needed
            textAlign: 'center',
            font: 'bold 14px sans-serif',
          }),
        })
      }
      const feature = new Feature({
        geometry: initialFeature.geometry,
        id: initialFeature.id,
        name: initialFeature.name,
        notes: initialFeature.notes,
      });
      feature.setStyle(polygonStyle)
      features.push(feature);
    }
    drawVector.value.getSource().addFeatures(features)
    console.log('FEATURES')
    console.log(drawVector.value.getSource().getFeatures())
  }
}
function highlightPolygon(index) {
  let highlightedGeofence = densityReport.value[index].id
  let features = drawVector.value.getSource().getFeatures()
  const highlightedFeature = features.filter(feature => feature.values_.id === highlightedGeofence)
  if (highlightedFeature) {
    let geometry = highlightedFeature[0].getGeometry();
    let extent = geometry.getExtent();
    map.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 1000 });
  }
}

//alert
const modalActive = ref(false)
const closeNotification = () => { modalActive.value = false }



</script>

<style scoped>
.map-container {
  width: 100%;
  max-height: 950px;
}

.ol-popup {
  position: absolute;
  background-color: white;
  /*--webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));*/
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
  margin-bottom: 10px;

}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}


.filter-form {
  @apply text-[#3a3a3e] text-base px-4 py-4 absolute left-2 top-2 flex flex-col gap-2 rounded-lg w-fit h-fit shadow-blue-300/50 shadow-sm bg-white z-10
}

.vehicle-info {
  @apply shadow-sm shadow-blue-300/50 backdrop-blur-md bg-gradient-to-b from-slate-50/80 rounded-lg w-fit h-full px-4 py-6 gap-2 flex flex-col min-w-[260px] cursor-pointer select-none
}

.active {
  @apply flex !important
}

.content {
  @apply hidden h-fit flex-col text-left gap-4 mb-2
}

.customize-table {
  --easy-table-border: 1px solid #EBEBED;
  --easy-table-header-font-size: 14px;
  --easy-table-header-background-color: #FAFAFA;
  --easy-table-header-font-color: #015A6A;
  --easy-table-header-height: 40px;
  --easy-table-header-item-padding: 16px 24px;

  --easy-table-body-row-font-size: 14px;
  --easy-table-body-font-color: #3A3A3E;
  --easy-table-body-row-height: 38px;
  --easy-table-body-item-padding: 0px 24px;

  --easy-table-footer-font-size: 12px;
  --easy-table-footer-height: 40px;
  --easy-table-footer-font-color: #6E6E78;
  border-collapse: collapse;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  height: 950px;
  width: 100%;
}

table {
  @apply border w-full mb-2
}

table tr {
  @apply border
}


.title {
  @apply text-left border-b-[1px] pb-[18px] text-[24px] font-normal text-[#8E8E93] mb-6
}


.message-wrapper {
  @apply flex items-center gap-2
}

.form-wrapper {
  @apply flex flex-col gap-6
}


.modal {
  @apply absolute top-0 left-0 w-full h-full overflow-x-hidden overflow-y-auto bg-[#ABADAF]/20 z-20
}

.modal-inner {
  @apply max-w-[500px] my-[100px] mx-auto
}

.modal-content {
  @apply relative w-[600px] p-[40px] bg-white gap-[30px] rounded-xl
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drop-in-enter-active,
.drop-in-leave-active {
  transition: all 0.3s ease-out;
}

.drop-in-enter-from,
.drop-in-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.select-option {
  @apply px-6 py-3 outline-none rounded-[5px] border border-[#CFCFCF] bg-[#F2F2F2] text-sm
}

.checkbox-wrapper {
  @apply flex justify-between bg-[#F2F2F2] px-6 py-3 w-full rounded-[5px] border border-[#CFCFCF] text-sm
}


input[type=checkbox] {
  @apply cursor-pointer text-sm
}

.action-btn {
  @apply cursor-pointer hover:fill-[#EF476F] fill-[#353535]/60
}

.drop-in-enter-active,
.drop-in-leave-active {
  transition: all 0.5s ease-out;
}

.drop-in-enter-from,
.drop-in-leave-to {
  opacity: 0;
  transform: translateZ(-50px);
}

.densityDetail::-webkit-scrollbar {
  width: 4px;
}

.densityDetail::-webkit-scrollbar-track {
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
}

.densityDetail::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid darkgrey;
  border-radius: 10%;
}

.densityDetail {
  @apply bg-white h-[950px] right-0 rounded-l-xl z-10 overflow-hidden transition-all duration-300 gap-4 w-0 absolute
}
.detailExpanded {
  @apply border px-4 w-full overflow-y-auto
}
.densityDetailContent {
  @apply mt-6 flex flex-wrap gap-2
}


table th {
  @apply py-2 border text-xs font-medium
}

table td {
  @apply py-2 border text-xs font-medium text-center
}
</style>
