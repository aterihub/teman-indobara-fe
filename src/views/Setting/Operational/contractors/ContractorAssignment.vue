<template>
  <NewSiteContractModal 
    :contractorId="props.contractorId"
    :isOpen="isModalPops"
    @close="newModalToggle"
    title="Create New Contracts"/>
  <div class="flex justify-between mb-6">
    <h1 class="title">Site Contracts List</h1>
    <div class="button-wrapper">
      <Button type="button" class="outlined__green" label="Add New Contract" @click="newModalToggle" />
    </div>
  </div>
  <div class="table-wrap">
    <!-- <SearchField class="outlined" v-model="searchValue" placeholder="Search..." /> -->
    <button class="back-btn" @click="manageContractor">
      <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M11.4375 18.75L4.6875 12L11.4375 5.25M5.625 12H19.3125" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Back
    </button>
    <EasyDataTable
    table-class-name="customize-table"
    :headers="header"
    :items="siteContracts"
    theme-color="#1363df"        
    search-field="name"
    :search-value="searchValue"
    :loading="getSiteContractsIsLoading"
    sort-by="contractStart"
    >
    <template #item-operation="item">
      <div class="operation">
        <div class="toggle-wrapper">
          <span class="font-semibold"></span>
          <label class="inline-flex relative items-center cursor-pointer">
          <input 
            type="checkbox"
            @change="onToggle(item)"
            v-model="item.statusToggle"
            class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </template>
  </EasyDataTable>
  </div>
  </template>
      
  <script setup>
  import NewSiteContractModal from '@/components/modal/contractor/NewSiteContractModal.vue'
  import SearchField from '@/components/SearchField.vue'
  import Button from '@/components/button/BaseButton.vue'
  import { onMounted, ref } from 'vue'
  import { useSiteContractsStore } from '@/stores/transactions/siteContractsStore'
  import { storeToRefs } from 'pinia'
  
    const isModalPops = ref(false)
    const searchValue = ref('')
    const items = ref('')
    const props = defineProps(['contractorId'])
    const emits = defineEmits(['manageContractor'])
    
    const header = [
      { text: "Site Name", value: "site", sortable: true },
      { text: "Contract Start Date", value: "contractStart", sortable: true },
      { text: "Contract End Date", value: "contractEnd", sortable: true },
      { text: "Exprired In", value: "expiredIn", sortable: true },
      { text: "Status", value: "status", width: 100 },
      { text: "", value: "operation", width: 100 },
    ]

    const siteContractsStore = useSiteContractsStore()
    const { siteContracts, getSiteContractsIsLoading } = storeToRefs(useSiteContractsStore())

    onMounted(() => {
      siteContractsStore.getSiteContracts(props.contractorId)
    })
  
    function newModalToggle() {
      isModalPops.value = !isModalPops.value
    }

    async function onToggle(item) {
    let isEnable = {status : item.statusToggle == true ? 'ACTIVE' : 'DEACTIVE'}
    await siteContractsStore.updateSiteContract(props.contractorId,item.id,isEnable)
    siteContractsStore.getSiteContracts(props.contractorId)
    modalActive.value = true
    setTimeout(closeNotification, 3000)
  }
    function manageContractor() {
      emits('manageContractor')
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
  