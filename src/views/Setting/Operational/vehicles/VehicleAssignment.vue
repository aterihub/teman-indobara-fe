<template>
  <NewDeviceAssigmentModal 
    :contractorId="props.vehicleId"
    :isOpen="isModalPops"
    @close="newModalToggle"
    title="Assign New Device"
    :vehicleId="props.vehicleId"/>
  <UnbindDeviceModal 
    :isOpen="isDelModalPops"
    @close="isDelModalPops = !isDelModalPops"
    :deviceInfo="deviceInfo"
    :vehicleId="props.vehicleId"/>

  <div class="flex justify-between mb-6">
    <h1 class="title">Assigned Devices List</h1>
    <div class="button-wrapper">
      <Button type="button" class="outlined__green" label="Bind New Devices" @click="newModalToggle" />
    </div>
  </div>
  <div class="table-wrap">
    <!-- <SearchField class="outlined" v-model="searchValue" placeholder="Search..." /> -->
    <button class="back-btn" @click="manageVehicle">
      <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M11.4375 18.75L4.6875 12L11.4375 5.25M5.625 12H19.3125" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Back
    </button>
    <EasyDataTable
    table-class-name="customize-table"
    :headers="header"
    :items="bindedDevices"
    theme-color="#1363df"        
    search-field="name"
    :search-value="searchValue"
    :loading="getBindedDevicesIsLoading"
    sort-by="contractStart"
    >
    <template #item-operation="item">
      <div class="operation">
        <svg class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="delModalToggle(item)">
          <path d="M8.4375 4.3125H8.25C8.35313 4.3125 8.4375 4.22813 8.4375 4.125V4.3125H15.5625V4.125C15.5625 4.22813 15.6469 4.3125 15.75 4.3125H15.5625V6H17.25V4.125C17.25 3.29766 16.5773 2.625 15.75 2.625H8.25C7.42266 2.625 6.75 3.29766 6.75 4.125V6H8.4375V4.3125ZM20.25 6H3.75C3.33516 6 3 6.33516 3 6.75V7.5C3 7.60313 3.08437 7.6875 3.1875 7.6875H4.60312L5.18203 19.9453C5.21953 20.7445 5.88047 21.375 6.67969 21.375H17.3203C18.1219 21.375 18.7805 20.7469 18.818 19.9453L19.3969 7.6875H20.8125C20.9156 7.6875 21 7.60313 21 7.5V6.75C21 6.33516 20.6648 6 20.25 6ZM17.1398 19.6875H6.86016L6.29297 7.6875H17.707L17.1398 19.6875Z" fill="#353535" fill-opacity="0.6"/>
        </svg>
      </div>
    </template>
  </EasyDataTable>
  </div>
  </template>
      
  <script setup>
  import NewDeviceAssigmentModal from '@/components/modal/vehicle/NewDeviceAssigmentModal.vue'
  import UnbindDeviceModal from '@/components/modal/vehicle/UnbindDeviceModal.vue'
  import Button from '@/components/button/BaseButton.vue'
  import { onMounted, ref } from 'vue'
  import { useDeviceBindingStore } from '@/stores/transactions/deviceBindingStore'
  import { storeToRefs } from 'pinia'
  
    const isModalPops = ref(false)
    const isDelModalPops = ref(false)
    const searchValue = ref('')
    const deviceInfo = ref('')
    const props = defineProps(['vehicleId'])
    const emits = defineEmits(['manageVehicle'])
    
    const header = [
      { text: "IMEI", value: "imeiNumber" },
      { text: "SIM Number", value: "simNumber" },
      { text: "SIM Provider", value: "simProvider" },
      { text: "Type", value: "type", sortable: true },
      { text: "Manufacturer Name", value: "manufacturerName", sortable: true },
      { text: "Variant", value: "variantName" ,sortable: true},
      { text: "", value: "operation", width: 100 },
    ]

    const deviceBindingStore = useDeviceBindingStore()
    const { bindedDevices, getBindedDevicesIsLoading } = storeToRefs(useDeviceBindingStore())

    onMounted(() => {
      console.log(props.vehicleId)
      deviceBindingStore.getBindedDevices(props.vehicleId)
    })
  
    function newModalToggle() {
      isModalPops.value = !isModalPops.value
    }  
    
    function delModalToggle(item) {
      console.log(item)
      deviceInfo.value = item
      isDelModalPops.value = !isDelModalPops.value
    }

    function manageVehicle() {
      emits('manageVehicle')
    }

    
  </script>
      
    <style scoped>
  .content {
    @apply w-full h-fit ml-[60px] mt-[60px]
  } 
  .title {
    @apply
      text-[24px] font-medium flex justify-start items-center text-[#353535]
  }
  .device-container {
    @apply 
      p-[32px] flex flex-col gap-9
  }
    .table-wrap {
      @apply 
        h-[300px]
        overflow-auto sm:overflow-visible
    }
    .table-header {
      @apply
      flex flex-row w-full justify-between mb-[30px]
    }
    .search-wrapper {
      @apply
        w-[280px] h-[40px]
    }
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

  .back-btn {
    @apply self-start flex p-3 text-sm font-medium bg-transparent w-fit items-center gap-4 border-solid border-t border-x rounded-t-[8px]  border-[#EBEBED]
  }
  
  .back-btn:hover {
    @apply bg-[#93C76A] text-white
  }
  .arrow {
    @apply stroke-black
  }
  
  .back-btn:hover .arrow {
    @apply stroke-white
  }
  </style>
  