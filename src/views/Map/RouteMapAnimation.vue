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
          <!-- <div class="grid grid-cols-1 px-3 py-2 border-b border-[#3a3a3e] cursor-default mb-6 gap-4">
            <div class="flex gap-2 w-full text-left items-center" v-for="(item, index) in vehicle.devices">
              <input class="cursor-pointer w-4" type="checkbox" v-model="selectedVariant" :name="item.imeiNumber"
                :disabled="geoDataStore.status.isError" @change="hideRoute" :value="item.imeiNumber">
              <label :for="item.type" class="w-full items-center flex gap-4 font-semibold cursor-default">
                {{ item.type }}
              </label>
              <div :class="{ 'blue-circle': index == 0, 'green-circle': index == 1 , 'purple-circle': index == 2 , 'red-circle': index == 3 }"></div>
            </div>
          </div> -->
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
      <h2 class="select-none">Event</h2>
      <h2 class="select-none">{{isPlay}}</h2>
    </div>
  </div>
  <div class="absolute left-14 bottom-2 z-50 bg-[#fefefe] rounded-lg p-4 flex gap-2">
    <div class="grid grid-cols-1 px-3 py-2 cursor-default gap-4">
      <div class="flex gap-2 w-full text-left items-center" v-for="(item, index) in vehicle.devices">
        <input class="cursor-pointer w-4" type="checkbox" v-model="selectedVariant" :name="item.imeiNumber"
          :disabled="geoDataStore.status.isError" @change="hideRoute" :value="item.imeiNumber">
        <label :for="item.type" class="w-full items-center flex gap-4 font-semibold cursor-default">
          {{ item.type }}
        </label>
        <div :class="{ 'blue-circle': index == 0, 'green-circle': index == 1 , 'purple-circle': index == 2 , 'red-circle': index == 3 }"></div>
        <div class="cursor-pointer shadow-lg p-1 rounded-full" @click="renderPoints(item.imeiNumber, index)" :class="{ 'disable-svg': isPlay[index] == true || layers[index] == undefined }">
          <svg v-if="!viewPoints[index]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 10.143C4 5.646 7.582 2 12 2C16.418 2 20 5.646 20 10.143C20 14.605 17.447 19.813 13.463 21.674C13.0051 21.8884 12.5056 21.9996 12 21.9996C11.4944 21.9996 10.9949 21.8884 10.537 21.674C6.553 19.812 4 14.605 4 10.144V10.143Z" stroke="black" stroke-width="1.5"/>
            <path d="M9.5 10H14.5M12 12.5V7.5" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-if="viewPoints[index]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 10.143C4 5.646 7.582 2 12 2C16.418 2 20 5.646 20 10.143C20 14.605 17.447 19.813 13.463 21.674C13.0051 21.8884 12.5056 21.9996 12 21.9996C11.4944 21.9996 10.9949 21.8884 10.537 21.674C6.553 19.812 4 14.605 4 10.144V10.143Z" stroke="black" stroke-width="1.5"/>
            <path d="M9 10H15" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="cursor-pointer shadow-lg p-1 rounded-full" @click="startPlayBack(item.imeiNumber, index)" :class="{ 'disable-svg': isPlay[index] == true || layers[index] == undefined }">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 16C13.671 16 15 14.669 15 13C15 11.331 13.671 10 12 10C10.329 10 9 11.331 9 13C9 14.669 10.329 16 12 16Z" fill="black"/>
            <path d="M20.817 11.186C20.5814 10.0344 20.1209 8.94048 19.462 7.967C18.8146 7.00928 17.9897 6.18442 17.032 5.537C16.0584 4.87833 14.9646 4.41789 13.813 4.182C13.2081 4.05933 12.5922 3.99901 11.975 4.002V2L8 5L11.975 8V6.002C12.459 6 12.943 6.046 13.41 6.142C14.305 6.32541 15.1552 6.68321 15.912 7.195C16.6584 7.69824 17.3008 8.34063 17.804 9.087C18.5853 10.2422 19.002 11.6054 19 13C18.9998 13.9359 18.8128 14.8623 18.45 15.725C18.2735 16.1405 18.0579 16.5383 17.806 16.913C17.5531 17.2854 17.2659 17.6332 16.948 17.952C15.98 18.9182 14.7511 19.5809 13.412 19.859C12.4807 20.047 11.5213 20.047 10.59 19.859C9.69456 19.6754 8.84404 19.3173 8.087 18.805C7.34148 18.3022 6.6998 17.6605 6.197 16.915C5.41656 15.7585 4.9997 14.3952 5 13H3C3.00106 14.7937 3.53689 16.5463 4.539 18.034C5.18685 18.9901 6.01086 19.8142 6.967 20.462C8.45262 21.4675 10.2061 22.0033 12 22C12.6093 21.9999 13.217 21.9386 13.814 21.817C14.9647 21.5794 16.0579 21.1191 17.032 20.462C17.5103 20.1397 17.956 19.7717 18.363 19.363C18.7705 18.9544 19.1388 18.5084 19.463 18.031C20.4676 16.5458 21.0031 14.7931 21 13C20.9999 12.3907 20.9386 11.783 20.817 11.186Z" fill="black"/>
          </svg>
        </div>
        <div class="cursor-pointer shadow-lg p-1 rounded-full" :class="{ 'disable-svg': isPlay[1 - index] || layers[index] == undefined || isStartPlayBack[index] == false }">
          <svg v-if="!isPlay[index]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" @click="playPause(index)" >
            <path d="M8 5.13965V19.1396L19 12.1396L8 5.13965Z" fill="black"/>
          </svg>
          <svg v-if="isPlay[index]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" @click="playPause(index)">
            <path d="M14 19V5H18V19H14ZM6 19V5H10V19H6Z" fill="black"/>
          </svg>
        </div>
      </div>
    </div>


    
  </div>
</template>

<script setup>

import { Map, View, Overlay } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import { Style, Circle, Fill, Stroke } from 'ol/style'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import Select from 'ol/interaction/Select'
import { click, pointerMove, singleClick } from 'ol/events/condition'
import Polyline from 'ol/format/Polyline.js';
import {getVectorContext} from 'ol/render.js';

import BaseButton from '@/components/button/BaseButton.vue'
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useGeoDataStore } from '@/stores/GeoDataStore'
import { useVehiclesStore } from '@/stores/master-data/vehiclesStore'
import { storeToRefs } from 'pinia'
import distanceFilter from '@/composable/distanceFilter.js'
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

const animationFeatureStyle = {
  'startMarker': new Style({
    image: new Circle({
      radius: 7,
      fill: new Fill({color: 'green'}),
      stroke: new Stroke({
        color: 'white',
        width: 2,
      }),
    }),
  }),
  'endMarker': new Style({
    image: new Circle({
      radius: 7,
      fill: new Fill({color: 'red'}),
      stroke: new Stroke({
        color: 'white',
        width: 2,
      }),
    }),
  }),
  'geoMarker': new Style({
    image: new Circle({
      radius: 7,
      fill: new Fill({color: 'black'}),
      stroke: new Stroke({
        color: 'white',
        width: 2,
      }),
    }),
  }),
}

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
let geolocations

async function filterVehicle() {
  loadingStore.startLoading()
  queryParams.value.startTime = new Date(startDate.value + 'T' + startTime.value).toISOString()
  queryParams.value.endTime = new Date(endDate.value + 'T' + endTime.value).toISOString()
  await geoDataStore.getVehicleHistoryDeviceGeo(selectedVehicle.value.id, queryParams.value)
  selectedVariant.value = []
  layers.map(layer => {
    map.removeLayer(layer)
  })
  layers.length = 0
  if (!geoDataStore.status.isError) {
    geolocations = geoDataStore.vehicleHistoryGeo.vehicle.devices
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
          value: route
        })
        lineFeature.setStyle(style[index].line)
        vectorSource = new VectorSource({
          features: [lineFeature],
        }) 
        addDotsMarker(style[index].dot, route)
        const layer = new VectorLayer({
          source: vectorSource,
          visible: true,
          type: geolocation.imeiNumber,
          style: function (feature) {
            return animationFeatureStyle[feature.get('type')];
          },
        })

        layers.push(layer)
        map.addLayer(layer)
        map.getView().fit(lineString.getExtent(), {
          padding: [50, 50, 50, 50],
        })
      }
    })
    console.log(layers)
  }
  console.log('init', selectedVariant.value)

  //route interaction
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
        console.log(selectedFeature)
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

function addDotsMarker(color, data) {
  console.log(data)
  for (let index = 0; index < data.length; index++) {
    const { latitude, longitude, eventIo } = data[index]
    const marker = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
      value: data[index],
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
    layers[index]
    vectorSource.addFeature(marker)
  }
}

async function ressurectPoints(color, geolocation, layersIndex) {
  let filteredData = geolocation.history.filter(geo => geo.latitude != 0)
  let route = distanceFilter.filter(minimumDistance, filteredData).route
  if (route.length != 0) {
    for (let index = 0; index < route.length; index++) {
      const { latitude, longitude, eventIo } = route[index]
      const marker = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
        value: route[index],
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
      } else if (index === route.length - 1) {
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
      layers[layersIndex].getSource().addFeature(marker)
      // vectorSource.addFeature(marker)
    }
  }

}


// Code under here is test

//playback feature
const isPlay = ref([false,false])
const viewPoints = ref([true, true])
const isStartPlayBack = ref([false, false])

function startPlayBack(imei, index) {
  isStartPlayBack.value[index] = true
  removePoints(imei, index)
  markerAnimation(index)
}

function removePoints(imei, index) {
  viewPoints.value[index] = false
  layers.forEach((value) => {
    if (value.values_.type == imei) {
      const featuresToRemove = value.getSource().getFeatures().filter((feature) => {
        return feature.getGeometry().getType() === 'Point'
      })
      featuresToRemove.forEach((feature) => {
        value.getSource().removeFeature(feature)
      })
    }
  })
}

function playPause(index) {
  isPlay.value[index] = !isPlay.value[index]
}

function renderPoints(imei, index) {
  isStartPlayBack.value[index] = false
  viewPoints.value[index] = !viewPoints.value[index]
  if (!viewPoints.value[index]) {
    removePoints(imei)
  } else {
    removePoints(imei)
    ressurectPoints(style[index].dot, geolocations[index], index)
  }
}

function hideRoute() {
  layers.forEach((value) => {
    if (selectedVariant.value.includes(value.values_.type)) {
      console.log('yes')
      value.setVisible(true)
    } else {
      console.log('no')
      value.setVisible(false)
    }
  })
}

async function markerAnimation(index) {
  isPlay.value[index] = false
  const lineFeature = layers[index].getSource().getFeatures().filter((feature) => {
    return feature.getGeometry().getType() === 'LineString'
  })
  const pointsValue = lineFeature[0].get('value')
  console.log(pointsValue)
  const lineString = lineFeature[0].getGeometry()

  let position = new Point (lineString.getFirstCoordinate())
  console.log(position)

  const startMarker = new Feature({
    type: 'startMarker',
    geometry: new Point(lineString.getFirstCoordinate()),
  })
  const endMarker = new Feature({
    type: 'endMarker',
    geometry: new Point(lineString.getLastCoordinate()),
  })
  const geoMarker = new Feature({
    type: 'geoMarker',
    geometry: position,
  })
  layers[index].getSource().addFeatures([geoMarker, startMarker, endMarker])

  //animation
  let count = 0
  let animationFrameId = [null,null]

  async function moveFeature(event) {
    const coordinates = lineString.getCoordinates()
    // Increment count to move to the next coordinate
    count = (count + 1) % coordinates.length
    const currentCoordinate = coordinates[count]
    // console.log(coordinates, count)
    position.setCoordinates(currentCoordinate)
    geoMarker.set('value', pointsValue[count-1])
    geoMarker.setStyle(animationFeatureStyle.geoMarker)
    geoMarker.setGeometry(position)

    // If the animation reaches the end, stop the animation
    if (count === coordinates.length - 1) {
      stopAnimation()
    } else {
      map.render()
    }
  }

  function startAnimation() {
    animationFrameId[index] = setInterval(moveFeature, 100)
    // hide geoMarker and trigger map render through change event
    // geoMarker.setGeometry(null);
    console.log(animationFrameId[index])
  }

  function stopAnimation() {
    // Keep marker at current animation position
    clearInterval(animationFrameId[index])
    geoMarker.setGeometry(position)
    console.log(animationFrameId[index])
  }

  watch(
    () => isPlay.value,
    (newArray, oldArray) => {
      console.log('Array changed:', newArray);
      console.log('Old array:', oldArray);
      if (newArray[index]) {
        startAnimation()
      } else {
        stopAnimation()
      }
    },
    { deep: true }
  )
}

onUnmounted(() => {
  clearInterval(animationFrameId)
})

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

.disable-svg {
  @apply cursor-none pointer-events-none opacity-40
}
/* drop-shadow-[0_0_6px_5px_rgba(0,0,0,0.05)] */
</style>
