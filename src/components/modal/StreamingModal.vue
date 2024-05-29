<template>
  <div>
    <!-- <alert :message="status.message" :modalActive="modalActive" :isError="status.isError" @close="closeNotification" /> -->
    <transition name="fade">
      <div class="modal" v-show="isOpen">
        <transition name="drop-in">
          <div class="modal-inner" v-show="isOpen" ref="target">
            <div class="modal-content">
              <div class="flex justify-between mb-6 border-b-[1px] pb-[18px]">
                <h1 class="title">{{ title }}</h1>
                <div class="close-btn cursor-pointer" @click="emits('close')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    style="fill: #3a3a3e;transform: ;msFilter: ;">
                    <path
                      d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z">
                    </path>
                  </svg>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div class="flex gap-2">
                  <label>Device: </label>
                  <p>{{ props.imei }}</p>
                </div>
                <div class="flex gap-2">
                  <label>Token: </label>
                  <p>{{ streamingToken }}</p>
                </div>
                <div class="flex pt-4">
                  <BaseButton type="button" class="filled__green" label="Go to Streaming Page" @click="openStreaming" />
                </div>
              </div>

              <!-- <VeeForm :validation-schema="addSiteSchema" v-slot="{ handleSubmit }" as="div" ref="form" >
              <form  @submit="handleSubmit($event, onSubmit)" class="form-wrapper" >
                <BaseInput name="name" type="text" placeholder="Define site name" class="outlined" label="Site Name"/>
                <BaseInput name="phone" type="tel" placeholder="Type site phone number" class="outlined" label="Site Phone Number"/>
                <div class="flex justify-between gap-10">
                  <BaseButton type="submit" class="filled__green" :label="registerLabel" :loading="isLoading"  />
                </div>
              </form>
            </VeeForm> -->
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>


<script setup>
import BaseButton from '@/components/button/BaseButton.vue'
import { useSitesStore } from '@/stores/master-data/sitesStore'
import { storeToRefs } from 'pinia'
import { onUpdated, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useStreamingStore } from '@/stores/streaming/streamingStore'

const props = defineProps({
  isOpen: Boolean,
  title: String,
  imei: String
})

const modalActive = ref(false)
const streamingStore = useStreamingStore()
const { streamingToken, getStreamingTokenIsLoading, streamingTokenStatus } = storeToRefs(useStreamingStore())

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

const closeNotification = () => {
  modalActive.value = false
}
// Define custom events
const emits = defineEmits(['close'])
const target = ref(null)
onClickOutside(target, () => {
  if (props.isOpen) {
    emits('close')
  }
})

onUpdated(async () => {
  if (props.isOpen) {
    await streamingStore.getStreamingToken()
  }
})

function openStreaming() {
  let streamingUrl = `http://47.252.16.64:9966/vss/apiPage/RealVideo.html?token=${streamingToken.value}&deviceId=${props.imei}&chs=1_2&stream=0&wnum=4&panel=1&buffer=2000`
  window.open(streamingUrl, '_blank');
}

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
  @apply fixed top-0 left-0 w-full h-full overflow-x-hidden overflow-y-auto bg-[#ABADAF]/20 z-10
}

.modal-inner {
  @apply max-w-[500px] my-[100px] mx-auto
}

.modal-content {
  @apply relative w-[600px] p-[40px] bg-white gap-[30px] rounded-xl
}

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
  transition: all 0.3s ease-out;
}

.drop-in-enter-from,
.drop-in-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
</style>