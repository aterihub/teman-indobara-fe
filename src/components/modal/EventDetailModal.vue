<template>
  <!-- <transition name="fade"> -->
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
            <div class="main flex flex-col text-left gap-10">
              <!-- <h1 v-if="!isThereEvent" class="font-normal">No Events</h1> -->
              <div class="flex flex-col gap-4">
                <div class="flex justify-between">
                  <div  class="text-left flex gap-2">
                    <h1 class="font-semibold">Violation: </h1>
                    <h1 class="font-normal">{{eventData.event}}</h1>
                  </div>
                  <div  class="text-left flex gap-2">
                    <h1 class="font-semibold">Time: </h1>
                    <h1 class="font-normal">{{eventData._time}}</h1>
                  </div>
                </div>
                <div class="flex gap-6">
                  <div  class="text-left flex flex-col gap-2">
                    <h1 class="font-semibold">Contractor</h1>
                    <h1 class="font-normal">{{eventData.contractor}}</h1>
                  </div>
                  <div  class="text-left flex flex-col gap-2">
                    <h1 class="font-semibold">Hull Number</h1>
                    <h1 class="font-normal">{{eventData.hullNumber}}</h1>
                  </div>
                  <div  class="text-left flex flex-col gap-2">
                    <h1 class="font-semibold">Registration Number</h1>
                    <h1 class="font-normal">{{eventData.registrationNumber}}</h1>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-left flex flex-col gap-4">
                  <h1 class="font-semibold">Captured Image: </h1>
                  <!-- <div v-if="!isEventImageFound" class="bg-gray-200 w-full min-h-[323px] flex items-center justify-center rounded-lg">
                    <h1 class="font-medium">Device not send the captured image</h1>
                  </div> -->
                  <img
                    id="eventImage" 
                    :src="eventImageSrc" 
                    alt="Event Captured"
                    :key="imageKey"
                    @error="handleImageError">
                </div>
                <div class="text-left flex flex-col gap-4 ">
                  <h1 class="font-semibold">Meta Data: </h1>
                  <div class="w-full h-full border rounded-lg">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  <!-- </transition> -->
</template>

  
<script setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted, onBeforeUpdate } from 'vue'
import{ useEventDevicesStore } from '@/stores/event/eventDevicesStore'

  const props = defineProps({
      isOpen: Boolean,
      title: String,
      imei:String,
      queryParams: Object
  })
  const eventStore = useEventDevicesStore()
  const { eventStatus, eventData, eventFootageData, getEventDataIsLoading } = storeToRefs(useEventDevicesStore())

  // let eventImageSrc = process.env.VUE_APP_IMG_URL + '866728069247798/2023-11-22%2012:58:21.000.jpg'
  const eventImageSrc = ref('')
  let imageKey = 1
  // Define custom events
  const emits = defineEmits(['close'])
  const isThereEvent = ref(false)

  
  onBeforeUpdate( async() => {
    isThereEvent.value = false
    await eventStore.getEventDevices(props.imei, props.queryParams)
    if (!eventStatus.value.isError) {
      if (eventFootageData.value.length > 0) {
        let txtPath = eventFootageData.value[0].filename + '.txt'
        eventStore.getEventMeta(props.imei, txtPath)
        eventImageSrc.value = process.env.VUE_APP_IMG_URL + eventFootageData.value[0].imei + '/' + eventFootageData.value[0].filename + '.jpg'
        imageKey += 1
      } else {
        eventImageSrc.value = require('../../assets/img/image-not-found.png')
        imageKey += 1
      }
      if (Object.keys(eventData.value).length > 0) {
        isThereEvent.value = true
      }
    }
  })

  function closeModal() {
    emits('close')
  }

  function handleImageError(event) {
    event.target.src = require('../../assets/img/image-not-found.png')
    console.log("Image not found or failed to load")
  }

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


.drop-in-enter-active,
.drop-in-leave-active {
  transition: transform 0.5s ease-in-out;
}

.drop-in-enter-from {
  transform: translateY(100%);
}

.drop-in-leave-to {
  transform: translateY(100%);
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


  </style>