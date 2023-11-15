<template>
  <alert 
    :message ="status.message"
    :modalActive="status.isError"
    :isError="status.isError"
    @close="closeNotification" 
  />
  <NewManufacturerModal 
    :isOpen="isModalPops"
    @close="newModalToggle"
    title="Create New Manufacturer"/>
  <div class="flex justify-between mb-6">
    <h1 class="title">Manufacturers List</h1>
    <div class="button-wrapper">
      <Button type="button" class="outlined__green" label="Add New Manufacturer" @click="newModalToggle" />
    </div>
  </div>
  <div class="table-wrap">
    <SearchField class="outlined" v-model="searchValue" placeholder="Search..." />
    <EasyDataTable
    table-class-name="customize-table"
    sort-By="no"
    :headers="header"
    :items="manufacturers"
    theme-color="#1363df"        
    search-field="name"
    :search-value="searchValue"
    :loading="getManufacturersIsLoading"
    >
    <template #item-variantName="item">
      <div class="flex gap-2">
        <div class="bg-[#5863BB] text-white font-semibold px-3 py-1 rounded-full pointer-events-none" v-for="variant in item.variantName">
        {{ variant }}
        </div>
      </div>
    </template>
    <template #item-operation="item">
      <div class="operation"  @click="assignManufactures(item)">
        <p>Add Variant</p>
        <svg class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 7H22V9H13V7ZM13 15H22V17H13V15ZM16 11H22V13H16V11ZM13 12L8 7V11H2V13H8V17L13 12Z" fill="#353535" fill-opacity="0.6"/>
        </svg>
      </div>
    </template>
  </EasyDataTable>
  </div>
  </template>
      
  <script setup>
  import SearchField from '@/components/SearchField.vue'
  import NewManufacturerModal from '@/components/modal/manufacturer/NewManufacturerModal.vue'
  import Button from '@/components/button/BaseButton.vue'
  import { onBeforeMount, ref } from 'vue'
  import { useManufacturersStore } from '@/stores/master-data/manufacturersStore'
  import { storeToRefs } from 'pinia'
  
  
    const isModalPops = ref(false)
    const isEditModalPops = ref(false)
    const isDelModalPops = ref(false)
    const searchValue = ref('')
    const items = ref('')
    
    const header = [
      { text: "No", value: "no", sortable: true },
      { text: "Manufacturer Name", value: "manufacturerName", sortable: true },
      { text: "Variant Name", value: "variantName", sortable: true },
      { text: "", value: "operation" },
    ]


    const manufacturerStore = useManufacturersStore()
    const { manufacturers, getManufacturersIsLoading, status } = storeToRefs(useManufacturersStore())

    onBeforeMount( async () => {
      await manufacturerStore.getManufacturers()
      console.log(manufacturers.value)
    })
  
    function newModalToggle() {
      isModalPops.value = !isModalPops.value
    }

    const emits = defineEmits(['assignManufactures'])

    function assignManufactures(item) {
      console.log(item)
      emits('assignManufactures', item.manufacturerName)
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
      @apply flex justify-end items-center gap-4 cursor-pointer 
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
    overflow: hidden;
  }
  </style>
  