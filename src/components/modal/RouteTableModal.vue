<template>
  <transition name="fade">
    <div class="modal" v-show="isOpen">
      <transition name="drop-in">
        <div class="modal-inner" v-show="isOpen">
          <div class="modal-content">
            <div class="flex justify-between items-start mb-6 border-b-[1px] pb-[18px]">
              <h1 class="title">{{title}}</h1>
              <div class="flex justify-center items-center gap-2 cursor-pointer" @click="closeModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="black"/>
                </svg>
                <h1  class="text-sm font-bold">Close</h1>
              </div>
            </div>
            <div class="main flex flex-col text-left gap-4">
              <EasyDataTable v-if="isOpen"
                :rows-per-page="10"
                table-class-name="customize-table"
                :headers="header"
                :items="props.tableData"
                theme-color="#1363df">
                <template #item-coordinate="item">
                  <a :href="item.coordinate.maps" target="_blank">{{item.coordinate.latLong}}</a>
                </template>
              </EasyDataTable>
              <download-csv
                class   = "btn btn-default mt-6 justify-end flex"
                :data   = "props.tableData"
                :name    = "fileName">
                <div class="button-wrapper">
                    <BasicButton label="Export CSV" class="outlined__green" />
                </div>
              </download-csv>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

  
<script setup>

import { storeToRefs } from 'pinia'
import { ref, onMounted, onBeforeUpdate } from 'vue'
import BasicButton from '../button/BaseButton.vue'


  const header = [
    { text: "Time", value: "deviceTime" ,sortable: true},
    { text: "Hull Number", value: "hullNumber",sortable: true },
    { text: "Registration Number", value: "registrationNumber",sortable: true },
    { text: "Site", value: "site",sortable: true },
    { text: "Contractor", value: "contractor",sortable: true },
    { text: "Speed (Km/h)", value: "speed", sortable: true },
    { text: "Violation", value: "eventIo", sortable: true },
    { text: "Coordinate", value: "coordinate"},
    { text: "", value: "operation"},
  ]
  const props = defineProps({
      isOpen: Boolean,
      title: String,
      tableData:
      {
        type:Object,
        default: () => ([{name: 'null', id: 'null'}])
      },
      startDate: String,
      endDate: String,
      startTime: String,
      endTime: String
  })
  // Define custom events
  const emits = defineEmits(['close'])

  
  onBeforeUpdate( async() => {
    console.log(props.tableData)
  })

  function closeModal() {
    emits('close')
  }

  const fileName = ref(String(props.startDate + '_' + props.endDate) + '_Route_Detail.csv')

</script>
  
  <style scoped>

  .title {
    @apply text-left  text-[24px] font-normal text-[#8E8E93] 
  }
  

  .message-wrapper {
    @apply flex items-center gap-2
  }
  
  .form-wrapper{
    @apply flex flex-col gap-6
  }

  
.modal {
  @apply
    fixed top-0 left-0 w-full h-full
    overflow-x-hidden overflow-y-auto
    bg-[#ABADAF]/20 z-10 flex items-end
    pl-14 pr-2
}

.modal-inner {
  @apply 
  z-50 w-full
}

.modal-content {
  @apply 
    relative p-[40px] bg-white gap-[30px] rounded-t-xl z-50
}


/* .drop-in-enter-active,
.drop-in-leave-active {
  transition: transform 0.5s ease-in-out;
}

.drop-in-enter-from {
  transform: translateY(100%);
}

.drop-in-leave-to {
  transform: translateY(100%);
} */

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

.checkbox-wrapper {
  @apply flex flex-col gap-1 text-left 
}

.checkbox-field {
  @apply flex gap-2 bg-[#F2F2F2] px-6 py-3 w-full
        rounded-[5px] border border-[#CFCFCF] text-sm select-none
}

input[type=checkbox] {
  @apply cursor-pointer
}

label {
  @apply  text-[14px] font-medium
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