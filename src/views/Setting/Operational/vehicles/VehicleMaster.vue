<template>
  <sideNav :isSettingActive="true" /> 
  <div class="content">
    <div class="navigation">
      <SmallChip :tabs="tabs" @clicked="changeNavigation" />
    </div>
    <div class="form">
      <component :is="selectedComponent" :vehicleId="vehicleId" @manageVehicle="moveToVehicleManagement" @assignVehicle="moveToVehicleAssignment" />
    </div>
  </div>
  </template> 
           
  <script>
  import Button from '@/components/button/BaseButton.vue'
  import sideNav from '@/components/navigation/sideNav.vue'
  import VehicleManagement from './VehicleManagement.vue'
  import { ref, onMounted } from 'vue'
  import SmallChip from '@/components/tab/SmallChip.vue'
  import VehicleAssignment from './VehicleAssignment.vue'
  import VehicleBrandMaster from './VehicleBrandMaster.vue'
  import VehicleTypeMaster from './VehicleTypeMaster.vue'
  import HullNumberMaster from './HullNumberMaster.vue'
    export default {
      components: {
        sideNav, VehicleManagement, Button, SmallChip, VehicleBrandMaster, VehicleTypeMaster, HullNumberMaster, VehicleAssignment
      },
      
      setup() {
        const tabs = [
        {
          title: 'Vehicle Management',
          value: 'VehicleManagement',
        },        
        {
          title: 'Vehicle Type',
          value: 'VehicleTypeMaster',
        },        
        {
          title: 'Vehicle Brand',
          value: 'VehicleBrandMaster',
        },        
        {
          title: 'Hull Number',
          value: 'HullNumberMaster',
        }
      ]
      const selectedComponent = ref('VehicleManagement')
      const vehicleId = ref('')
        
        function moveToVehicleAssignment(item) {
          vehicleId.value = item
          console.log(vehicleId.value)
          selectedComponent.value = 'VehicleAssignment'
        }
        function moveToVehicleManagement() {
          selectedComponent.value = 'VehicleManagement'
        }
        
      function changeNavigation(navigation) {
        var subNavs = document.getElementsByClassName("smallNav")
        console.log(subNavs)
        for (var i of subNavs) {
          i.classList.remove("active");
        }
        // var element = document.getElementById("Operational");
        // element.classList.add("active");
        console.log(navigation)
        event.target.className += " active"
        selectedComponent.value = navigation
      }

      onMounted(async() => {
        var element = document.getElementById("Vehicle Management");
        element.classList.add("active");
      })

        return {
          selectedComponent,
          tabs,
          changeNavigation,
          moveToVehicleAssignment,
          moveToVehicleManagement,
          vehicleId
        }
      }
    }
    
  </script>
          
  <style scoped>
  .content {
      @apply relative w-full h-full flex flex-col gap-6
  }
  
  .navigation {
    @apply flex w-fit my-3
  }
  .form {
    @apply 
      w-full rounded-lg bg-white
  }
  </style>