<template>
<sideNav :isReportActive="true" /> 
<div class="content">
  <div class="navigation">
    <LargeChip :tabs="tabs" @clicked="changeNavigation" />
  </div>
  <component :is="selectedComponent" />
</div>
</template>     
         
<script>
import LargeChip from '@/components/tab/VerticalTab.vue' 
import DeviceInfo from '@/views/Devices/DeviceInfo.vue'
import EditDevice from '@/views/Devices/EditDevice.vue'
import sideNav from '@/components/navigation/sideNav.vue'
import Button from '@/components/button/BaseButton.vue'
import LocationTable from './LocationTable.vue'
import LocationHourlyTable from './LocationHourlyTable.vue'
import Playback from './Playback.vue'
import DevicesRealtimeTable from './DevicesStatus/DevicesStatus.vue'
import SearchBar from '@/components/SearchBar.vue'
import ViolationTable from './ViolationReport.vue'
import { onMounted, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

  export default {
    components: {
      LargeChip, DeviceInfo , EditDevice, sideNav, Button, SearchBar, LocationTable, ViolationTable, LocationHourlyTable, Playback, DevicesRealtimeTable
    },
    props: ['id'],

    setup(props) {
      const selectedComponent = useLocalStorage('SelectedReportSetting','LocationTable')
      const tabs = [
        {
          title: 'Location Historical',
          value: 'LocationTable',
          src: 'ic-historicalLocation-OFF.png'
        },        
        {
          title: 'Hourly Location',
          value: 'LocationHourlyTable',
          src: 'ic-hourlyLocation-OFF.png'
        },        
        {
          title: 'Violation Historical',
          value: 'ViolationTable',
          src: 'ic-violation-OFF.png'
        },       
        {
          title: 'History Playback',
          value: 'Playback',
          src: 'ic-playback-OFF.png'
        },       
        {
          title: 'Devices Health Status',
          value: 'DevicesRealtimeTable',
          src: 'ic-deviceHealth-OFF.png'
        }
      ]
 
      function changeNavigation(navigation) {
        var subNavs = document.getElementsByClassName("nav")
        console.log(subNavs)
        for (var i of subNavs) {
          i.classList.remove("active");
        }
        console.log(navigation)
        // event.target.classList.add("active")
        event.target.className += " active"
        selectedComponent.value = navigation
      }

      onMounted(() => {
        var element = document.getElementById(selectedComponent.value)
        element.classList.add("active")
      })

      return {
        selectedComponent,
        tabs, 
        changeNavigation
      }
    }
  }
  
</script>
        
<style scoped>
.content {
    @apply relative w-full h-full ml-[47px] pt-[80px] pb-6 px-6 flex gap-6 
}
.form {
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);
  @apply 
    w-full rounded-lg bg-white p-8
}
.navigation {
  @apply border-r pr-6
}
</style>