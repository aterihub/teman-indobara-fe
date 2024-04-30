<template>
    <div class="content">
      <div class="flex items-center justify-between mt-24">
        <div class="flex flex-col gap-2">
          <h1 class="title text-end">Quick Count</h1>
          <p>{{ new Date() }}</p>
        </div>
        <div class="px-6 py-4 rounded-lg bg-white shadow-md border w-fit flex flex-col gap-5 text-left">
          <p>Total: <span class="font-semibold">{{ quickCount.total }} Vehicles</span></p>
        </div> 
      </div>
    
      <div class="grid grid-cols-8 gap-8">
        <div class="flex flex-col gap-1" v-for="item in 8" v-if="loading">
          <div class="border  shadow rounded-md p-4 bg-[#5863BB]/60" >
            <div class="animate-pulse flex space-x-4">
              <div class="flex-1 space-y-6 py-1">
                <div class="h-2 bg-white rounded"></div>
              </div>
            </div>
          </div>
          <div class="border-2 rounded-md p-4 border-[#BA000D]">
            <div class="animate-pulse flex space-x-4">
              <div class="flex-1 space-y-6 py-1">
                <div class="h-2 bg-[#BA000D]/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-[5px]" v-for="graph in quickCount.graphicData" v-if="!loading">
          <div class="h-12 w-full flex rounded-lg bg-[#5863BB] justify-center items-center text-white font-semibold">
            {{ graph.name }}
          </div>
          <div
            class="h-10 flex justify-center items-center  font-semibold border-2  rounded-lg text-[#BA000D] border-[#BA000D]">
            {{ graph.count }}
          </div>
        </div>
      </div>
    </div>
    
    </template>
          
    <script setup>
    import { useGeofencesStore } from '@/stores/geofences/geofencesStore'
    import { storeToRefs } from 'pinia'
    import { onMounted, onUnmounted, ref } from 'vue'
    
    const geofencesStore = useGeofencesStore()
    const { quickCount } = storeToRefs(useGeofencesStore())
    
    const delay = require('delay')
    const whileState = ref(true)
    const loading = ref(true)
    
    onMounted(async () => {
      await geofencesStore.getQuickCount()
      loading.value = false
      while (whileState.value) {
        await geofencesStore.getQuickCount()
        await delay(10000)
      }
    })
    
    onUnmounted(() => {
      whileState.value = false
    })
    
    </script>
          
    <style scoped>
    .arrow {
      font-size: 32px;
      /* Adjust the font size as needed */
    }
    
    .content {
      @apply w-full h-full relative ml-[70px] pt-[82px] mr-[26px] flex flex-col gap-5
    }
    
    .title {
      @apply text-[24px] font-medium flex justify-start items-center text-[#353535]
    }
    
    .device-container {
      @apply p-[32px] flex flex-col gap-9
    }
    
    .table-wrap {
      @apply h-[300px] overflow-auto sm:overflow-visible
    }
    
    .table-header {
      @apply flex flex-row w-full justify-between mb-[30px]
    }
    
    .search-wrapper {
      @apply w-[280px] h-[40px]
    }
    
    .operation {
      @apply flex gap-4
    }
    
    .customize-table {
      --easy-table-border: 1px solid #EBEBED;
      --easy-table-header-font-size: 14px;
      --easy-table-header-background-color: transparent;
      --easy-table-header-font-color: #6E6E78;
      --easy-table-header-height: 40px;
    
      --easy-table-body-row-font-size: 14px;
      --easy-table-body-font-color: #3A3A3E;
      --easy-table-body-row-height: 46px;
    
      --easy-table-footer-font-size: 12px;
      --easy-table-footer-height: 40px;
      --easy-table-footer-font-color: #6E6E78;
      border-collapse: collapse;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      overflow: hidden;
    }
    
    
    .summaryChip {
      @apply h-10 w-full flex border-2 rounded-lg cursor-pointer
    }
    </style>
      