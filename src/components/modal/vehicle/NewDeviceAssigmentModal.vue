<template>
  <div>
  <alert 
  :message ="status.message"
    :modalActive="modalActive"
    :isError="status.isError"
     @close="closeNotification" />
     <transition name="fade">
       <div class="modal" v-show="isOpen">
        <transition name="drop-in">
          <div class="modal-inner" v-show="isOpen" ref="target">
            <div class="modal-content">
            <h1 class="title">{{title}}</h1>
            <VeeForm v-slot="{ handleSubmit }" as="div" ref="form" >
              <form  @submit="handleSubmit($event, onSubmit)" class="form-wrapper" >
                <div class="checkbox-wrapper"> 
                  <label>Devices</label>
                  <p v-if="!deviceDrafts.length" class="checkbox-field">No Device Availabe</p>
                  <div v-else class="checkbox-field" v-for="draft in deviceDrafts" :key="draft.id">
                    <input :id="draft.id" type="checkbox" :value="draft.id" v-model="selectedDevices"> 
                    <label class="cursor-pointer" :for="draft.id" >
                      {{ draft.imeiNumber }} - {{ draft.type }}
                    </label>
                  </div>
                </div>
                <div class="flex justify-between gap-10">
                  <BaseButton type="button" class="filled__softblue" :label="cancelLabel" @click="cancelForm"/>
                  <BaseButton type="submit" class="filled__green" :label="registerLabel" :loading="bindDeviceBindingIsLoading"  />
                </div>
              </form>
            </VeeForm>
          </div>
        </div>
      </transition>
    </div>
  </transition>
  </div>
</template>

  
<script setup>
import BaseButton from '@/components/button/BaseButton.vue'
import { Form as VeeForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { ref, onMounted, onBeforeUpdate } from 'vue'
import { onClickOutside } from '@vueuse/core'

import { useDevicesStore } from '@/stores/master-data/devicesStore'
import { useDeviceBindingStore } from '@/stores/transactions/deviceBindingStore'


  const props = defineProps({
      isOpen: Boolean,
      title: String,
      vehicleId: String
  })

  const selectedDevices = ref([])

  //stores
  const devicesStore = useDevicesStore()
  const deviceBindingStore = useDeviceBindingStore()
  const { deviceDrafts } = storeToRefs(useDevicesStore())
  const { bindDeviceBindingIsLoading, status } = storeToRefs(useDeviceBindingStore())

  onMounted(() => {
    devicesStore.getDeviceDrafts()
  })

  onBeforeUpdate(()=> {
    devicesStore.getDeviceDrafts()
  })

  const modalActive = ref(false)
  const cancelLabel = ref('CANCEL')
  const registerLabel = ref('REGISTER')
  const regButtonClick = ref(0)
  const cancelButtonClick = ref(0)
  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))
 
  const onSubmit = async (values, { resetForm }) => {
    let payload = {
      deviceIds: selectedDevices.value
    }
    regButtonClick.value = ++regButtonClick.value
    if (regButtonClick.value == 1) {
      registerLabel.value = 'the data entered is correct?'
    }

    if (regButtonClick.value == 2) {

      await deviceBindingStore.bindDevices(props.vehicleId,payload)
      modalActive.value = true
      if (status.value.isError) {
        setTimeout(closeNotification, 3000)
      } else {
        setTimeout(closeNotification, 3000)
        resetForm()
      }
      registerLabel.value = 'REGISTER'
      regButtonClick.value = 0
      await delay(1000)
      emits('close')
      deviceBindingStore.getBindedDevices(props.vehicleId)
    }
  }

  const closeNotification = () => {
    modalActive.value = false
  }
  // Define custom events
  const emits = defineEmits(['close'])
  
  const form = ref(null)
  const target = ref(null)

  onClickOutside(target, () => {
    if (props.isOpen) {
      emits('close')
    }
  })

  function cancelForm() {
    cancelButtonClick.value = ++cancelButtonClick.value
    switch (cancelButtonClick.value) {
      case 1:
      cancelLabel.value = 'The entered data will be lost!'
        break;
      case 2:
      form.value.resetForm()
      emits('close')
      cancelButtonClick.value = 0
      cancelLabel.value = 'CANCEL'
        break;
    }
  }


</script>
  
  <style scoped>

  .title {
    @apply text-left border-b-[1px] pb-[18px] text-[24px] font-normal text-[#8E8E93] mb-6
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
    bg-[#ABADAF]/20 z-10
}

.modal-inner {
  @apply 
    max-w-[500px] my-[100px] mx-auto
}

.modal-content {
  @apply 
    relative w-[600px] p-[40px] bg-white gap-[30px] rounded-xl
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

.select-option {
@apply  px-6 py-3
        rounded-[5px] border border-[#CFCFCF] bg-[#F2F2F2]
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