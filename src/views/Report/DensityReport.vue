<template>
  <alert :message="getDensityReportStatus.message" :modalActive="modalActive" :isError="getDensityReportStatus.isError" />
  <MapLoading :loading="loadingStore.loading" />
  <div class="grid grid-cols-3 w-full gap-4">
    <div ref="mapContainer" class="map-container col-span-2 relative">
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
    <div class="flex flex-col gap-4 w-full">
      <EasyDataTable :rows-per-page="15" hide-rows-per-page header-text-direction="center" body-text-direction="center"
        table-class-name="customize-table" :headers="header" :items="densityReport" theme-color="#1363df"
        @expand-row="highlightPolygon" :loading="getDensityReportIsLoading">

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
            <table>
              <tr>
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
    </div>
    <div id="popup" title="myproject" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content">
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
const { densityReport, getDensityReportIsLoading, getDensityReportStatus } = storeToRefs(useReportStore())
//table
const header = [
  { text: "Name", value: "name" },
  { text: "Vehicle Count", value: "vehicleCount" },
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
          frameBorder: geofence.frameBorder
        }
        initialFeatures.value.push(obj)
      }

    })

    for (const initialFeature of initialFeatures.value) {
      const polygonStyle = new Style({
        fill: new Fill({
          color: 'rgba(100, 255, 0, 0.3)',
        }),
        stroke: new Stroke({
          color: 'rgba(251, 139, 36, 0.8)',
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
  --easy-table-body-row-height: 46px;
  --easy-table-body-item-padding: 0px 24px;

  --easy-table-footer-font-size: 12px;
  --easy-table-footer-height: 40px;
  --easy-table-footer-font-color: #6E6E78;
  border-collapse: collapse;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
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
</style>
