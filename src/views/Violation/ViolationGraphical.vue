<template>
  <!-- <ViolationSummaryModal :isOpen="isModalPops" @close="isModalPops = !isModalPops" :deviceInfo="summaryData" /> -->
  <div class="flex justify-between items-center">
    <div class="flex flex-col gap-2">
      <h1 class="title">Violation Graphical</h1>
      <p>{{ new Date() }}</p>
    </div>
    <div class="px-6 py-4 rounded-lg bg-white shadow-md border w-fit flex flex-col gap-5 text-left">
      <p>Total: <span class="font-semibold">{{ violationsGraphic.totalCount }} Violations</span></p>
    </div>
  </div>

  <div class="grid grid-cols-8 gap-8">
    <div class="border  shadow rounded-md p-4 bg-[#5863BB]/60" v-for="item in 8" v-if="loading">
      <div class="animate-pulse flex space-x-4">
        <div class="flex-1 space-y-6 py-1">
          <div class="h-2 bg-slate-200 rounded"></div>
          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-4">
              <div class="h-2 bg-slate-200 rounded col-span-2"></div>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="h-2 bg-slate-200 rounded col-span-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-[5px]" v-for="graph in violationsGraphic.graphic">
      <div class="h-12 w-full flex rounded-lg bg-[#5863BB] justify-center items-center text-white font-semibold">
        {{ graph.name }}
      </div>
      <div
        class="h-10 flex justify-center items-center  font-semibold border-2  rounded-lg text-[#BA000D] border-[#BA000D]">
        {{ graph.count }}
      </div>
    </div>
  </div>
</template>
      
<script setup>
import ViolationSummaryModal from '@/components/modal/violation/ViolationSummaryModal'
import { useViolationsStore } from '@/stores/violation/violationsStore'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'

const violationsStore = useViolationsStore()
const { violationGraphicStatus, violationsGraphic, getViolationGraphicIsLoading } = storeToRefs(useViolationsStore())

const delay = require('delay')
const whileState = ref(true)
const loading = ref(true)

onMounted(async () => {
  await violationsStore.getViolationGraphic()
  loading.value = false
  while (whileState.value) {
    await violationsStore.getViolationGraphic()
    await delay(10000)
  }
})

onUnmounted(() => {
  whileState.value = false
})

const isModalPops = ref(false)
let haulList = [
  { haulNumber: 'KM 30', isRed: false, isBottom: false, kosongan: '2', muatan: '12' }, { haulNumber: 'KM 25', isRed: false, isBottom: false, kosongan: '9', muatan: '12' }, { haulNumber: 'KM 20', isRed: false, isBottom: false, kosongan: '24', muatan: '124' }, { haulNumber: 'KM 15', isRed: true, isBottom: false, kosongan: '236', muatan: '12' }, { haulNumber: 'KM 10', isRed: false, isBottom: false, kosongan: '24', muatan: '766' }, { haulNumber: 'KM 5', isRed: false, isBottom: false, kosongan: '12', muatan: '12' },
  { haulNumber: 'KM 29', isRed: true, isBottom: false, kosongan: '30', muatan: '2' }, { haulNumber: 'KM 24', isRed: false, isBottom: false, kosongan: '6', muatan: '34' }, { haulNumber: 'KM 19', isRed: true, isBottom: false, kosongan: '26', muatan: '64' }, { haulNumber: 'KM 14', isRed: false, isBottom: false, kosongan: '2', muatan: '45' }, { haulNumber: 'KM 9', isRed: true, isBottom: false, kosongan: '45', muatan: '54' }, { haulNumber: 'KM 4', isRed: false, isBottom: false, kosongan: '124', muatan: '2' },
  { haulNumber: 'KM 28', isRed: false, isBottom: false, kosongan: '1', muatan: '34' }, { haulNumber: 'KM 23', isRed: true, isBottom: false, kosongan: '12', muatan: '74' }, { haulNumber: 'KM 18', isRed: false, isBottom: false, kosongan: '6', muatan: '78' }, { haulNumber: 'KM 13', isRed: false, isBottom: false, kosongan: '62', muatan: '12' }, { haulNumber: 'KM 8', isRed: false, isBottom: false, kosongan: '63', muatan: '43' }, { haulNumber: 'KM 3', isRed: false, isBottom: false, kosongan: '53', muatan: '2' },
  { haulNumber: 'KM 27', isRed: false, isBottom: false, kosongan: '6', muatan: '300' }, { haulNumber: 'KM 22', isRed: false, isBottom: false, kosongan: '122', muatan: '46' }, { haulNumber: 'KM 17', isRed: false, isBottom: false, kosongan: '7', muatan: '46' }, { haulNumber: 'KM 12', isRed: true, isBottom: false, kosongan: '2', muatan: '3' }, { haulNumber: 'KM 7', isRed: true, isBottom: false, kosongan: '56', muatan: '12' }, { haulNumber: 'KM 2', isRed: false, isBottom: false, kosongan: '5', muatan: '24' },
  { haulNumber: 'KM 26', isRed: false, isBottom: true, kosongan: '8', muatan: '16' }, { haulNumber: 'KM 21', isRed: false, isBottom: true, kosongan: '25', muatan: '664' }, { haulNumber: 'KM 16', isRed: false, isBottom: true, kosongan: '12', muatan: '65' }, { haulNumber: 'KM 11', isRed: false, isBottom: true, kosongan: '63', muatan: '66' }, { haulNumber: 'KM 6', isRed: true, isBottom: true, kosongan: '32', muatan: '21' }, { haulNumber: 'KM 1', isRed: false, isBottom: true, kosongan: '2', muatan: '765' },
]

</script>
      
<style scoped>
.arrow {
  font-size: 32px;
  /* Adjust the font size as needed */
}

.content {
  @apply w-full h-fit ml-[60px] mt-[60px]
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
  