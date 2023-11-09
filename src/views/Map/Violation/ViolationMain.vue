<template>
  <div class="content">
    <sideNav :is-violation-active="true" />
    <div class="menu">
      <div class="tab-wrapper">
        <h1>Data View</h1>
        <Chip :tabs="tabs" @clicked= "changeNavigation" />
      </div>
      <div class="tab-wrapper">
        <h1>Filter</h1>
        <div class="flex gap-3">
          <div class="flex gap-[14px]">
            <select name="contractorFilter" id="contractorFilter" v-model="selectedContractor" class="text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md">
              <option class="p-2" value="0" >All Contractor</option>
            </select>
          </div>
          <div class="flex gap-[14px]">
            <select name="vehicleFilter" id="vehicleFilter" v-model="selectedViolation" class="text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md">
              <option class="p-2" value="0" >All Violation</option>
            </select>
          </div>
          <div class="flex gap-[14px]">
            <select name="contractorFilter" id="contractorFilter" v-model="selectedHauling" class="text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md">
              <option class="p-2" value="0" >All Hauling</option>
            </select>
          </div>
        </div>
      </div>
      <div class="w-full border"></div>
      <div class="tab-wrapper">
        <div class="flex justify-between">
          <h1>Last Refresh</h1>
          <h1>2023 / 09 / 10 23:44:28</h1>
        </div>
        <div class="flex justify-between w-full">
        </div>
      </div>
    </div>
    <div class="w-full">
      <component :is="selectedComponent" :selectedVehicle="selectedVehicle" @dataUpdated="dataUpdated" @clearData="clearData"/>
    </div>
  </div>
  </template>
  
<script >
  import Chip from '@/components/tab/Chip.vue';
  import sideNav from '@/components/navigation/sideNav.vue'
  import ViolationGraphical from '@/views/Map/Violation/ViolationGraphical.vue'
  import ViolationTable from '@/views/Map/Violation/ViolationTable.vue'
  import { ref, onMounted} from 'vue'

  export default {
    components:{
      ViolationGraphical,
      ViolationTable,
      Chip,
      sideNav 
  },
  setup() {
    const selectedComponent = ref('ViolationTable')
    const selectedContractor = ref('0')
    const selectedViolation = ref('0')
    const selectedHauling = ref('0')
    const tabs = [
      {
        title: 'Table',
        value: 'ViolationTable'
      },
      {
        title: 'Graphical',
        value: 'ViolationGraphical'
      },
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
      var element = document.getElementById("Table")
      console.log(element)
      element.classList.add("active")
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
      tabs, selectedContractor, selectedComponent, changeNavigation, dataUpdated, clearData,
      selectedViolation,
      selectedHauling
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
   w-full text-left gap-[20px] flex flex-col 
}
.tab-wrapper h1 {
  @apply text-sm font-bold
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