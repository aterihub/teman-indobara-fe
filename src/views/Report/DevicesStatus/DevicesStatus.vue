<template>
  <sideNav :isReportActive="true" />
  <div class="content">
    <div class="form">
      <component :is="selectedComponent" :deviceImei="deviceImei" :deviceType="deviceType" @devicesRealtime="moveToDevicesRealtime"
        @deviceHistory="moveToDeviceHistory" />
    </div>
  </div>
</template> 
           
<script>
import Button from '@/components/button/BaseButton.vue'
import sideNav from '@/components/navigation/sideNav.vue'
import { ref, onMounted } from 'vue'
import DevicesRealtimeTable from './DevicesRealtimeTable'
import DeviceHistoricalTable from './DeviceHistoricalTable.vue'
export default {
  components: {
    sideNav, Button, DevicesRealtimeTable, DeviceHistoricalTable
  },

  setup() {
    const selectedComponent = ref('DevicesRealtimeTable')
    const deviceImei = ref('')
    const deviceType = ref('')

    function moveToDeviceHistory(item) {
      deviceImei.value = item.imei
      deviceType.value = item.type
      selectedComponent.value = 'DeviceHistoricalTable'
    }
    function moveToDevicesRealtime() {
      selectedComponent.value = 'DevicesRealtimeTable'
    }

    return {
      selectedComponent,
      moveToDeviceHistory,
      moveToDevicesRealtime,
      deviceImei,
      deviceType
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
  @apply w-full rounded-lg bg-white
}

.title {
  @apply text-[24px] flex justify-start items-center text-black opacity-80
}
</style>