<template>
  <sideNav :isSettingActive="true" /> 
  <div class="content">
    <div class="form">
      <component :is="selectedComponent" :manufacturerName="manufacturerName" @assignManufactures="moveToManufacturesAssignment" @manageManufactures="ManufacturesractorManagement" />
    </div>
  </div>
  </template> 
           
  <script>
  import Button from '@/components/button/BaseButton.vue'
  import sideNav from '@/components/navigation/sideNav.vue'
  import ManufacturesManagement from './ManufacturesManagement.vue'
  import ManufacturesAssignment from './ManufacturesAssignment.vue'
  import { ref } from 'vue'
  
    export default {
      components: {
        sideNav, ManufacturesManagement, ManufacturesAssignment, Button
      },
      
      setup() {
        const selectedComponent = ref('ManufacturesManagement')
        const manufacturerName = ref('')

        function moveToManufacturesAssignment(item) {
          manufacturerName.value = item
          console.log(manufacturerName.value)
          selectedComponent.value = 'ManufacturesAssignment'
        }
        
        function ManufacturesractorManagement() {
          selectedComponent.value = 'ManufacturesManagement'
        }

        return {
          selectedComponent,
          moveToManufacturesAssignment,
          ManufacturesractorManagement,
          manufacturerName
        }
      }
    }
    
  </script>
          
  <style scoped>
  .content {
      @apply relative w-full h-full flex flex-col gap-6
  }
  
  .navigation {
    @apply flex w-fit
  }
  .form {
    @apply 
      w-full rounded-lg bg-white
  }
  </style>