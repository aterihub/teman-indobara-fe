<template>
  <sideNav :isSettingActive="true" /> 
  <div class="content">
    <div class="navigation">
      <SmallChip :tabs="tabs" @clicked="changeNavigation" />
    </div>
    <div class="form">
      <component :is="selectedComponent"  />
    </div>
  </div>
  </template> 
           
  <script>
  import Button from '@/components/button/BaseButton.vue'
  import sideNav from '@/components/navigation/sideNav.vue'
  import { ref, onMounted } from 'vue'
  import SmallChip from '@/components/tab/Tab.vue'
  import AdminMaster from './AdminMaster.vue'
  import UserMaster from './UserMaster.vue'
    export default {
      components: {
        sideNav, Button, SmallChip, AdminMaster, UserMaster
      },
      
      setup() {
        const tabs = [
        {
          title: 'Admin',
          value: 'AdminMaster',
        },        
        {
          title: 'User',
          value: 'UserMaster',
        }
      ]
      const selectedComponent = ref('AdminMaster')
        
      function changeNavigation(navigation) {
        var subNavs = document.getElementsByClassName("smallNav")
        console.log(subNavs)
        for (var i of subNavs) {
          i.classList.remove("active");
        }
        console.log(navigation)
        event.target.className += " active"
        selectedComponent.value = navigation
      }

      onMounted(async() => {
        var element = document.getElementById("Admin");
        element.classList.add("active");
      })

        return {
          selectedComponent,
          tabs,
          changeNavigation,
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