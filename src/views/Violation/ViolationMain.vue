<template>
  <sideNav :is-violation-active="true" />
  <div class="content">
    <div class="navigation">
      <SmallChip :tabs="tabs" @clicked="changeNavigation" />
    </div>
    <component :is="selectedComponent"  />
  </div>
</template>
  
<script>
import sideNav from '@/components/navigation/sideNav.vue'
import { ref, onMounted } from 'vue'
import SmallChip from '@/components/tab/Tab.vue'
import { useLocalStorage } from '@vueuse/core'
import ViolationGraphical from './ViolationGraphical.vue'
import ViolationTable from './ViolationTable.vue'


    export default {
      components: {
        sideNav, SmallChip, ViolationGraphical, ViolationTable
      },
      
      setup() {
        const tabs = [
        {
          title: 'Table',
          value: 'ViolationTable',
        },        
        {
          title: 'Graphic',
          value: 'ViolationGraphical',
        }
      ]
      const selectedComponent = useLocalStorage('SelectedViolationSetting','ViolationTable')
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
  @apply w-full h-full relative ml-[70px] pt-[82px] mr-[26px] flex flex-col gap-5
}
  .navigation {
  @apply flex w-fit
}

.title {
  @apply
    text-[24px] font-medium flex justify-start items-center text-[#353535]
}
.table-wrap {
  @apply
    overflow-auto sm:overflow-visible
}
.table-header {
  @apply
  flex flex-row w-full justify-between mb-6
}
/* .search-wrapper {
  @apply
    w-[280px] h-[40px]
} */
.operation {
  @apply flex gap-4
}

.customize-table {
  --easy-table-border:	1px solid #EBEBED;	
  --easy-table-header-font-size: 14px;
  --easy-table-header-background-color: transparent;
  --easy-table-header-font-color:	#6E6E78;
  --easy-table-header-height:	40px;

  --easy-table-body-row-font-size:	14px;
  --easy-table-body-font-color:	#3A3A3E;
  --easy-table-body-row-height:	46px;

  --easy-table-footer-font-size:	12px;
  --easy-table-footer-height:	40px;
  --easy-table-footer-font-color:	#6E6E78;
  border-collapse: collapse;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
  
    </style>