<template>
  <transition name="fade">
    <div class="modal" v-show="isOpen">
      <transition name="drop-in">
        <div class="modal-inner" v-show="isOpen">
          <div class="modal-content">
            <div class="flex justify-between items-start mb-6 border-b-[1px] pb-[18px]">
              <h1 class="title">{{ title }}</h1>
              <div class="flex justify-center items-center gap-2 cursor-pointer" @click="closeModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                    fill="black" />
                </svg>
                <h1 class="text-sm font-bold">Close</h1>
              </div>
            </div>
            <div class="main flex flex-col text-left gap-10">
              <!-- <h1 v-if="!isThereEvent" class="font-normal">No Events</h1> -->
              <div class="flex flex-col gap-4">
                <div class="flex justify-between">
                  <div class="text-left flex gap-2">
                    <h1 class="font-semibold">Violation: </h1>
                    <h1 class="font-normal">{{ eventData.event }}</h1>
                  </div>
                  <div class="text-left flex gap-2">
                    <h1 class="font-semibold">Time: </h1>
                    <h1 class="font-normal">{{ eventData._time }}</h1>
                  </div>
                </div>
                <div class="flex gap-6">
                  <div class="text-left flex flex-col gap-2">
                    <h1 class="font-semibold">Contractor</h1>
                    <h1 class="font-normal">{{ eventData.contractor }}</h1>
                  </div>
                  <div class="text-left flex flex-col gap-2">
                    <h1 class="font-semibold">Hull Number</h1>
                    <h1 class="font-normal">{{ eventData.hullNumber }}</h1>
                  </div>
                  <div class="text-left flex flex-col gap-2">
                    <h1 class="font-semibold">Registration Number</h1>
                    <h1 class="font-normal">{{ eventData.registrationNumber }}</h1>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div class="text-left flex flex-col gap-4">
                  <h1 class="font-semibold">Captured Image: </h1>
                  <!-- <div v-if="!isEventImageFound" class="bg-gray-200 w-full min-h-[323px] flex items-center justify-center rounded-lg">
                    <h1 class="font-medium">Device not send the captured image</h1>
                  </div> -->
                  <div class="w-fit border rounded-lg flex flex-col overflow-clip">
                    <img v-if="!imgLoading" id="eventImage" class="object-cover max-w-lg" :src="eventImageSrc"
                      alt="Event Captured" :key="imageKey" @error="handleImageError">
                    <SmallLoading class="h-full w-full" :loading="imgLoading" v-if="imgLoading" />
                  </div>
                  <!-- <video controls="" autoplay="" name="media">
                    <source src="http://vss.howentech.com/fileSrv/fileDown.php?filePath=QzovUHJvZ3JhbSBGaWxlcyAoeDg2KS9Wc3NTZXJ2aWNlL3N0b3JhZ2UvYmluL3g2NC8uLi8uLi8uLi9odGRvY3MvdnNzRmlsZXMvaGZ0cC9BSS8yMDI0MDUyOS8yMDI0MDUxNTAwMS8xNTU5MzdfNjUvMF82NF82NV8yXzE3MTY5OTgzNzcubXA0&token=6e6f64307e566e2d371ac4b840476b9c&ipaddr=127.0.0.1" type="video/mp4">
                  </video> -->
                  <!-- <video ref="videoPlayer" class="video-js"></video> -->
                </div>
                <!-- <div class="text-left flex flex-col gap-4 ">
                  <h1 class="font-semibold">Meta Data: </h1>
                  <div class="w-full h-full border rounded-lg p-6 gap-4 flex flex-col">
                    <div v-if="!isEventFootageDataEmpty" class="flex gap-2">
                      <p>Stored Time:</p>
                      <p class="font-medium">{{ eventFootageData[0].storedTime }}</p>
                    </div>
                    <div v-if="!isEventFootageDataEmpty" class="flex gap-2">
                      <p>Time Difference:</p>
                      <p class="font-medium">{{ eventFootageData[0].differsTime }}</p>
                    </div>
                    <div v-if="!isEventFootageDataEmpty" v-for="([key, value]) in Object.entries(eventMeta)"
                      :key="key" class="flex gap-2">
                      <p>{{ key }}: </p>
                      <p class="font-medium">{{ value }}</p>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>


<script setup>
import { storeToRefs } from 'pinia'
import { ref, onBeforeUpdate, onBeforeUnmount } from 'vue'
import { useEventDevicesStore } from '@/stores/event/eventDevicesStore'
import SmallLoading from '../SmallLoading.vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const props = defineProps({
  isOpen: Boolean,
  title: String,
  imei: String,
  queryParams: Object
})
const eventStore = useEventDevicesStore()
const { eventStatus, eventData, eventFootageData, eventMeta, isEventFootageDataEmpty, getEventDataIsLoading } = storeToRefs(useEventDevicesStore())

// let eventImageSrc = process.env.VUE_APP_IMG_URL + '866728069247798/2023-11-22%2012:58:21.000.jpg'
const eventImageSrc = ref('')
const eventVideoSrc = ref('')
let imageKey = 1
// Define custom events
const emits = defineEmits(['close'])
const isThereEvent = ref(false)

const imgLoading = ref(false)
onBeforeUpdate(async () => {
  imgLoading.value = true
  isThereEvent.value = false
  eventImageSrc.value = require('../../assets/img/image-not-found.png')
  await eventStore.getEventDevices(props.imei, props.queryParams)
  console.log(props.queryParams)
  if (!eventStatus.value.isError) {
    if (!isEventFootageDataEmpty.value) {
      if (props.queryParams.alarmId !== 'null') {
        const thisImage = eventFootageData.value.find(value => value.filePath.includes('jpg'))
        const thisVideo = eventFootageData.value.find(value => value.filePath.includes('mp4'))
        let imageUrl = thisImage.downUrl.replace(":9988", "")
        let videoUrl = thisVideo.downUrl.replace(":9988", "")
        eventImageSrc.value = imageUrl
        eventVideoSrc.value = videoUrl
        console.log(eventVideoSrc.value)
        console.log(eventImageSrc.value)
      } else {
        let txtPath = eventFootageData.value[0].filename + '.txt'
        eventStore.getEventMeta(props.imei, txtPath)
        eventImageSrc.value = process.env.VUE_APP_IMG_URL + eventFootageData.value[0].imei + '/' + eventFootageData.value[0].filename + '.jpg'
        imageKey += 1
      }
    } else {
      eventImageSrc.value = require('../../assets/img/image-not-found.png')
      imageKey += 1
    }
    if (Object.keys(eventData.value).length > 0) {
      isThereEvent.value = true
    }
  }
  imgLoading.value = false

  // // Initialize video.js
  // player = videojs(videoPlayer.value, {
  //   controls: true,
  //   autoplay: true,
  // });

  // // Set the video source to the HEVC encoded MP4 file
  // player.src({
  //   // src: 'http://vss.howentech.com/fileSrv/fileDown.php?filePath=QzovUHJvZ3JhbSBGaWxlcyAoeDg2KS9Wc3NTZXJ2aWNlL3N0b3JhZ2UvYmluL3g2NC8uLi8uLi8uLi9odGRvY3MvdnNzRmlsZXMvaGZ0cC9BSS8yMDI0MDUyOS8yMDI0MDUxNTAwMS8xNTU5MzdfNjUvMF82NF82NV8yXzE3MTY5OTgzNzcubXA0&token=6e6f64307e566e2d371ac4b840476b9c&ipaddr=127.0.0.1', // Replace with your actual HEVC MP4 video URL
  //   src: 'https://www.w3schools.com/html/mov_bbb.mp',
  //   type: 'video/mp4',
  // });
})

function closeModal() {
  emits('close')
}

function handleImageError(event) {
  event.target.src = require('../../assets/img/image-not-found.png')
}

// // handle video
// const videoPlayer = ref(null)
// let player = null

// onBeforeUnmount(() => {
//   // Clean up the video player instance
//   if (player) {
//     player.dispose();
//   }
// });

</script>

<style scoped>
.title {
  @apply text-left text-[24px] font-normal text-[#8E8E93]
}


.message-wrapper {
  @apply flex items-center gap-2
}

.form-wrapper {
  @apply flex flex-col gap-6
}


.modal {
  @apply fixed top-0 left-0 w-full h-full overflow-x-hidden overflow-y-auto bg-[#ABADAF]/20 z-10 flex items-end pl-14 pr-2
}

.modal-inner {
  @apply z-50 w-full
}

.modal-content {
  @apply relative p-[40px] bg-white gap-[30px] rounded-t-xl z-50
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
  @apply flex gap-2 bg-[#F2F2F2] px-6 py-3 w-full rounded-[5px] border border-[#CFCFCF] text-sm select-none
}

input[type=checkbox] {
  @apply cursor-pointer
}

label {
  @apply text-[14px] font-medium
}
</style>