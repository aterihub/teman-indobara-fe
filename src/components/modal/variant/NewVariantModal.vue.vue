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
            <VeeForm :validation-schema="addVariantSchema" v-slot="{ handleSubmit }" as="div" ref="form" >
              <form  @submit="handleSubmit($event, onSubmit)" class="form-wrapper" >
                <div class="checkbox-wrapper"> 
                  <label>Variant Name</label>
                  <p class="checkbox-field">{{ props.formData }}</p>
                </div>
                <BaseInput name="variant" type="text" placeholder="Define variant name" class="outlined" label="Variant Name"/>
                <TextArea name="variantNotes" placeholder="Write notes for this variant" class="outlined" label="Variant Notes"></TextArea>
                <div class="flex justify-between gap-10">
                  <BaseButton type="button" class="filled__softblue" :label="cancelLabel" @click="cancelForm"/>
                  <BaseButton type="submit" class="filled__green" :label="registerLabel" :loading="createManufactureIsLoading"  />
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
import { storeToRefs } from 'pinia'
import { ref,onBeforeUpdate } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useManufacturersStore } from '@/stores/master-data/manufacturersStore'
import { addVariantSchema } from '@/composable/manufacturersSchema'

  const props = defineProps({
      isOpen: Boolean,
      title: String,
      formData: String
  })

  const modalActive = ref(false)
  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))
  const manufacturerStore = useManufacturersStore()
  const { status, createManufactureIsLoading } = storeToRefs(useManufacturersStore())
  const cancelLabel = ref('CANCEL')
  const registerLabel = ref('ADD')
  const regButtonClick = ref(0)
  const cancelButtonClick = ref(0)
  const params = {
      manufacturerName: props.formData
    }
  const onSubmit = async (values, { resetForm }) => {
    for (const key in values) {
      if (values[key] == null) {
        delete values[key];
      }
    }
    let newValues = values
    newValues.name = props.formData
    newValues.variant = newValues.variant.trim().toUpperCase()
    console.log(newValues)
    regButtonClick.value = ++regButtonClick.value
    if (regButtonClick.value == 1) {
      registerLabel.value = 'the data entered is correct?'
    }

    if (regButtonClick.value == 2) {

      await manufacturerStore.createManufacturer(newValues)
      modalActive.value = true
      if (status.value.isError) {
        setTimeout(closeNotification, 3000)
      } else {
        setTimeout(closeNotification, 3000)
        resetForm()
      }
      registerLabel.value = 'ADD'
      regButtonClick.value = 0
      emits('close')
      await delay(300)
      manufacturerStore.getManufacturer(params)
    }
  }
  onBeforeUpdate(()=> {
    params.manufacturerName = props.formData
  })
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
  @apply  px-3 py-2
          rounded-lg border border-[#D1D1D6]
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