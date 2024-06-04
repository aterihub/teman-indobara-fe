<template>
  <StreamingModal :isOpen="isStreamingModalPops" @close="streamingModalToggle" title="Launch Streaming"
    :info="selectedDevice" />

  <alert :message="geoDataStore.status.message" :modalActive="modalActive" :isError="geoDataStore.status.isError" />
  <MapLoading :loading="loadingStore.loading" />
  <div ref="mapContainer" class="map-container"></div>
  <div id="popup" title="myproject" class="ol-popup">
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
    <div id="popup-content">
    </div>
  </div>
  <div class="filter-form">
    <h1 class="text-left font-bold text-[10px] sm:text-sm">Filter</h1>
    <div class="flex gap-1 sm:gap-4 items-center">
      <select name="contractorFilter" id="contractorFilter"
        class="outline-none text-[10px] sm:text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit"
        v-model="selectedSite" @change="getContractorsList(selectedSite)">
        <option class="p-2 cursor-pointer" value="0">All Site</option>
        <option class="p-2 cursor-pointer" v-for="site in sites" :value="site">{{ site.name }}</option>
      </select>
      <select name="contractorFilter" id="contractorFilter"
        class="outline-none text-[10px] sm:text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit"
        v-model="selectedContractor">
        <option class="p-2 cursor-pointer" value="0">All Contractor</option>
        <option class="p-2 cursor-pointer" v-for="contractor in contractors" :value="contractor.name">{{ contractor.name
          }}
        </option>
      </select>
      <select name="contractorFilter" id="contractorFilter" v-model="selectedHull"
        class="outline-none text-[10px] sm:text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit">
        <option class="p-2 cursor-pointer" value="0">All Hull</option>
        <option class="p-2 cursor-pointer" v-for="vehicle in hulls" :value="vehicle.number">{{ vehicle.number }}
        </option>
      </select>
      <!-- <select v-model="selectedVehicle" class="select-option">
        <option v-for="item in vehicles" :key="item.id" :value="{id: item.id, registrationNumber: item.registrationNumber}">
          {{ item.name }}
        </option>
      </select>
      <p class="font-bold px-3 py-2 border-b border-[#3a3a3e] w-full cursor-default">{{selectedVehicle.registrationNumber}}</p> -->
    </div>
    <div class="flex justify-start items-center gap-2 text-sm cursor-pointer pt-4">
      <input class="cursor-pointer" type="checkbox" name="showGeofence" id="showGeofence" v-model="showGeofences">
      <label class="cursor-pointer select-none" for="showGeofence">Geofences</label>
    </div>
  </div>
  <!-- <div class="absolute right-2 top-14 flex gap-6">
    <div 
      v-for="(vehicle, index) in geoDataStore.vehicleLastGeo.vehicle.devices" 
      class="vehicle-info"
        @click="toggleAccordion(index)">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-between">
          <h1 class="text-left font-bold text-lg mb-2">Vehicle Information</h1>
        </div>
        <div>
          <button
          class="flex items-center space-x-3"
          :aria-expanded="isOpen[index]"
          :aria-controls="`collapse`"
          >
            <svg
            class="w-3 transition-all duration-200 transform"
            :class="{
              'rotate-180': isOpen[index],
              'rotate-0': !isOpen[index],
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
        :class="{'active': isOpen[index]}">
        <div class="flex justify-between">
          <Indicator :status="vehicle.status.tcpstatus.indicator"/>
          <div class="flex flex-col">
            <label for="batt" class="text-sm text-[#353535]">GPS model</label>
            <h1 class="font-bold text-sm text-[#353535]">{{vehicle.geo.variant.name}}</h1>
          </div>     
          <div class="flex flex-col">
            <label for="batt" class="text-sm text-[#353535]">IMEI number</label>
            <h1 class="font-bold text-sm text-[#353535]">{{vehicle.geo.imeiNumber}}</h1>
          </div> 
        </div>
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">GPS status:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo.fix_flag}}</h1>
        </div> 
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">Latitude:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo.latitude}}</h1>
        </div>    
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">Longitude:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo.longitude}}</h1>
        </div>    
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">Altitude:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo.altitude}}</h1>
        </div>     
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">Angle:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo.angle}}</h1>
        </div>   
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">Satellite number:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo.satellites}}</h1>
        </div>    
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">HDOP:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo.hdop}}</h1>
        </div>   
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">Speed:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo.speed}}</h1>
        </div>    
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">GSM signal:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo.gsm_signal}}</h1>
        </div>    
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">Battery voltage:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo.internal_battery}}</h1>
        </div>   
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">External voltage:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo.external_power}}</h1>
        </div>   
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">Device time:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo._time}}</h1>
        </div>  
        <div class="flex gap-2 justify-between">
          <label for="batt" class="text-sm text-[#353535]">Stored time:</label>
          <h1 class="font-semibold text-sm text-[#353535]">{{vehicle.geo.stored_time}}</h1>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, reactive } from 'vue'
import { Map, View, Overlay } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Circle, Fill, Stroke } from 'ol/style'
import Icon from 'ol/style/Icon'
import { storeToRefs } from 'pinia'
import Indicator from '@/components/Indicator.vue'
import { useVehicleStatus } from '@/stores/StatusStore'
import { useVehiclesStore } from '@/stores/master-data/vehiclesStore'
import { useGeoDataStore } from '@/stores/GeoDataStore'
import Select from 'ol/interaction/Select'
import { click, pointerMove, singleClick } from 'ol/events/condition'
import { useMapLoadingStore } from '@/stores/MapLoadingStore'
import MapLoading from '@/components/MapLoading.vue'
import Polygon from 'ol/geom/Polygon';
import Text from 'ol/style/Text';

import { useHullsStore } from '@/stores/master-data/hullNumberStore'
import { useContractorsStore } from '@/stores/master-data/contractorsStore'
import { useSitesStore } from '@/stores/master-data/sitesStore'
import { useGeofencesStore } from '@/stores/geofences/geofencesStore'

import StreamingModal from '@/components/modal/StreamingModal.vue'

const showGeofences = ref(true)
const selectedDevice = ref({})

async function showPolygon() {
  let features = drawVector.value.getSource().getFeatures()
  console.log(features)
  features.forEach((feature) => {
    const polygonStyle = new Style({
      fill: new Fill({
        color: 'rgba(100, 255, 0, 0.3)',
      }),
      stroke: new Stroke({
        color: 'rgba(251, 139, 36, 0.8)',
        width: 1,
      }),
      text: new Text({
        text: feature.values_.name,
        fill: new Fill({
          color: 'black',
        }),
        offsetY: 0, // Adjust the offset if needed
        textAlign: 'center',
        font: 'bold 14px sans-serif',
      }),
    })
    feature.setStyle(polygonStyle)
  })

}
async function hidePolygon() {
  let features = drawVector.value.getSource().getFeatures()
  features.forEach((feature) => {
    feature.setStyle(polygonStyleHidden)
  })
}

watch(showGeofences, (newValue) => {
  if (!newValue) {
    hidePolygon()
  } else if (newValue) {
    showPolygon()
  }
},
  { deep: true }
)

const sitesStore = useSitesStore()
const { sites } = storeToRefs(useSitesStore())
const contractorsStore = useContractorsStore()
const { contractors } = storeToRefs(useContractorsStore())
const hullNumberStore = useHullsStore()
const { hulls } = storeToRefs(useHullsStore())
const geofencesStore = useGeofencesStore()
const { geofences, geofence, geofencesStatus, getGeofencesIsLoading, geofenceZone, getGeofenceIsLoading, getGeofenceStatus } = storeToRefs(useGeofencesStore())
const selectedSite = ref('0')
const selectedContractor = ref('0')
const selectedHull = ref('0')

const modalActive = ref(false)
const closeNotification = () => {
  modalActive.value = false
}

function getContractorsList(item) {
  if (item !== '0') {
    let params = {
      siteId: item.id
    }
    contractorsStore.getContractors(params)
  } else {
    contractorsStore.getContractors()
  }
}

let map
let popupOverlay
const isOpen = ref([false, false])
const mapContainer = ref(null)
const geoDataStore = useGeoDataStore()
const vehiclesStore = useVehiclesStore()
const { vehicles, vehicle } = storeToRefs(useVehiclesStore())
const vehicleStatusStore = useVehicleStatus()
const loadingStore = useMapLoadingStore()
const selectedVehicle = ref({ imei: null, registrationNumber: null })
let dataInterval
const mergedList = ref({})

function camelToNormalCase(camelCaseString) {
  return camelCaseString
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}

const drawVector = ref(null)
const initialFeatures = ref([])

const polygonStyle = new Style({
  fill: new Fill({
    color: 'rgba(100, 255, 0, 0.3)',
  }),
  stroke: new Stroke({
    color: 'rgba(251, 139, 36, 0.8)',
    width: 1,
  }),
})

const polygonStyleHidden = new Style({
  fill: new Fill({
    color: 'transparent',
  }),
})
function drawPolygon() {
  // CODE UNDER TEST
  let vector = drawVector.value.getSource()
  vector.clear()
  const features = []
  initialFeatures.value = []
  if (geofences.value.length !== 0) {
    geofences.value.map(geofence => {
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
      // let itemsObj =
      // {
      //   id: geofence.id,
      //   geofenceId: geofence.geofenceId,
      //   geofenceIdText: geofence.geofenceIdText,
      //   name: geofence.name,
      //   operand: geofence.operand,
      //   operandText: geofence.operandText,
      //   eventualRecord: geofence.eventualRecord,
      //   frameBorder: geofence.frameBorder,
      //   coordinates: geofence.coordinates,
      //   maxAllowedSpeed: geofence.maxAllowedSpeed,
      //   notes: geofence.notes,
      // }
      // itemsSelected.value.push(itemsObj)
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

onMounted(async () => {
  await sitesStore.getSites()
  selectedSite.value = sites.value[0]
  await contractorsStore.getContractors()
  await hullNumberStore.getHulls()
  await geofencesStore.getGeofences()
  initializeMap()
  getCoordinates()
  dataInterval = setInterval(getCoordinates, 5000)
})

onUnmounted(async () => {
  clearInterval(dataInterval)
})

function toggleAccordion(index) {
  isOpen.value[index] = !isOpen.value[index]
  console.log(isOpen.value)
}

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
  popupOverlay = new Overlay({
    element: document.getElementById('popup'),
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  })
  map.addOverlay(popupOverlay)

  //handle hover on icon
  const selectInteraction = new Select({
    condition: pointerMove,
    style: null,
  })
  selectInteraction.on('select', (event) => {
    const selectedFeature = event.selected[0]
    if (selectedFeature) {
      const geometryType = selectedFeature.getGeometry().getType();
      // Skip if the selected feature is a Polygon
      if (geometryType === 'Polygon') {
        return;
      }
      const coordinates = selectedFeature.getGeometry().getCoordinates()
      let contractor = selectedFeature.get('value').contractor
      let hullNumber = selectedFeature.get('value').hullNumber
      let registrationNumber = selectedFeature.get('value').registrationNumber
      let imei = selectedFeature.get('value').imei
      let fix_flag = selectedFeature.get('value').gnssStatus
      let latitude = selectedFeature.get('value').latitude
      let longitude = selectedFeature.get('value').longitude
      let altitude = selectedFeature.get('value').altitude
      let angle = selectedFeature.get('value').course
      let satellites = selectedFeature.get('value').satellites
      let hdop = selectedFeature.get('value').gnssHdop
      let speed = selectedFeature.get('value').speed
      let gsm_signal = selectedFeature.get('value').gsmSignal
      let internal_battery = selectedFeature.get('value').batteryVoltage
      let external_power = selectedFeature.get('value').externalVoltage
      let stored_time = selectedFeature.get('value').storedTime
      let time = selectedFeature.get('value')._time
      let geofenceId = selectedFeature.get('value').geofenceId
      let event_io = camelToNormalCase(selectedFeature.get('value').eventIo)
      let popupContent =
        'Contractor: ' + contractor + '<br>'
        + 'Hull Number: ' + hullNumber + '<br>'
        + 'Registration Number: ' + registrationNumber + '<br>'
        + 'IMEI Number: ' + imei + '<br>'
        + 'GPS status: ' + fix_flag + '<br>'
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
        + 'Event : ' + event_io + ' <br>'
        + 'Geofence ID : ' + geofenceId + ' <br>'
      document.getElementById('popup').innerHTML = popupContent
      popupOverlay.setPosition(coordinates)
    } else {
      popupOverlay.setPosition(undefined)
    }
  })
  map.addInteraction(selectInteraction)

  //handle click on icon
  const clickInteraction = new Select({
    condition: singleClick,
    style: null,
  })
  clickInteraction.on('select', (event) => {
    selectedDevice.value = {}
    const selectedFeature = event.selected[0]
    if (selectedFeature) {
      const geometryType = selectedFeature.getGeometry().getType();
      // Skip if the selected feature is a Polygon
      if (geometryType === 'Polygon') {
        return;
      }
      console.log(selectedFeature.get('value'))
      selectedDevice.value.imei = selectedFeature.get('value').imei
      selectedDevice.value.hullNumber = selectedFeature.get('value').hullNumber
      isStreamingModalPops.value = true
    } else {
    }
  })
  map.addInteraction(clickInteraction)
}



let isRequestPending = false

async function getCoordinates() {
  watch([selectedSite, selectedContractor, selectedHull], ([newSite, newContractor, newHull], [oldSite, oldContractor, oldHull]) => {
    if (newSite !== oldSite || newContractor !== oldContractor || newHull !== oldHull) {
      loadingStore.startLoading()
      clearLayer()
    }
  })

  if (isRequestPending) {
    return
  }
  isRequestPending = true

  const queryParams = ref({
    startTime: "-1d",
  })
  if (selectedSite.value !== '0') {
    queryParams.value.site = selectedSite.value.name
  }
  if (selectedContractor.value !== '0') {
    queryParams.value.contractor = selectedContractor.value
  }
  if (selectedHull.value !== '0') {
    queryParams.value.hullNumber = selectedHull.value
  }

  console.log(queryParams.value)
  await geoDataStore.getVehicleLastDeviceGeo(queryParams.value)

  const vectorSource = new VectorSource()
  let geolocations = geoDataStore.vehicleLastGeo
  if (geolocations.length > 0) {
    geolocations.forEach((geolocation, index) => {
      let angleInRadians = (geolocation.course * Math.PI) / 180

      const feature = new Feature({
        geometry: new Point(fromLonLat([geolocation.longitude, geolocation.latitude])),
        value: geolocation,
      })
      let scale = 10
      let offset = 350
      if (index == 0) {
        let radiusHDOP = (geolocation.radius * map.getView().getZoom() * scale) - offset
        if (radiusHDOP <= 1) {
          radiusHDOP = 1
        }
        const point = new Style({
          image: new Icon({
            // radius: 10,
            // fill: new Fill({ color: 'rgba(10,110,189,1.000)' }),
            src: require('../../../assets/icon/car-icon.png'),
            scale: 0.15,
            rotation: angleInRadians
          }),
        })
        const HDOPArea = new Style({
          image: new Circle({
            radius: radiusHDOP,
            fill: new Fill({ color: 'rgba(10,110,189,0.1)' }),
            stroke: new Stroke({ color: 'rgba(10,110,189,0.5)', width: 1, lineCap: 'butt' }),
          }),
        })
        feature.setStyle([point])
      } else {
        let radiusHDOP = (geolocation.radius * map.getView().getZoom() * scale) - offset
        if (radiusHDOP <= 1) {
          radiusHDOP = 1
        }
        const point = new Style({
          image: new Icon({
            // radius: 10,
            // fill: new Fill({ color: 'rgba(0,223,162,1.000)' }),
            src: require('../../../assets/icon/car-icon.png'),
            scale: 0.15,
            rotation: angleInRadians
          }),
        })
        const HDOPArea = new Style({
          image: new Circle({
            radius: radiusHDOP,
            fill: new Fill({ color: 'rgba(0,223,162,0.1)' }),
            stroke: new Stroke({ color: 'rgba(0,223,162,0.5)', width: 1, lineCap: 'butt' }),
          }),
        })
        feature.setStyle([point])
      }
      vectorSource.addFeature(feature)
    })

    clearLayer()
    let vectorLayer = new VectorLayer({
      source: vectorSource,
    })

    map.addLayer(vectorLayer)

    if (selectedHull.value !== '0') {
      if (geolocations.length > 1) {
        let midPoint
        for (let index = 0; index < geolocations.length - 1; index++) {
          let midpointX = (parseFloat(geolocations[index].longitude) + parseFloat(geolocations[index + 1].longitude)) / 2
          let midpointY = (parseFloat(geolocations[index].latitude) + parseFloat(geolocations[index + 1].latitude)) / 2
          midPoint = [midpointX, midpointY]
        }
        map.getView().setCenter(fromLonLat([geolocations[0].longitude, geolocations[0].latitude]))
      } else {
        map.getView().setCenter(fromLonLat([geolocations[0].longitude, geolocations[0].latitude]))
      }
    }
  } else {
    modalActive.value = true
    setTimeout(closeNotification, 3000)
  }

  isRequestPending = false
  loadingStore.stopLoading()
}



function clearLayer() {
  map.getLayers().forEach((layer) => {
    if (layer instanceof VectorLayer) {
      const features = layer.getSource().getFeatures();
      const hasPolygons = features.some((feature) => feature.getGeometry() instanceof Polygon);

      if (!hasPolygons) {
        map.removeLayer(layer);
      }
    }
  });
}

/// streaming handler
const isStreamingModalPops = ref(false)

function streamingModalToggle() {
  isStreamingModalPops.value = !isStreamingModalPops.value
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

.filter-form {
  @apply text-[#3a3a3e] text-base px-4 py-4 absolute right-2 top-14 flex flex-col gap-2 rounded-lg w-fit h-fit shadow-blue-300/50 shadow-sm bg-white
  /* backdrop-blur-sm */
  /* bg-slate-50/40 */
  /* bg-gradient-to-b from-slate-50/80 */
  /* bg-[#3a3a3e]/10 */
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
</style>
