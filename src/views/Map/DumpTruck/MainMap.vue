<template>
    <sideNav :isDumptruckActive="true" />
    <div class="bg-[#fefefe] absolute left-14 top-14 w-fit flex h-fit z-10 p-4 rounded-lg">
      <div class="tab-wrapper">
        <h1>Mapping Type</h1>
        <Chip :tabs="tabs" @clicked= "changeNavigation" />
      </div>
      <!-- <div class="tab-wrapper">
        <h1>Filter</h1>
        <div class="flex gap-[14px]">
          <select name="contractorFilter" id="contractorFilter" v-model="selectedContractor" class="text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md">
            <option class="p-2" value="0" >Contractor List</option>
          </select>
        </div>
        <div class="flex gap-[14px]">
          <select name="vehicleFilter" id="vehicleFilter" v-model="selectedVehicle" class="text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md">
            <option class="p-2" v-for="item in vehicleList" :key="item.id" :value="{id: item.id, registrationNumber: item.registrationNumber}">
              {{ item.name }}
            </option>
          </select>
          <p class="font-bold px-3 py-2 border-b border-[#3a3a3e] w-full cursor-default">{{selectedVehicle.registrationNumber}}</p>
        </div>
      </div>
      <div class="tab-wrapper">
        <h1>Details</h1>
        <div class="flex justify-between w-full">
          <div class="flex flex-col gap-10 w-full" v-for="vehicle in 2" v-if="vehicleDetailData.length == 0">
            <div class="flex flex-col gap-2 w-full" v-for="loading in 10">
              <div class="animate-pulse flex space-x-4 w-full">
                <div class="space-y-3 w-full" >
                  <div class="grid grid-cols-2 gap-2 w-full">
                    <div class="h-2 bg-slate-200 rounded col-span-2 w-24"></div>
                    <div class="h-2 bg-slate-200 rounded col-span-2 w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2" v-for="vehicle in vehicleDetailData">
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> GPS Model: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.variant.name }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> IMEI number: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.IMEINumber }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> GPS status: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData.fix_flag }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> Latitude: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData.latitude }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> Longitude: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData.longitude }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> Altitude: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData.altitude }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> Angle: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData.angle }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> Satellite number: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData.satellites }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> HDOP: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData.hdop }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> Speed: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData.speed }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> GSM signal: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData.gsm_signal }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> Battery voltage: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData.internal_battery }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> External voltage: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData.external_power }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]"> Device Time: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData._time }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-[12px] text-[#353535]">Stored Time: </p>
              <p v-if="isVehicleDetailDataReady" class="font-bold text-[12px]">{{ vehicle.geo.lastData.stored_time }}</p>
              <p v-else class="font-bold text-[12px]">-</p>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <component :is="selectedComponent" />
  </template>
  
<script >
  import Chip from '@/components/tab/Chip.vue';
  import sideNav from '@/components/navigation/sideNav.vue'
  import Heatmap from '@/views/Map/DumpTruck/Heatmap.vue'
  import Route from '@/views/Map/DumpTruck/Route.vue'
  import Realtime from '@/views/Map/DumpTruck/Realtime.vue'
  import { onMounted, ref, onBeforeMount} from 'vue'
  import { useLocalStorage } from '@vueuse/core'

  export default {
    components:{
      Heatmap,
      Realtime,
      Route,
      Chip,
      sideNav 
  },
  setup() {
    const selectedComponent = useLocalStorage('SelectedMapSetting','Realtime')
    const selectedVehicle = ref({id: '0', registrationNumber: 'XXXX'})
    const selectedContractor = ref('0')
    const vehicleList = ref([])
    const vehicleDetailData = ref([])
    const isVehicleDetailDataReady = ref(false)
    const tabs = [
      {
        title: 'Realtime',
        value: 'Realtime'
      },
      {
        title: 'Route',
        value: 'Route'
      },
      {
        title: 'Heatmap',
        value: 'Heatmap'
      },
      {
        title: 'Quickcount',
        value: 'Quickcount'
      }
    ]

    function changeNavigation(navigation) {
      var subNavs = document.getElementsByClassName("nav")
      console.log(subNavs)
      for (var i of subNavs) {
        i.classList.remove("active");
      }
      console.log(navigation)
      event.target.className += " active"
      selectedComponent.value = navigation
    }
    onMounted(async() => {
      var element = document.getElementById(selectedComponent.value);
      element.classList.add("active");
    })

    function dataUpdated(data) {
      console.log(data)
      vehicleDetailData.value = data
      isVehicleDetailDataReady.value = true
      console.log(vehicleDetailData.value)
    }

    function clearData() {
      vehicleDetailData.value = []
      isVehicleDetailDataReady.value = false

    }
    
    return {
      tabs, selectedVehicle, selectedContractor, selectedComponent, changeNavigation, vehicleList, dataUpdated, vehicleDetailData, isVehicleDetailDataReady, clearData
    }
  }
}
</script>
  
<style scoped>

.content {
  @apply w-full relative ml-[47px] mt-[47px] flex
}

.menu {
 @apply  min-w-[409px] max-w-[409px] h-full border-r border-[#CCD1D5] bg-[#FEFEFE] py-[27px] px-[25px] flex flex-col gap-[30px]
        overflow-y-scroll
}
.tab-wrapper{
  @apply
   w-full text-left gap-[6px] sm:gap-[10px] flex flex-col 
}
.tab-wrapper h1 {
  @apply text-[10px] font-bold sm:text-sm
}
.menu::-webkit-scrollbar {
  width: 8px;
}
 
.menu::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
 
.menu::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

.skeleton-loading {
  @apply animate-pulse
}
  </style>