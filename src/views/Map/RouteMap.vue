<template>
  <MapLoading :loading="loadingStore.loading" />
  <alert :message="geoDataStore.status.message" :modalActive="modalActive" :isError="geoDataStore.status.isError"
    @close="closeNotification" />
  <div ref="mapContainer" class="map-container"></div>
  <div id="popup" title="myproject" class="ol-popup">
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
    <div id="popup-content">
    </div>
  </div>
  <div class="form-wrapper">
    <div 
      class="vehicle-info">
      <div class="flex items-center justify-between" @click="toggleAccordion()">
        <div class="flex items-center justify-between">
          <h1 class="text-left font-bold text-lg mb-2">Filter Route</h1>
        </div>
        <div>
          <button
          class="flex items-center space-x-3"
          :aria-expanded="isOpen"
          :aria-controls="`collapse`"
          >
            <svg
            class="w-3 transition-all duration-200 transform"
            :class="{
              'rotate-180': isOpen,
              'rotate-0': !isOpen,
              }"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 10"
              aria-hidden="true"
            >
              <path
              d="M15 1.2l-7 7-7-7"
              stroke-width="2"
              stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="content" 
        :class="{'active': isOpen}">
        <form @submit.prevent="filterVehicle">
          <div class="grid grid-cols-2 gap-4 items-end justify-between mb-4 ">
            <select v-model="selectedVehicle" class="select-option" @change="changeVehicle(selectedVehicle.id)">
              <option v-for="item in vehicles" :key="item.id" :value="item">
                <p class="font-semibold">{{ item.name }}</p>
              </option>
            </select>
            <p class="font-bold px-3 py-2 border-b border-[#3a3a3e] w-full cursor-default">
              {{ selectedVehicle.registrationNumber }}</p>
          </div>
          <div class="grid grid-cols-1 px-3 py-2 border-b border-[#3a3a3e] cursor-default mb-6 gap-4">
            <div class="flex gap-2 w-full text-left items-center" v-for="(item, index) in vehicle.devices">
              <input class="cursor-pointer w-4" type="checkbox" v-model="selectedVariant" :name="item.imeiNumber"
                :disabled="geoDataStore.status.isError" @change="changeVariant" :value="item.imeiNumber">
              <label :for="item.type" class="w-full items-center flex gap-4 font-semibold cursor-default">
                {{ item.type }}
              </label>
              <div :class="{ 'blue-circle': index == 0, 'green-circle': index == 1 , 'purple-circle': index == 2 , 'red-circle': index == 3 }"></div>
            </div>
          </div>
          <div class="text-left flex flex-col gap-2 ">
            <h2 class="font-semibold">From</h2>
            <div class="flex gap-6 ">
              <input class="cursor-pointer bg-transparent" type="date" name="startDate" id="startDate" v-model="startDate">
              <input class="cursor-pointer bg-transparent" type="time" name="startTime" id="startTime" v-model="startTime">
            </div>
          </div>
          <div class="text-left flex flex-col gap-2">
            <h2 class="font-semibold">To</h2>
            <div class="flex gap-6">
              <input class="cursor-pointer bg-transparent" type="date" name="endDate" id="endDate" v-model="endDate">
              <input class="cursor-pointer bg-transparent" type="time" name="endTime" id="endTime" v-model="endTime">
            </div>
          </div>
          <BaseButton type="submit" class="filled__green mt-4" label="Filter" />
        </form>
      </div>
    </div>
    <div class="legend">
      <div class="outlined-circle"></div>
      <h2>Event</h2>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/button/BaseButton.vue'
import { ref, onMounted, computed } from 'vue'
import { Map, View, Overlay } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Circle, Fill, Stroke } from 'ol/style'
import LineString from 'ol/geom/LineString'
import { useGeoDataStore } from '@/stores/GeoDataStore'
import { useVehiclesStore } from '@/stores/master-data/vehiclesStore'
import { storeToRefs } from 'pinia'
import distanceFilter from '@/composable/distanceFilter.js'
import Select from 'ol/interaction/Select'
import { click, pointerMove, singleClick } from 'ol/events/condition';
import { blue } from 'tailwindcss/colors'
import MapLoading from '@/components/MapLoading.vue'
import { useMapLoadingStore } from '@/stores/MapLoadingStore'

let map
let popupOverlay
let vectorSource
let layers = []
const isOpen = ref(false)
const mapContainer = ref(null)
const geoDataStore = useGeoDataStore()
const vehiclesStore = useVehiclesStore()
const { vehicles, vehicle } = storeToRefs(useVehiclesStore())
const loadingStore = useMapLoadingStore()
const selectedVehicle = ref({ id: null, registrationNumber: null })
const selectedVariant = ref([])

const startDate = ref(new Date().toLocaleDateString('en-CA'))
const tempStartTime = new Date();
tempStartTime.setHours(tempStartTime.getHours() - 1);
const startTime = ref(tempStartTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
const endDate = ref(new Date().toLocaleDateString('en-CA'))
const endTime = ref(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))

const modalActive = ref(false)
const closeNotification = () => {
  modalActive.value = false
}
function toggleAccordion() {
  isOpen.value = !isOpen.value
  console.log(isOpen.value)
}
const queryParams = ref({
  startTime: null,
  endTime: null
})

const style = [
  {
    line: new Style({
      stroke: new Stroke({
        color: 'rgba(10,110,189,1.000)',
        width: 4,
      }),
    }),
    dot: 'rgba(10, 110, 189, 0.4)'
  },
  {
    line: new Style({
      stroke: new Stroke({
        color: 'rgba(22,255,0,1.000)',
        width: 4,
      }),
    }),
    dot: 'rgba(22,255,0,0.4)'
  },
  {
    line: new Style({
      stroke: new Stroke({
        color: 'rgba(101,39,190,1.000)',
        width: 4,
      }),
    }),
    dot: 'rgba(101,39,190,0.4)'
  },
  {
    line: new Style({
      stroke: new Stroke({
        color: 'rgba(243,21,89,1.000)',
        width: 4,
      }),
    }),
    dot: 'rgba(243,21,89,0.4)'
  }
]


// Code under here is test
let identifyLayers = [{}]

function changeVariant() {
  // const layers = map.getLayers().getArray()
  //   .filter(layer => layer instanceof VectorLayer)
  // console.log(identifyLayers)
  // console.log('changed', selectedVariant.value)

  identifyLayers.forEach((value) => {
    if (selectedVariant.value.includes(value.type)) {
      value.layer.setVisible(true)
    } else {
      value.layer.setVisible(false)
    }
  })

  // if (selectedVariant.value.includes('FMB130')) {
  //   const layer = identifyLayers.find(x => x.type === 'FMB130')
  //   if (layer) layer.layer.setVisible(true)
  // } else {
  //   const layer = identifyLayers.find(x => x.type === 'FMB130')
  //   if (layer) layer.layer.setVisible(false)
  // }
  // if (selectedVariant.value.includes('VT200')) {
  //   const layer = identifyLayers.find(x => x.type === 'VT200')
  //   if (layer) layer.layer.setVisible(true)
  // } else {
  //   const layer = identifyLayers.find(x => x.type === 'VT200')
  //   if (layer) layer.layer.setVisible(false)
  // }
}
onMounted(async () => {
  await vehiclesStore.getVehicles()
  initializeMap()
})

async function changeVehicle(id) {
  await vehiclesStore.getVehicle(id)
}

function initializeMap() {
  map = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new OSM(),
      })
    ],
    view: new View({
      center: fromLonLat([118.015776, -2.600029]),
      zoom: 5,
      // maxZoom: 16,
    }),
    controls: []
  })

  popupOverlay = new Overlay({
    element: document.getElementById('popup'),
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  })
  map.addOverlay(popupOverlay)
}


let minimumDistance = 0

async function filterVehicle() {
  loadingStore.startLoading()
  identifyLayers.length = 0
  queryParams.value.startTime = new Date(startDate.value + 'T' + startTime.value).toISOString()
  queryParams.value.endTime = new Date(endDate.value + 'T' + endTime.value).toISOString()
  await geoDataStore.getVehicleHistoryDeviceGeo(selectedVehicle.value.id, queryParams.value)
  selectedVariant.value = []
  layers.map(layer => {
    map.removeLayer(layer)
  })
  layers.length = 0
  if (!geoDataStore.status.isError) {

    let geolocations = geoDataStore.vehicleHistoryGeo.vehicle.devices
    geolocations.forEach((geolocation, index) => {
      console.log('gelolocation data', geolocation)
      let variant = geolocation.type
      let filteredData = geolocation.history.filter(geo => geo.latitude != 0)
      let route = distanceFilter.filter(minimumDistance, filteredData).route
      if (route.length != 0) {
        selectedVariant.value.push(geolocation.imeiNumber)
        let coordinates = route.map(item => fromLonLat([item.longitude, item.latitude]))
        let lineString = new LineString(coordinates)
        let lineFeature = new Feature({
          geometry: lineString,
        })
        lineFeature.setStyle(style[index].line)
        vectorSource = new VectorSource()
        vectorSource.addFeature(lineFeature)
        addDotsMarker(style[index].dot, route, variant)
        const layer = new VectorLayer({
          source: vectorSource,
          visible: true
        })
        identifyLayers.push({
          layer: layer,
          type: geolocation.imeiNumber
        })
        layers.push(layer)
        map.addLayer(layer)
        map.getView().fit(lineString.getExtent(), {
          padding: [50, 50, 50, 50],
        })
      }


      // if (index == 0) {
      //   if (blueVectorLayer) {
      //     map.removeLayer(blueVectorLayer)
      //   }
      //   if (route.length != 0) {
      //     selectedVariant.value.push(geolocation.imeiNumber)
      //     let coordinates = route.map(item => fromLonLat([item.longitude, item.latitude]))
      //     let lineString = new LineString(coordinates)
      //     let lineFeature = new Feature({
      //       geometry: lineString,
      //     })
      //     lineFeature.setStyle(
      //       new Style({
      //         stroke: new Stroke({
      //           color: 'rgba(10,110,189,1.000)',
      //           width: 4,
      //         }),
      //       })
      //     )
      //     vectorSource = new VectorSource()
      //     vectorSource.addFeature(lineFeature)
      //     addDotsMarker('rgba(10,110,189,0.4)', route)
      //     blueVectorLayer = new VectorLayer({
      //       source: vectorSource,
      //       visible: true
      //     })
      //     identifyLayers.push({
      //       layer: blueVectorLayer,
      //       type: geolocation.imeiNumber
      //     })
      //     map.addLayer(blueVectorLayer)
      //     map.getView().fit(lineString.getExtent(), {
      //       padding: [50, 50, 50, 50],
      //     })
      //   }
      // } else {
      //   if (purpleVectorLayer) {
      //     map.removeLayer(purpleVectorLayer)
      //   }
      //   if (route.length != 0) {
      //     selectedVariant.value.push(geolocation.imeiNumber)
      //     let coordinates = route.map(item => fromLonLat([item.longitude, item.latitude]))
      //     let lineString = new LineString(coordinates)
      //     let lineFeature = new Feature({
      //       geometry: lineString,
      //     })

      //     lineFeature.setStyle(
      //       new Style({
      //         stroke: new Stroke({
      //           color: 'rgba(0,223,162,1.000)',
      //           width: 4,
      //         }),
      //       })
      //     )
      //     vectorSource = new VectorSource()
      //     vectorSource.addFeature(lineFeature)
      //     addDotsMarker('rgba(0,223,162,0.4)', route)
      //     purpleVectorLayer = new VectorLayer({
      //       source: vectorSource,
      //       visible: true
      //     })
      //     identifyLayers.push({
      //       layer: purpleVectorLayer,
      //       type: geolocation.imeiNumber
      //     })
      //     map.addLayer(purpleVectorLayer)
      //     map.getView().fit(lineString.getExtent(), {
      //       padding: [50, 50, 50, 50],
      //     })
      //   }
      // }
    })

  }
  console.log('init', selectedVariant.value)

  const selectInteraction = new Select({
    condition: pointerMove,
    style: null,
    layers: [...layers],
  })

  const clickInteraction = new Select({
    condition: click,
    style: null,
    layers: [...layers],
  })
  clickInteraction.on('select', (event) => {
    console.log(event)
  })
  selectInteraction.on('select', (event) => {
    const selectedFeatures = event.target.getFeatures()
    if (selectedFeatures.getLength() > 0) {
      const selectedFeature = selectedFeatures.item(0)
      const isLineString = selectedFeature.getGeometry().getType() === 'LineString'
      if (!isLineString) {
        let fix_flag = selectedFeature.get('value').fixFlag
        let latitude = selectedFeature.get('value').latitude
        let longitude = selectedFeature.get('value').longitude
        let altitude = selectedFeature.get('value').altitude
        let angle = selectedFeature.get('value').course
        let satellites = selectedFeature.get('value').satellites
        let hdop = selectedFeature.get('value').hdop
        let speed = selectedFeature.get('value').speed
        let gsm_signal = selectedFeature.get('value').gsmSignal
        let internal_battery = selectedFeature.get('value').internalBattery
        let external_power = selectedFeature.get('value').externalPower
        let stored_time = selectedFeature.get('value').storedTime
        let time = selectedFeature.get('value').deviceTime
        let diff_time = selectedFeature.get('value').diff_time
        let event_io = selectedFeature.get('value').eventIo
        let popupContent =
          'GPS status: ' + fix_flag + '<br>'
          + 'Latitude: ' + latitude + '<br>'
          + 'Longitude:' + longitude + '<br>'
          + 'Altitude: ' + altitude + '<br>'
          + 'Satellite number: ' + satellites + '<br>'
          + 'HDOP: ' + hdop + '<br>'
          + 'Angle: ' + angle + '<br>'
          + 'Speed: ' + speed + '<br>'
          + 'GSM signal: ' + gsm_signal + '<br>'
          + 'Battery voltage: ' + internal_battery + '<br>'
          + 'External voltage: ' + external_power + '<br>'
          + 'Stored time : ' + stored_time + '<br>'
          + 'Device time : ' + time + '<br>'
          + 'Different time : ' + diff_time + ' second <br>'
          + 'Event : ' + event_io + ' <br>'
        document.getElementById('popup').innerHTML = popupContent
        popupOverlay.setPosition(selectedFeature.getGeometry().getCoordinates())
        popupOverlay.getElement().style.display = 'block'
      }
    } else {
      popupOverlay.setPosition(undefined)
    }
  })

  map.addInteraction(selectInteraction)
  map.addInteraction(clickInteraction)
  modalActive.value = true
  loadingStore.stopLoading()
  setTimeout(closeNotification, 3000)

}

function addDotsMarker(color, data, variant) {
  data.forEach((item, index) => {
    // console.log(
    //   variant,
    //   "\n","GPS status: " , item.fixFlag , 
    //   "\n","Latitude: " , item.latitude , 
    //   "\n","Longitude:" , item.longitude , 
    //   "\n","Altitude: " , item.altitude , 
    //   "\n","Satellite number: " , item.satellites , 
    //   "\n","HDOP: " , item.hdop , 
    //   "\n","Angle: " , item.course , 
    //   "\n","Speed: " , item.speed , 
    //   "\n","GSM signal: " , item.gsmSignal , 
    //   "\n","Battery voltage: " , item.internalBattery , 
    //   "\n","External voltage: " , item.externalPower , 
    //   "\n","Stored time : " , item.storedTime , 
    //   "\n","Device time : " , item.deviceTime , 
    //   "\n","Different time : " , item.diff_time,
    //   "\n","Event : " , item.eventIo)
    const { latitude, longitude, eventIo } = item
    const marker = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
      value: item,
    })
    let markerStyle
    if (index === 0) {
      // First marker
      markerStyle = new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: 'green' }),
          stroke: new Stroke({ color: 'white', width: 1 }),
        }),
      })
    } else if (index === data.length - 1) {
      // Last marker
      markerStyle = new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({ color: 'white', width: 1 }),
        }),
      })
    } else {
      if (eventIo == '0') {
        markerStyle = new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({ color: `${color}` }),
            // stroke: new Stroke({ color: 'rgba(255, 0, 0, 0.4)', width: 8 }),
          }),
        })
      } else {
        markerStyle = new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({ color: `${color}` }),
            stroke: new Stroke({ color: 'red', width: 1 }),
          }),
        })
      }
    }

    marker.setStyle(markerStyle)
    vectorSource.addFeature(marker)
  })
}

</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh
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
  @apply text-left
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

.select-option {
  @apply px-3 py-2 cursor-pointer border-b border-[#3a3a3e] bg-transparent outline-none
}

.form-wrapper {
  @apply flex flex-col gap-4 absolute right-2 top-14 items-end
}

.filter-form {
  @apply text-[#3a3a3e] text-base px-4 py-4 backdrop-blur-sm z-0 flex flex-col gap-2 rounded-lg w-fit h-fit shadow-blue-300/50 shadow-sm bg-gradient-to-b from-slate-50 via-transparent to-slate-50
  /* bg-[#3a3a3e]/10 */
}

.legend {
  @apply text-[#3a3a3e] font-semibold text-base px-4 py-4 backdrop-blur-sm z-0 flex gap-2 rounded-lg h-fit items-center bg-[#3a3a3e]/10 w-full
}

.blue-circle {
  width: 20px;
  height: 20px;
  border-radius: 20%;
  background-color: rgba(10, 110, 189, 1.000);
}

.green-circle {
  width: 20px;
  height: 20px;
  border-radius: 20%;
  background-color: rgba(22,255,0,1.000);
}
.purple-circle {
  width: 20px;
  height: 20px;
  border-radius: 20%;
  background-color: rgba(101,39,190,1.000);
}

.red-circle {
  width: 20px;
  height: 20px;
  border-radius: 20%;
  background-color: rgba(243,21,89,1.000);
}

.outlined-circle {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: transparent;
  border: 2px solid red;
}
.vehicle-info {
  @apply     
    shadow-sm
    shadow-blue-300/50
    backdrop-blur-md
    bg-gradient-to-b from-slate-50/80
    rounded-lg w-fit h-full px-4 py-6 gap-2 flex flex-col
    min-w-[360px]
    cursor-pointer
    select-none
}

.active {
  @apply flex  !important
}

.content {
  @apply hidden h-fit flex-col
  text-left gap-4 mb-2 
}
/* drop-shadow-[0_0_6px_5px_rgba(0,0,0,0.05)] */
</style>
