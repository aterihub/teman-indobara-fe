<template>
  <alert 
    :message ="status.message"
    :modalActive="status.isError"
    :isError="status.isError"
    @close="closeNotification" 
  />
  <NewContractorModal 
    :isOpen="isModalPops"
    @close="newModalToggle"
    title="Create New Contractor"/>
  <EditContractorModal 
    :isOpen="isEditModalPops"
    @close="editModalToggle"
    title="Edit Contractor"
    :formData="items"
    />
  <DeleteContractorModal 
    :isOpen="isDelModalPops"
    @close="isDelModalPops = !isDelModalPops"
    :contractorInfo="items"/>
  <div class="flex justify-between mb-6">
    <h1 class="title">Contractors List</h1>
    <div class="button-wrapper">
      <Button type="button" class="outlined__green" label="Add New Contractor" @click="newModalToggle" />
    </div>
  </div>
  <div class="table-wrap">
    <SearchField class="outlined" v-model="searchValue" placeholder="Search..." />
    <EasyDataTable
    table-class-name="customize-table"
    sort-By="no"
    :headers="header"
    :items="contractorsStore.contractors"
    theme-color="#1363df"        
    search-field="name"
    :search-value="searchValue"
    :loading="getContractorsIsLoading"
    >
    <template #item-operation="item">
      <div class="operation">
      <svg class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="delModalToggle(item)">
        <path d="M8.4375 4.3125H8.25C8.35313 4.3125 8.4375 4.22813 8.4375 4.125V4.3125H15.5625V4.125C15.5625 4.22813 15.6469 4.3125 15.75 4.3125H15.5625V6H17.25V4.125C17.25 3.29766 16.5773 2.625 15.75 2.625H8.25C7.42266 2.625 6.75 3.29766 6.75 4.125V6H8.4375V4.3125ZM20.25 6H3.75C3.33516 6 3 6.33516 3 6.75V7.5C3 7.60313 3.08437 7.6875 3.1875 7.6875H4.60312L5.18203 19.9453C5.21953 20.7445 5.88047 21.375 6.67969 21.375H17.3203C18.1219 21.375 18.7805 20.7469 18.818 19.9453L19.3969 7.6875H20.8125C20.9156 7.6875 21 7.60313 21 7.5V6.75C21 6.33516 20.6648 6 20.25 6ZM17.1398 19.6875H6.86016L6.29297 7.6875H17.707L17.1398 19.6875Z" fill="#353535" fill-opacity="0.6"/>
      </svg>
      <svg class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="editModalToggle(item)">
        <path d="M6.03984 17.625C6.08672 17.625 6.13359 17.6203 6.18047 17.6133L10.1227 16.9219C10.1695 16.9125 10.2141 16.8914 10.2469 16.8563L20.182 6.92109C20.2038 6.89941 20.221 6.87366 20.2328 6.8453C20.2445 6.81695 20.2506 6.78656 20.2506 6.75586C20.2506 6.72516 20.2445 6.69477 20.2328 6.66642C20.221 6.63806 20.2038 6.61231 20.182 6.59063L16.2867 2.69297C16.2422 2.64844 16.1836 2.625 16.1203 2.625C16.057 2.625 15.9984 2.64844 15.9539 2.69297L6.01875 12.6281C5.98359 12.6633 5.9625 12.7055 5.95312 12.7523L5.26172 16.6945C5.23892 16.8201 5.24707 16.9493 5.28545 17.071C5.32384 17.1927 5.39132 17.3032 5.48203 17.393C5.63672 17.543 5.83125 17.625 6.03984 17.625V17.625ZM7.61953 13.5375L16.1203 5.03906L17.8383 6.75703L9.3375 15.2555L7.25391 15.6234L7.61953 13.5375V13.5375ZM20.625 19.5938H3.375C2.96016 19.5938 2.625 19.9289 2.625 20.3438V21.1875C2.625 21.2906 2.70937 21.375 2.8125 21.375H21.1875C21.2906 21.375 21.375 21.2906 21.375 21.1875V20.3438C21.375 19.9289 21.0398 19.5938 20.625 19.5938Z" fill="#353535" fill-opacity="0.6"/>
      </svg>
      <svg class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="assignContractor(item)">
        <path d="M13 7H22V9H13V7ZM13 15H22V17H13V15ZM16 11H22V13H16V11ZM13 12L8 7V11H2V13H8V17L13 12Z" fill="#353535" fill-opacity="0.6"/>
      </svg>
      </div>
    </template>
  </EasyDataTable>
  </div>
  </template>
      
  <script setup>
  import NewContractorModal from '@/components/modal/contractor/NewContractorModal.vue'
  import SearchField from '@/components/SearchField.vue'
  import EditContractorModal from '@/components/modal/contractor/EditContractorModal.vue'
  import DeleteContractorModal from '@/components/modal/contractor/DeleteContractorModal.vue'
  import Button from '@/components/button/BaseButton.vue'
  import { onBeforeMount, ref } from 'vue'
  import { useContractorsStore } from '@/stores/master-data/contractorsStore'
  import { storeToRefs } from 'pinia'
  
  
    const isModalPops = ref(false)
    const isEditModalPops = ref(false)
    const isDelModalPops = ref(false)
    const searchValue = ref('')
    const items = ref('')
    
    const header = [
      { text: "No", value: "no", sortable: true },
      { text: "Name", value: "name", sortable: true },
      { text: "Address", value: "address", sortable: true },
      { text: "PIC Name", value: "picName", sortable: true },
      { text: "PIC Phone", value: "picPhone", sortable: true },
      // { text: "Contract Start Date", value: "formattedContractStart", sortable: true },
      // { text: "Contract End Date", value: "formattedContractEnd", sortable: true },
      { text: "", value: "operation", width: 100 },
    ]


    const contractorsStore = useContractorsStore()
    const { getContractorsIsLoading, status } = storeToRefs(useContractorsStore())

    onBeforeMount(() => {
      contractorsStore.getContractors()
    })
  
    function newModalToggle() {
      isModalPops.value = !isModalPops.value
    }
    function editModalToggle(data) {
      items.value = data
      isEditModalPops.value = !isEditModalPops.value
    }


    function delModalToggle(data) {
      items.value = data
      isDelModalPops.value = !isDelModalPops.value
    }
    const emits = defineEmits(['assignContractor'])

    function assignContractor(item) {
      emits('assignContractor', item.id)

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
  </style>
  