<template>
  <sideNav :isSettingActive="true" /> 
  <div class="content">
    <div class="form">
      <component :is="selectedComponent" :contractorId="contractorId" @assignContractor="moveToContractorAssignment" @manageContractor="moveToContractorManagement" />
    </div>
  </div>
  </template> 
           
  <script>
  import Button from '@/components/button/BaseButton.vue'
  import sideNav from '@/components/navigation/sideNav.vue'
  import ContractorManagement from './ContractorManagement.vue'
  import ContractorAssignment from './ContractorAssignment.vue'
  import { ref } from 'vue'
  
    export default {
      components: {
        sideNav, ContractorManagement, ContractorAssignment, Button
      },
      
      setup() {
        const selectedComponent = ref('ContractorManagement')
        const contractorId = ref('')
        function moveToContractorAssignment(item) {
          contractorId.value = item
          console.log(contractorId.value)
          selectedComponent.value = 'ContractorAssignment'
        }
        function moveToContractorManagement() {
          selectedComponent.value = 'ContractorManagement'
        }

        return {
          selectedComponent,
          moveToContractorAssignment,
          moveToContractorManagement,
          contractorId
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