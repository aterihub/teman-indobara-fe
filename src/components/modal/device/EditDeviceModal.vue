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
            <VeeForm :validation-schema="addDeviceSchema" v-slot="{ handleSubmit }" as="div" ref="form" >
              <form  @submit="handleSubmit($event, onSubmit)" class="form-wrapper" >
                <BaseInput v-model="props.formData.imeiNumber" name="imeiNumber" type="text" placeholder="Enter your device IMEI here" class="outlined" label="IMEI Number"/>
                <BaseInput v-model="props.formData.simNumber" name="simNumber" type="tel" placeholder="Enter your SIM number here" class="outlined" label="SIM Number"/>
                <BaseInput v-model="props.formData.simProvider" name="simProvider" type="link" placeholder="Enter your SIM provider here" class="outlined" label="SIM Provider"/>
                <div class="flex flex-col gap-1 text-left">
                  <label for="contractorId" class="text-xs font-bold">Type</label>
                  <select name="contractorId" v-model="props.formData.type" class="cursor-pointer select-option text-sm" required>
                    <option class="text-sm" v-for="type in typesList" :key="type" :value="type">{{ type }}</option>
                  </select> 
                </div>
                <div class="flex flex-col gap-1 text-left">
                  <label for="contractorId" class="text-xs font-bold">Manufacturer</label>
                  <select name="contractorId" v-model="props.formData.manufacturerName" class="cursor-pointer select-option text-sm" @change="fillVariantsList(props.formData.manufacturerName)" required>
                    <option v-if="manufacturers == []" class="text-sm" value="0" disabled selected>No Manufacturer Available</option>
                    <option class="text-sm" v-for="manufacturer in manufacturers" :key="manufacturer.id" :value="manufacturer.manufacturerName">{{ manufacturer.manufacturerName }}</option>
                  </select> 
                </div>
                <div class="flex flex-col gap-1 text-left">
                  <label for="contractorId" class="text-xs font-bold">Variant</label>
                  <select name="contractorId" v-model="props.formData.variantName" class="cursor-pointer select-option text-sm" required>
                    <option v-if="variantsList == []" class="text-sm" value="0" disabled selected>No Variant Available</option>
                    <option class="text-sm" v-for="variant in variantsList" :key="variant.id" :value="variant.variant">{{ variant.variant }}</option>
                  </select> 
                </div>
                <TextArea v-model="props.formData.notes" name="notes" placeholder="Write notes for this device" class="outlined" label="Notes"></TextArea>
                <div class="flex justify-between gap-10"> 
                  <BaseButton type="button" class="filled__softblue" :label="cancelLabel" @click="cancelForm"/>
                  <BaseButton type="submit" class="filled__green" :label="registerLabel" :loading="updateDeviceIsLoading"  />
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
import BaseInput from '@/components/input/BaseInput.vue'
import TextArea from '@/components/input/TextArea.vue'
import BaseButton from '@/components/button/BaseButton.vue'
import { Form as VeeForm } from 'vee-validate'
import { addDeviceSchema } from '@/composable/devicesSchema'
import { storeToRefs } from 'pinia'
import { ref, onMounted, onBeforeUpdate } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useDevicesStore } from '@/stores/master-data/devicesStore'
import { useManufacturersStore } from '@/stores/master-data/manufacturersStore'

const props = defineProps({
      isOpen: Boolean,
      title: String,
      formData: {
        type: Object,
        default: () => ({imeiNumber: '', simNumber: '', simProvider: '',type: '', manufacturerName: '', variantName: '', notes: ''})
      }
  })

  let typesList = ['GPS','ADAS','DSM','ADAS_DSM','MDVR']
  const modalActive = ref(false)
  const devicesStore = useDevicesStore()
  const { status }= storeToRefs(useDevicesStore())
  const manufacturersStore = useManufacturersStore()
  const { updateDeviceIsLoading, manufacturers } = storeToRefs(useManufacturersStore())
  const cancelLabel = ref('CANCEL')
  const registerLabel = ref('REGISTER')
  const regButtonClick = ref(0)
  const cancelButtonClick = ref(0)
  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

  onMounted(() => {
    manufacturersStore.getManufacturers()
  })

  onBeforeUpdate(()=> {
    console.log(props.formData.manufacturerName)
    if (props.isOpen) {
      manufacturers.value.forEach(manufacturer => {
        if (manufacturer.manufacturerName === props.formData.manufacturerName) {
          variantsList.value = manufacturer.variants;
        }
      })
    }
  })

  const onSubmit = async (values, { resetForm }) => {
    let newValues = values
    newValues.manufacturerName = props.formData.manufacturerName
    newValues.variantName = props.formData.variantName
    newValues.type = props.formData.type
    for (const key in newValues) {
      if (newValues[key] == null) {
        delete newValues[key];
      }
    }
    console.log(newValues)
    regButtonClick.value = ++regButtonClick.value
    if (regButtonClick.value == 1) {
      registerLabel.value = 'the data entered is correct?'
    }

    if (regButtonClick.value == 2) {
      await devicesStore.updateDevice(props.formData.id,newValues)
      modalActive.value = true
      if (status.value.state == true ) {
        setTimeout(closeNotification, 3000)
      } else {
        setTimeout(closeNotification, 3000)
        resetForm()
      }
      registerLabel.value = 'REGISTER'
      regButtonClick.value = 0
      emits('close')
      await delay(1000)
      devicesStore.getDevices()
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
      registerLabel.value = 'REGISTER'
      regButtonClick.value = 0
    }
  })

  function cancelForm() {
    cancelButtonClick.value = ++cancelButtonClick.value
    switch (cancelButtonClick.value) {
      case 1:
      cancelLabel.value = 'The entered data will be lost!'
        break;
      case 2:
      emits('close')
      cancelButtonClick.value = 0
      cancelLabel.value = 'CANCEL'
        break;
    }
  }

  const variantsList = ref([])
  function fillVariantsList(item) {
    manufacturers.value.forEach(manufacturer => {
      if (manufacturer.manufacturerName === item) {
        variantsList.value = manufacturer.variants;
      }
    })
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

  
  </style>