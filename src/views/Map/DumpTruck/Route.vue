<template>
  <MapLoading :loading="loadingStore.loading"/>
  <div ref="mapContainer" class="map-container"></div>
  <div id="popup" title="myproject" class="ol-popup">
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
    <div id="popup-content">
    </div>
  </div>
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
import { useMasterDataStore } from '@/stores/MasterDataStore'
import { useGeoDataStore } from '@/stores/GeoDataStore'
import Select from 'ol/interaction/Select'
import { pointerMove, singleClick } from 'ol/events/condition'
import { useMapLoadingStore } from '@/stores/MapLoadingStore'
import MapLoading from '@/components/MapLoading.vue'

let map
let popupOverlay
const isOpen = ref([false,false])
const mapContainer = ref(null)
const geoDataStore = useGeoDataStore()
const masterDataStore = useMasterDataStore()
const vehicleStatusStore = useVehicleStatus()
const loadingStore = useMapLoadingStore()
const selectedVehicle = ref({imei:null, registrationNumber:null})
let dataInterval
const mergedList = ref({})
onMounted( async () => {
  await masterDataStore.getVehicles()
  // selectedVehicle.value = {id: masterDataStore.vehicles[0].id, registrationNumber: masterDataStore.vehicles[0].registrationNumber}
  initializeMap()
  getCoordinates()
  dataInterval = setInterval(getCoordinates, 5000)
})  

onUnmounted( async () => {
  clearInterval(dataInterval)
})

function toggleAccordion(index) {
  isOpen.value[index] = !isOpen.value[index]
  console.log(isOpen.value)
}
function initializeMap() {
  map = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat([0, 0]),
      zoom: 5,
    }),
    controls:[]
  })
  popupOverlay = new Overlay({
    element: document.getElementById('popup'),
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  })
  map.addOverlay(popupOverlay)
  const selectInteraction = new Select({
    condition: pointerMove,
    style: null,
  })
  
  selectInteraction.on('select', (event) => {
    const selectedFeature = event.selected[0]
    if (selectedFeature) {
      const coordinates = selectedFeature.getGeometry().getCoordinates()
      let variant = selectedFeature.get('value').variant.name
      let imei = selectedFeature.get('value').lastData.imei
      let popupContent = 'GPS Model: ' + variant + '<br>' + 'IMEI Number:' + imei
      document.getElementById('popup').innerHTML = popupContent
      popupOverlay.setPosition(coordinates)
    } else {
      popupOverlay.setPosition(undefined)
    }
  })
  map.addInteraction(selectInteraction)
}

let isRequestPending = false

async function getCoordinates() {
  watch(selectedVehicle, (newValue, oldValue) => {
  if (newValue.imei !== oldValue.imei || newValue.registrationNumber !== oldValue.registrationNumber) {
    loadingStore.startLoading()
    clearLayer()
  }
  })

  if (isRequestPending) {
    return
  }
  isRequestPending = true
  await geoDataStore.getVehicleLastDeviceGeo(selectedVehicle.value.id)
  await vehicleStatusStore.getLastVehicleStatus(selectedVehicle.value.id)
  mergedList.value = geoDataStore.vehicleLastGeo.devices.map(data => {
    return {
      geo : data,
      status : vehicleStatusStore.vehicleStatus.devices.find(statusData => statusData.imei === data.imei)
    }
  })

  const vectorSource = new VectorSource()
  let geolocations = geoDataStore.vehicleLastGeo.devices

  geolocations.forEach((geolocation,index) => {
    let angleInRadians = (geolocation.lastData.angle * Math.PI) / 180

    const feature = new Feature({
      geometry: new Point(fromLonLat([geolocation.lastData.longitude, geolocation.lastData.latitude])),
      value: geolocation,
    })
    let scale = 10
    let offset = 350
    if (index == 0) {
      let radiusHDOP = (geolocation.lastData.radius * map.getView().getZoom() * scale) - offset
      if (radiusHDOP <= 1 ) {
        radiusHDOP = 1
      }
      const point = new Style({
        image: new Circle({
          radius: 10,
          fill: new Fill({ color: 'rgba(10,110,189,1.000)' }),
        }),
      })
      const HDOPArea = new Style({
        image: new Circle({
          radius: radiusHDOP,
          fill: new Fill({ color: 'rgba(10,110,189,0.1)' }),
          stroke: new Stroke({ color: 'rgba(10,110,189,0.5)', width: 1, lineCap: 'butt'}),
        }),
      })
      feature.setStyle([HDOPArea,point])
    } else {
      let radiusHDOP = (geolocation.lastData.radius * map.getView().getZoom() * scale) - offset
      if (radiusHDOP <= 1 ) {
        radiusHDOP = 1
      }
      const point = new Style({
        image: new Circle({
          radius: 10,
          fill: new Fill({ color: 'rgba(0,223,162,1.000)' }),
        }),
      })
      const HDOPArea = new Style({
        image: new Circle({
          radius: radiusHDOP,
          fill: new Fill({ color: 'rgba(0,223,162,0.1)' }),
          stroke: new Stroke({ color: 'rgba(0,223,162,0.5)', width: 1, lineCap: 'butt'}),
        }),
      })
      feature.setStyle([HDOPArea,point])
    }
    vectorSource.addFeature(feature)
  })

  clearLayer()
  let vectorLayer = new VectorLayer({
    source: vectorSource,
  })

  map.addLayer(vectorLayer)

  
  if (geolocations.length > 1) {
    let midPoint
    for (let index = 0; index < geolocations.length-1; index++) {
      let midpointX = (parseFloat(geolocations[index].lastData.longitude) + parseFloat(geolocations[index+1].lastData.longitude)) / 2
      let midpointY = (parseFloat(geolocations[index].lastData.latitude) + parseFloat(geolocations[index+1].lastData.latitude)) / 2
      midPoint = [midpointX,midpointY]
    }
    map.getView().setCenter(fromLonLat([geolocations[0].lastData.longitude, geolocations[0].lastData.latitude]))
  } else {
    map.getView().setCenter(fromLonLat([geolocations[0].lastData.longitude, geolocations[0].lastData.latitude]))
  }

  
  isRequestPending = false
  loadingStore.stopLoading()

}



function clearLayer(){
  map.getLayers().forEach((layer) => {
    if (layer instanceof VectorLayer) {
      map.removeLayer(layer);
    }
  })
}
</script>

<style scoped>
.map-container {
  @apply w-full h-full
}

.ol-popup {
    position: absolute;
    background-color: white;
    /*--webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));*/
    filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 280px;
    margin-bottom: 10px;

}
.ol-popup:after, .ol-popup:before {
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
  @apply  px-3 py-2 cursor-pointer
          border-b border-[#3a3a3e]
          bg-transparent
          outline-none
} 
.filter-form {
  @apply 
    text-[#3a3a3e] text-base px-4 py-4
    absolute left-[70px] top-[72px] z-0
    flex flex-col gap-2
    rounded-lg w-fit h-fit
    shadow-blue-300/50
    shadow-sm
    backdrop-blur-sm
  /* bg-slate-50/40 */
    bg-gradient-to-b from-slate-50/80
    /* bg-[#3a3a3e]/10 */
}

.vehicle-info {
  @apply     
    shadow-sm
    shadow-blue-300/50
    backdrop-blur-md
    bg-gradient-to-b from-slate-50/80
    rounded-lg w-fit h-full px-4 py-6 gap-2 flex flex-col
    min-w-[260px]
    cursor-pointer
    select-none
}

.active {
  @apply flex !important
}

.content {
  @apply hidden h-fit flex-col
  text-left gap-4 mb-2 
}
</style>
