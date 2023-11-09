<template>
  
  <ViolationSummaryModal 
    :isOpen="isModalPops"
    @close="isModalPops = !isModalPops"
    :deviceInfo="summaryData"/>

  <div class="px-[30px] py-[57px] flex flex-col gap-5">
    <div class="flex flex-col gap-5 text-left pb-5 border-b border-[#353535]/40">
      <h1 class="text-sm font-bold">Summary</h1>
      <div class="grid grid-cols-6 gap-10">
        <div class="summaryChip border-[#BA000D]" @click="isModalPops=true">
          <div class="w-1/2 flex justify-center items-center text-[#BA000D] font-semibold">
            5
          </div>
          <div class="w-1/2 bg-[#BA000D] flex justify-center items-center text-white font-semibold">
            OV
          </div>
        </div>
        <div class="border-[#5E9A76] summaryChip" @click="isModalPops=true">
          <div class="w-1/2 flex justify-center items-center text-[#5E9A76] font-semibold">
            5
          </div>
          <div class="w-1/2 bg-[#5E9A76] flex justify-center items-center text-white font-semibold">
            CC
          </div>
        </div>
        <div class="border-[#C76ABD] summaryChip" @click="isModalPops=true">
          <div class="w-1/2 flex justify-center items-center text-[#C76ABD] font-semibold">
            5
          </div>
          <div class="w-1/2 bg-[#C76ABD] flex justify-center items-center text-white font-semibold">
            CD
          </div>
        </div>
        <div class="border-[#DF8400] summaryChip" @click="isModalPops=true">
          <div class="w-1/2 flex justify-center items-center text-[#DF8400] font-semibold">
            5
          </div>
          <div class="w-1/2 bg-[#DF8400] flex justify-center items-center text-white font-semibold">
            FT
          </div>
        </div>
        <div class="border-[#E30088] summaryChip" @click="isModalPops=true">
          <div class="w-1/2 flex justify-center items-center text-[#E30088] font-semibold">
            5
          </div>
          <div class="w-1/2 bg-[#E30088] flex justify-center items-center text-white font-semibold">
            SM
          </div>
        </div>
        <div class="border-[#68006F] summaryChip" @click="isModalPops=true">
          <div class="w-1/2 flex justify-center items-center text-[#68006F] font-semibold">
            5
          </div>
          <div class="w-1/2 bg-[#68006F] flex justify-center items-center text-white font-semibold">
            DU
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-6 gap-x-10">
      <div class="flex flex-col gap-[5px]" v-for="haul in haulList">
        <div class="h-12 w-full flex rounded-lg bg-[#5863BB] justify-center items-center text-white font-semibold">
          {{haul.haulNumber}}
        </div>
        <div class="flex gap-[5px] w-full">
          <div class="h-10 w-1/2 flex justify-center items-center  font-semibold border-2  rounded-lg" :class="haul.isRed? 'text-[#93C76A] border-[#93C76A]' : 'text-[#BA000D] border-[#BA000D]'">
            {{ haul.kosongan }}
          </div>
          <div class="h-10 w-1/2 flex justify-center items-center text-white font-semibold rounded-lg" :class="haul.isRed? 'bg-[#93C76A]' : 'bg-[#BA000D]'">
            {{haul.muatan}}
          </div>
        </div>
        <div class="flex flex-col" v-if="!haul.isBottom">
          <div class="border w-full border-[#353535]/50"></div>
          <span class="arrow">&#x2193;</span>
        </div>
      </div>
    </div>
    <div class="px-6 py-4 rounded bg-white shadow-md border w-fit flex flex-col gap-5 text-left">
      <h1 class="text-sm font-bold">Information</h1>
      <div class="flex gap-5 items-center">
        <div class="flex gap-[5px] w-[200px]">
          <div class="h-10 w-1/2 flex justify-center items-center  font-medium text-sm border-2 rounded-lg text-[#93C76A] border-[#93C76A]">
            Kosongan
          </div>
          <div class="h-10 w-1/2 flex justify-center items-center text-white font-medium text-sm rounded-lg bg-[#93C76A]">
            Muatan
          </div>
        </div>
        <div class="border h-[40px]"></div>
          <p>Kosongan <span class="font-semibold">88</span></p>
        <div class="border h-[40px]"></div>
          <p>Muatan <span class="font-semibold">250</span></p>
      </div>
    </div>
  </div>
</template>
      
<script setup>
  import ViolationSummaryModal from '@/components/modal/violation/ViolationSummaryModal'
  import { ref } from 'vue'

  const isModalPops = ref(false)
  let haulList = [
    { haulNumber: 'KM 30', isRed: false, isBottom: false, kosongan: '2', muatan: '12' },{ haulNumber: 'KM 25', isRed: false, isBottom: false, kosongan: '9', muatan: '12' },{ haulNumber: 'KM 20', isRed: false, isBottom: false, kosongan: '24', muatan: '124' },{ haulNumber: 'KM 15', isRed: true, isBottom: false, kosongan: '236', muatan: '12' },{ haulNumber: 'KM 10', isRed: false, isBottom: false, kosongan: '24', muatan: '766' },{ haulNumber: 'KM 5', isRed: false, isBottom: false, kosongan: '12', muatan: '12' },
    { haulNumber: 'KM 29', isRed: true, isBottom: false, kosongan: '30', muatan: '2' },{ haulNumber: 'KM 24', isRed: false, isBottom: false, kosongan: '6', muatan: '34' },{ haulNumber: 'KM 19', isRed: true, isBottom: false, kosongan: '26', muatan: '64' },{ haulNumber: 'KM 14', isRed: false, isBottom: false, kosongan: '2', muatan: '45' },{ haulNumber: 'KM 9', isRed: true, isBottom: false, kosongan: '45', muatan: '54' },{ haulNumber: 'KM 4', isRed: false, isBottom: false, kosongan: '124', muatan: '2' },
    { haulNumber: 'KM 28', isRed: false, isBottom: false, kosongan: '1', muatan: '34' },{ haulNumber: 'KM 23', isRed: true, isBottom: false, kosongan: '12', muatan: '74' },{ haulNumber: 'KM 18', isRed: false, isBottom: false, kosongan: '6', muatan: '78' },{ haulNumber: 'KM 13', isRed: false, isBottom: false, kosongan: '62', muatan: '12' },{ haulNumber: 'KM 8', isRed: false, isBottom: false, kosongan: '63', muatan: '43' },{ haulNumber: 'KM 3', isRed: false, isBottom: false, kosongan: '53', muatan: '2' },
    { haulNumber: 'KM 27', isRed: false, isBottom: false, kosongan: '6', muatan: '300' },{ haulNumber: 'KM 22', isRed: false, isBottom: false, kosongan: '122', muatan: '46' },{ haulNumber: 'KM 17', isRed: false, isBottom: false, kosongan: '7', muatan: '46' },{ haulNumber: 'KM 12', isRed: true, isBottom: false, kosongan: '2', muatan: '3' },{ haulNumber: 'KM 7', isRed: true, isBottom: false, kosongan: '56', muatan: '12' },{ haulNumber: 'KM 2', isRed: false, isBottom: false, kosongan: '5', muatan: '24' },
    { haulNumber: 'KM 26', isRed: false, isBottom: true, kosongan: '8', muatan: '16' },{ haulNumber: 'KM 21', isRed: false, isBottom: true, kosongan: '25', muatan: '664' },{ haulNumber: 'KM 16', isRed: false, isBottom: true, kosongan: '12', muatan: '65' },{ haulNumber: 'KM 11', isRed: false, isBottom: true, kosongan: '63', muatan: '66' },{ haulNumber: 'KM 6', isRed: true, isBottom: true, kosongan: '32', muatan: '21' },{ haulNumber: 'KM 1', isRed: false, isBottom: true, kosongan: '2', muatan: '765' },
  ]

</script>
      
    <style scoped>

.arrow {
      font-size: 32px; /* Adjust the font size as needed */
    }
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
    overflow: hidden;
  }


  .summaryChip {
    @apply h-10 w-full flex border-2 rounded-lg cursor-pointer
  }
  </style>
  