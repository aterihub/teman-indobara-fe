<template>
  <alert :message="geofencesStatus.message" :modalActive="modalActive" :isError="geofencesStatus.isError"/>


  <MapLoading :loading="loadingStore.loading"/>
  <div class="grid grid-cols-3 w-full gap-4">
    <div ref="mapContainer" class="map-container col-span-2 relative">
  <transition name="fade">
    <div class="modal" v-show="isOpen">
      <transition name="drop-in">
        <div class="modal-inner" v-show="isOpen">
          <div class="modal-content">
            <h1 class="title">Add Geofence Configuration</h1>
            <VeeForm v-slot="{ handleSubmit }" as="div" ref="form" >
            <form  @submit="handleSubmit($event, onSubmit)" class="form-wrapper" >
              <BaseInput required name="name" type="text" placeholder="Define area name" class="outlined" label="Area Name"/>
              <div class="flex flex-col gap-1 text-left">
                <label for="operand" class="text-xs font-bold">Operand</label>
                <div class="select-option ">
                  <select name="operand" v-model="operand" class="cursor-pointer bg-[#F2F2F2] w-full" required>
                    <option value="0">On Exit</option>
                    <option value="1">On Enter</option>
                    <option value="2">On Both</option>
                  </select> 
                </div>
              </div>
              <div class="checkbox-wrapper"> 
                <label class="cursor-pointer" for="eventualRecord" >
                  Eventual record
                </label>
                <input id="eventualRecord" type="checkbox" v-model="eventualRecord"> 
              </div>
              <BaseInput required name="frameBorder" type="number" max="1000000" placeholder="0 to 1000000" class="outlined" label="Frame Border"/>
              <BaseInput required name="maxAllowedSpeed" type="number" max="1000" placeholder="0-1000" class="outlined" label="Max Speed"/>
              <BaseInput required name="notes" type="text" placeholder="Type notes here" class="outlined" label="Notes"/>
              <div class="flex justify-between gap-10">
                <BaseButton type="button" class="filled__softblue" :label="cancelLabel" @click="cancelForm"/>
                <BaseButton type="submit" class="filled__green" :label="registerLabel"  />
              </div>
            </form>
            </VeeForm>
          </div>
        </div>
      </transition>
    </div>
  </transition>
      <transition name="drop-in">
        <div v-if="isEditGeofence" class="absolute z-10 bg-[#353535]/50 w-full flex items-center py-4 text-white text-base">
          <div class="mx-auto">
            <p>Press <span class="font-semibold">ESC </span>to Undo</p> 
            <p>Press <span class="font-semibold">Enter </span>to Finish Drawing</p> 
          </div>
        </div>
      </transition>
    </div>
    <div class="flex flex-col gap-4 w-full">
      <div class="flex gap-4">
        <div v-if="!isEditGeofence" class="w-full">
          <Button type="button" class="outlined__green" label="Edit Geofence" @click="addNewGeofence" />
        </div>
        <div v-if="isEditGeofence" class="w-full">
          <Button type="button" class="outlined__green" label="Done" @click="addNewGeofence" />
        </div>
        <div v-if="!isEditGeofence" class="w-full">
          <Button type="button" class="filled__green" :label="uploadGeofenceLabel" @click="uploadGeofence" />
        </div>
      </div>
      <EasyDataTable
        v-model:items-selected="itemsSelected"
        :rows-per-page="10"
        hide-rows-per-page
        table-class-name="customize-table"
        :headers="header"
        :items="geofences"
        theme-color="#1363df"        
        >
        <template #item-action="item">
          <div class="action" v-if="isEditGeofence">
            <svg class="action-btn" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="deleteGeofence(item)">
              <path d="M8.4375 4.3125H8.25C8.35313 4.3125 8.4375 4.22813 8.4375 4.125V4.3125H15.5625V4.125C15.5625 4.22813 15.6469 4.3125 15.75 4.3125H15.5625V6H17.25V4.125C17.25 3.29766 16.5773 2.625 15.75 2.625H8.25C7.42266 2.625 6.75 3.29766 6.75 4.125V6H8.4375V4.3125ZM20.25 6H3.75C3.33516 6 3 6.33516 3 6.75V7.5C3 7.60313 3.08437 7.6875 3.1875 7.6875H4.60312L5.18203 19.9453C5.21953 20.7445 5.88047 21.375 6.67969 21.375H17.3203C18.1219 21.375 18.7805 20.7469 18.818 19.9453L19.3969 7.6875H20.8125C20.9156 7.6875 21 7.60313 21 7.5V6.75C21 6.33516 20.6648 6 20.25 6ZM17.1398 19.6875H6.86016L6.29297 7.6875H17.707L17.1398 19.6875Z"/>
            </svg>
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
import { ref, onMounted, onBeforeUnmount , watch, watchEffect } from 'vue'
import Button from '@/components/button/BaseButton.vue'
import { Form as VeeForm } from 'vee-validate'
import BaseInput from '@/components/input/BaseInput.vue'
import BaseButton from '@/components/button/BaseButton.vue'
import { useLocalStorage } from '@vueuse/core'

//maps
import { Map, View, Overlay } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { fromLonLat } from 'ol/proj'
import { toLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Circle, Fill, Stroke } from 'ol/style'
import Icon from 'ol/style/Icon'
import Select from 'ol/interaction/Select'
import { pointerMove, singleClick } from 'ol/events/condition'
import {Draw, Modify, Snap} from 'ol/interaction.js'
import Polygon from 'ol/geom/Polygon';
import Text from 'ol/style/Text';

import { useMapLoadingStore } from '@/stores/MapLoadingStore'
import MapLoading from '@/components/MapLoading.vue'
import { useGeofencesStore } from '@/stores/geofences/geofencesStore'
import { storeToRefs } from 'pinia'

const geofencesStore = useGeofencesStore()
const { geofences, geofence, geofencesStatus, getGeofencesIsLoading, createGeofenceIsLoading } = storeToRefs(useGeofencesStore())
const header = [
      { text: "Name", value: "name" },
      { text: "Notes", value: "notes" },
      { text: "", value: "action", width:30 },
    ]
const items = ref([])

let map
let popupOverlay
let drawInteraction, snapInteraction, modifyInteraction

const mapContainer = ref(null)
const loadingStore = useMapLoadingStore()

const initialFeatures = ref([])

const polygonStyle = new Style ({
  fill: new Fill({
    color: 'rgba(100, 255, 0, 0.3)',
  }),
  stroke: new Stroke({
    color: 'rgba(251, 139, 36, 0.8)',
    width: 1,
  }),
})

const polygonStyleHidden = new Style ({
  fill: new Fill({
    color: 'transparent',
  }),
})
onMounted( async () => {
  await geofencesStore.getGeofences()
  initializeMap()
})

const drawVector = ref(null)

function drawPolygon() {
  // CODE UNDER TEST
  drawVector.value.getSource().clear()
  const features = []
  if (geofences.value.length !== 0) {
    geofences.value.map( geofence => 
    {
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
        notes: geofence.notes,
        operand: geofence.operand,
        eventualRecord: geofence.eventualRecord,
        maxAllowedSpeed: geofence.maxAllowedSpeed,
        frameBorder: geofence.frameBorder
      }
      initialFeatures.value.push(obj)
      let itemsObj =
      {
        id: geofence.id,
        name: geofence.name,
        operand: geofence.operand,
        eventualRecord: geofence.eventualRecord,
        frameBorder: geofence.frameBorder,
        coordinates: geofence.coordinates,
        maxAllowedSpeed: geofence.maxAllowedSpeed,
        notes: geofence.notes,
      }
      itemsSelected.value.push(itemsObj)

    })
    for (const initialFeature of initialFeatures.value) {
      const polygonStyle = new Style ({
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
  let isModifying = false;
  modifyInteraction = new Modify({maxPoints:10,source: drawVector.value.getSource()});
  modifyInteraction.on('modifystart', function (event){
    isModifying = true;
    let coordinatesLength = event.features.array_[0].values_.geometry.getCoordinates()[0].length
    if (coordinatesLength > 10) {
      console.log('You cannot add more than 10 points.')
    }
    console.log('modify start')
  })
  modifyInteraction.on('modifyend', function (){
    isModifying = false;
    console.log('modify end')
  })

  let isDrawing = false;
  drawInteraction = new Draw({
    type: 'Polygon',
    source: drawVector.value.getSource(),
    trace: true,
    style: {
      'stroke-color': 'rgba(251, 139, 36, 0.5)',
      'stroke-width': 1.5,
      'fill-color': 'rgba(251, 139, 36, 0.25)',
      'circle-radius': 6,
      'circle-fill-color': 'rgba(251, 139, 36, 0.5)',
    },
    maxPoints: 10
  })
  snapInteraction = new Snap({source: drawVector.value.getSource()});
  drawInteraction.on('drawstart', function() {
    isDrawing = true
    console.log('drawing started')
  })

  drawInteraction.on('drawend', (event) => {
    console.log('drawing end')
    isDrawing = false
    drawInteraction.finishDrawing()
    addGeofenceTag(event.feature)
  })


// Add this event listener when initializing the map
document.addEventListener('keydown', function (event) {
  // Check if the "Esc" key is pressed
  if (event.key === 'Escape') {
    if (isDrawing) {
      drawInteraction.removeLastPoint()
    }
  }
  if (event.key === 'Enter') {
    if (isDrawing) {
      drawInteraction.dispatchEvent('drawend')
    }
  }
});
}

const isEditGeofence = ref(false)

function addNewGeofence() {
  isEditGeofence.value = !isEditGeofence.value
  if (isEditGeofence.value) {
    map.addInteraction(drawInteraction)
    map.addInteraction(snapInteraction)
    // map.addInteraction(modifyInteraction)
  } else {
    map.removeInteraction(drawInteraction)
    map.removeInteraction(snapInteraction)
    // map.removeInteraction(modifyInteraction)
  }
}

function uploadGeofence() {
  uploadButtonClick.value = ++uploadButtonClick.value
  switch (uploadButtonClick.value) {
    case 1:
    uploadGeofenceLabel.value = 'Proceed?'
      break;
    case 2:
    uploadButtonClick.value = 0
    uploadGeofenceLabel.value = 'Upload Geofence'
      break;
  }

}

const itemsSelected = ref([])

const isOpen = ref(false)
const form = ref(null)
const operand = ref('0')
const eventualRecord = ref(false)
const uploadGeofenceLabel = ref('Upload Geofence')
const cancelLabel = ref('CANCEL')
const registerLabel = ref('SUBMIT')
const regButtonClick = ref(0)
const cancelButtonClick = ref(0)
const uploadButtonClick = ref(0)
const modalActive = ref(false)
let currentFeature

const closeNotification = () => { modalActive.value = false }
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

function addGeofenceTag(feature) {
  console.log(feature)
  isOpen.value = true
  if (feature !== undefined) {
    currentFeature = feature
  }
}
function cancelForm() {
  cancelButtonClick.value = ++cancelButtonClick.value
  switch (cancelButtonClick.value) {
    case 1:
    cancelLabel.value = 'The entered data will be lost!'
      break;
    case 2:
    drawVector.value.getSource().removeFeature(currentFeature)
    isOpen.value = false
    form.value.resetForm()
    cancelButtonClick.value = 0
    cancelLabel.value = 'CANCEL'
      break;
  }

}


const onSubmit = async (values, { resetForm }) => {
  let projectedCoordinates = currentFeature.getGeometry().getCoordinates()[0]
  let lonLatCoordinates = projectedCoordinates.map(coordinate => {
    return toLonLat(coordinate)
  })
  let latLongCoordinates = lonLatCoordinates.map(coordinate => {
    return [coordinate[1], coordinate[0]]
  })
  let payload = ref({})
  payload.value = values
  payload.value.coordinates = latLongCoordinates.slice(0, latLongCoordinates.length - 1)
  payload.value.eventualRecord = eventualRecord.value
  // payload.value.operand = operand.value
  payload.value.operand = parseInt(operand.value)
  regButtonClick.value = ++regButtonClick.value
    if (regButtonClick.value == 1) {
      registerLabel.value = 'the data entered is correct?'
    }

    if (regButtonClick.value == 2) {
      const polygonStyle = new Style ({
        fill: new Fill({
          color: 'rgba(100, 255, 0, 0.3)',
        }),
        stroke: new Stroke({
          color: 'rgba(251, 139, 36, 0.8)',
          width: 1,
        }),
        text: new Text({
          text: payload.value.name,
          fill: new Fill({
            color: 'black',
          }),
          offsetY: 0, // Adjust the offset if needed
          textAlign: 'center',
          font: 'bold 14px sans-serif',
        }),
      })

      currentFeature.setStyle(polygonStyle)
      currentFeature.set('name', payload.value.name)
      await geofencesStore.createGeofence(payload.value)
      itemsSelected.value.push(geofence.value)
      modalActive.value = true
      if (geofencesStatus.value.isError) {
        drawVector.value.getSource().removeFeature(currentFeature)
      } else {
        currentFeature.set('id', geofence.value.id)
      }
      setTimeout(closeNotification, 3000)
      resetForm()
      registerLabel.value = 'SUBMIT'
      regButtonClick.value = 0
      cancelButtonClick.value = 0
      isOpen.value = false
      await delay(500)
      await geofencesStore.getGeofences()
    }
}

async function deleteGeofence(item) {
  await geofencesStore.deleteGeofence(item.id)
  await geofencesStore.getGeofences()
  let selectedFeature = drawVector.value.getSource().getFeatures().filter((data) =>  data.id !== item.id)
  console.log(selectedFeature)
  drawVector.value.getSource().removeFeature(selectedFeature)
  itemsSelected.value = itemsSelected.value.filter((data) =>  data.id !== item.id)
  modalActive.value = true
  setTimeout(closeNotification, 3000)
}

watch(itemsSelected, (newValue, oldValue) => {
  if (newValue.length < oldValue.length) {
    hidePolygon()
  } else if (newValue.length >= oldValue.length) {
    showPolygon()
  }
  },
  { deep: true }
)

async function showPolygon() {
  let features = drawVector.value.getSource().getFeatures()
  console.log(features)
  const selectedFeatures = features.filter(feature => itemsSelected.value.some(item => feature.values_.id === item.id))
  selectedFeatures.forEach((selectedFeature) => {
    const polygonStyle = new Style ({
      fill: new Fill({
        color: 'rgba(100, 255, 0, 0.3)',
      }),
      stroke: new Stroke({
        color: 'rgba(251, 139, 36, 0.8)',
        width: 1,
      }),
      text: new Text({
        text: selectedFeature.values_.name,
        fill: new Fill({
          color: 'black',
        }),
        offsetY: 0, // Adjust the offset if needed
        textAlign: 'center',
        font: 'bold 14px sans-serif',
      }),
    })
    selectedFeature.setStyle(polygonStyle)
  })

}
async function hidePolygon() {
  let features = drawVector.value.getSource().getFeatures()
  const unselectedFeatures = features.filter(feature => !itemsSelected.value.some(item => feature.values_.id === item.id))
  unselectedFeatures.forEach((unselectedFeature) => {
    unselectedFeature.setStyle(polygonStyleHidden)
  })
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height:100%;
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


.filter-form {
  @apply 
    text-[#3a3a3e] text-base px-4 py-4
    absolute 
    right-2 top-14
    flex flex-col gap-2
    rounded-lg 
    w-fit h-fit
    shadow-blue-300/50
    shadow-sm
    bg-white
    /* backdrop-blur-sm */
  /* bg-slate-50/40 */
    /* bg-gradient-to-b from-slate-50/80 */
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

.customize-table {
  --easy-table-border:	1px solid #EBEBED;	
  --easy-table-header-font-size: 14px;
  --easy-table-header-background-color: #FAFAFA;
  --easy-table-header-font-color:	#015A6A;
  --easy-table-header-height:	40px;
  --easy-table-header-item-padding: 16px 24px;

  --easy-table-body-row-font-size:	14px;
  --easy-table-body-font-color:	#3A3A3E;
  --easy-table-body-row-height:	46px;
  --easy-table-body-item-padding: 0px 24px;

  --easy-table-footer-font-size:	12px;
  --easy-table-footer-height:	40px;
  --easy-table-footer-font-color:	#6E6E78;
  border-collapse: collapse;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}


.title {
    @apply text-left border-b-[1px] pb-[18px] text-[24px] font-normal text-[#8E8E93] mb-6
  }
  

  .message-wrapper {
    @apply flex items-center gap-2
  }
  
  .form-wrapper{
    @apply flex flex-col gap-6
  }

  
.modal {
  @apply
    absolute top-0 left-0 w-full h-full
    overflow-x-hidden overflow-y-auto
    bg-[#ABADAF]/20 z-20
}

.modal-inner {
  @apply 
    max-w-[500px] my-[100px] mx-auto
}

.modal-content {
  @apply 
    relative w-[600px] p-[40px] bg-white gap-[30px] rounded-xl
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
  @apply  px-6 py-3
          outline-none
  rounded-[5px] border border-[#CFCFCF] bg-[#F2F2F2] text-sm 
} 
.checkbox-wrapper {
  @apply flex justify-between
  bg-[#F2F2F2] px-6 py-3 w-full
        rounded-[5px] border border-[#CFCFCF] text-sm 
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
