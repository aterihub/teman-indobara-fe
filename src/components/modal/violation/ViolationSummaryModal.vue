<template>
  <div>
    <alert 
    :message ="status.message"
    :modalActive="modalActive"
    :isError="status.isError"
    @close="closeNotification" />
    <transition name="fade">
      <div class="modal" v-show="isOpen">
        <transition name="drop-in">
          <div class="modal-inner" v-show="isOpen" ref="target">
            <div class="modal-content">
              <div class="flex justify-between">
                <h1 class="text-sm font-bold">Violation Summary</h1>
                <div class="flex justify-center items-center gap-2 cursor-pointer" @click="closeModal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="black"/>
                  </svg>
                  <h1  class="text-sm font-bold">Close</h1>
                </div>
              </div>
              <div class="flex justify-between">
                <div class="w-1/3">
                  <Chip :tabs="tabs" @clicked= "changeNavigation" />
                </div>
                <h1>Last Check: <span class="font-semibold pl-4">2023 / 09 / 10 23:44:28</span></h1>
              </div>
              <EasyDataTable
                :rows-per-page="10"
                table-class-name="customize-table"
                :headers="header"
                :items="dummyData"
                theme-color="#1363df"        
                >
              </EasyDataTable>
            </div>
        </div>
      </transition>
    </div>
  </transition>
</div>
</template>

  
<script setup>
import Chip from '@/components/tab/SubChip.vue';
import { useDevicesStore } from '@/stores/master-data/devicesStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

  const props = defineProps({
    isOpen: Boolean,
    deviceInfo: Object
  })

  const tabs = [
      {
        title: 'All',
        value: 'All'
      },
      {
        title: 'Kosongan',
        value: 'Kosongan'
      },
      {
        title: 'Muatan',
        value: 'Muatan'
      }
    ]

  const header = [
    { text: "No", value: "no" },
    { text: "Vehicle", value: "vehicle" },
    { text: "Position", value: "position" },
    { text: "Speed (KpH)", value: "speed", sortable: true },
    { text: "Violation", value: "violation", sortable: true },
    { text: "Time", value: "time" ,sortable: true},
  ]
  const dummyData = [
  { no: '1', vehicle: 'DOMO', position: 'KM 20', speed: 40, violation: 'Phone Alarm', time: '12-10-2023 10:44:02' },
  { no: '2', vehicle: 'ABC Car', position: 'KM 15', speed: 35, violation: 'Speeding', time: '12-10-2023 10:45:02' },
  { no: '3', vehicle: 'XYZ Truck', position: 'KM 10', speed: 50, violation: 'Seatbelt', time: '12-10-2023 10:46:02' },
  { no: '4', vehicle: 'Blue Van', position: 'KM 5', speed: 45, violation: 'Phone Alarm', time: '12-10-2023 10:47:02' },
  { no: '5', vehicle: 'Green Bike', position: 'KM 8', speed: 55, violation: 'Speeding', time: '12-10-2023 10:48:02' },
  { no: '6', vehicle: 'Red Car', position: 'KM 12', speed: 60, violation: 'Signal Violation', time: '12-10-2023 10:49:02' },
  { no: '7', vehicle: 'Yellow Bus', position: 'KM 19', speed: 38, violation: 'Seatbelt', time: '12-10-2023 10:50:02' },
  { no: '8', vehicle: 'Silver SUV', position: 'KM 22', speed: 42, violation: 'Phone Alarm', time: '12-10-2023 10:51:02' },
  { no: '9', vehicle: 'Black Truck', position: 'KM 26', speed: 47, violation: 'Speeding', time: '12-10-2023 10:52:02' },
  { no: '10', vehicle: 'White Car', position: 'KM 29', speed: 30, violation: 'Seatbelt', time: '12-10-2023 10:53:02' },
  { no: '11', vehicle: 'Orange Bike', position: 'KM 27', speed: 52, violation: 'Signal Violation', time: '12-10-2023 10:54:02' },
  { no: '12', vehicle: 'Purple Car', position: 'KM 18', speed: 43, violation: 'Phone Alarm', time: '12-10-2023 10:55:02' },
  { no: '13', vehicle: 'Gray SUV', position: 'KM 13', speed: 57, violation: 'Speeding', time: '12-10-2023 10:56:02' },
  { no: '14', vehicle: 'Brown Van', position: 'KM 7', speed: 34, violation: 'Seatbelt', time: '12-10-2023 10:57:02' },
  { no: '15', vehicle: 'Teal Car', position: 'KM 14', speed: 46, violation: 'Phone Alarm', time: '12-10-2023 10:58:02' },
  { no: '16', vehicle: 'Magenta Bike', position: 'KM 21', speed: 51, violation: 'Signal Violation', time: '12-10-2023 10:59:02' },
  { no: '17', vehicle: 'Cyan Truck', position: 'KM 24', speed: 39, violation: 'Seatbelt', time: '12-10-2023 11:00:02' },
  { no: '18', vehicle: 'Lime Car', position: 'KM 11', speed: 49, violation: 'Phone Alarm', time: '12-10-2023 11:01:02' },
  { no: '19', vehicle: 'Indigo SUV', position: 'KM 17', speed: 44, violation: 'Speeding', time: '12-10-2023 11:02:02' },
  { no: '20', vehicle: 'Violet Van', position: 'KM 23', speed: 37, violation: 'Signal Violation', time: '12-10-2023 11:03:02' }
];
  function changeNavigation(navigation) {
    var subNavs = document.getElementsByClassName("subnav")
    console.log(subNavs)
    for (var i of subNavs) {
      i.classList.remove("active");
    }
    console.log(navigation)
    event.target.className += " active"
    selectedComponent.value = navigation
  }
  onMounted(() => {
    var element = document.getElementById("All")
    console.log(element)
    element.classList.add("active")
  })
  const modalActive = ref(false)
  const devicesStore = useDevicesStore()
  const { status, deleteDeviceIsLoading } = storeToRefs(useDevicesStore())
  const delLabel = ref('DELETE')
  const delButtonClick = ref(0)
  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

  const onSubmit = async (id) => {
    delButtonClick.value = ++delButtonClick.value
    if (delButtonClick.value == 1) {
      delLabel.value = 'sure to remove this device?'
    }

    if (delButtonClick.value == 2) {
      await devicesStore.deleteDevice(id)
      modalActive.value = true
 
      if (status.value.code == 'fail') {
        setTimeout(closeNotification, 3000)
      } else {
        setTimeout(closeNotification, 3000)
      }
      closeModal()
      await delay(1000)
      devicesStore.getDevices()
    }
  }

  const closeNotification = () => {
    modalActive.value = false
  }
  // Define custom events
  const emits = defineEmits(['close'])
  
  function closeModal() {
    emits('close')
    delLabel.value = 'DELETE'
    delButtonClick.value = 0
  }
  const target = ref(null)

  onClickOutside(target, () => {
    if (props.isOpen) {
      console.log(props.deviceInfo)
      closeModal()
    }
  })


</script>
  
  <style scoped>
  
  .modal {
  @apply
    fixed top-0 left-0 w-full h-full px-[46px]
    /* overflow-x-hidden overflow-y-auto */
    bg-[#ABADAF]/20 z-10
}

.modal-inner {
  @apply 
  w-full h-full flex pt-60 px-6
    /* max-w-[500px] my-[100px] mx-auto */
}

.modal-content {
  @apply 
   w-screen p-[40px] bg-white rounded-t-xl gap-[40px] flex flex-col text-left
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
  transition: all 0.5s ease-out;
}

.drop-in-enter-from,
.drop-in-leave-to {
  opacity: 0;
  transform: translateZ(-50px);
}

  .button-wrapper {
    @apply flex justify-between gap-8
}
.customize-table {
    --easy-table-border:	1px solid #EBEBED;	
    --easy-table-header-font-size: 14px;
    --easy-table-header-background-color: transparent;
    --easy-table-header-font-color:	#6E6E78;
    --easy-table-header-height:	40px;
  
    --easy-table-body-row-font-size:	14px;
    --easy-table-body-font-color:	#3A3A3E;
    --easy-table-body-row-height:	40px;
  
    --easy-table-footer-font-size:	12px;
    --easy-table-footer-height:	40px;
    --easy-table-footer-font-color:	#6E6E78;
    overflow-y: auto;
    height:auto;
  }
  
  </style>