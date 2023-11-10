<template>
<div>
<alert 
  :message ="status.message"
  :modalActive="modalActive"
  :isError="status.isError"
  @close="closeNotification" 
/>
<transition name="fade">
  <div class="modal" v-show="isOpen">
   <transition name="drop-in">
     <div class="modal-inner" v-show="isOpen" ref="target">
       <div class="modal-content">
       <h1 class="title">{{title}}</h1>
       <VeeForm :validation-schema="updateSiteSchema" v-slot="{ handleSubmit }" as="div" ref="form" >
         <form  @submit="handleSubmit($event, onSubmit)" class="form-wrapper" >
            <BaseInput v-model="props.formData.name" name="name" type="text" placeholder="Define manufacturer name" class="outlined" label="Manufacturer Name"/>
            <BaseInput v-model="props.formData.phone" name="phone" type="tel" placeholder="Type site phone number" class="outlined" label="Site Phone Number"/>
           <div class="flex justify-between gap-10">
             <BaseButton type="button" class="filled__softblue" :label="cancelLabel" @click="cancelForm"/>
             <BaseButton type="submit" class="filled__green" :label="registerLabel" :loading="isLoading"  />
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
import { useSitesStore } from '@/stores/master-data/sitesStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { updateSiteSchema } from '@/composable/sitesSchema'
 
  const props = defineProps({
      isOpen: Boolean,
      title: String,
      formData: {
        type: Object,
        default: () => ({name: '', phone: ''})
      }
  })

  const modalActive = ref(false)
  const sitesStore = useSitesStore()
  const { status, isLoading } = storeToRefs(useSitesStore())
  const cancelLabel = ref('CANCEL')
  const registerLabel = ref('SUBMIT')
  const regButtonClick = ref(0)
  const cancelButtonClick = ref(0)
  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

  const onSubmit = async (values, { resetForm }) => {
    regButtonClick.value = ++regButtonClick.value
    if (regButtonClick.value == 1) {
      registerLabel.value = 'the data entered is correct?'
    }

    if (regButtonClick.value == 2) {
      await sitesStore.updateSite(props.formData.id,values) 
      modalActive.value = true
      if (!status.value.isError) {
        resetForm()
      }
      setTimeout(closeNotification, 3000)
      registerLabel.value = 'SUBMIT'
      emits('close')
      await delay(300)
      regButtonClick.value = 0
      sitesStore.getSites()

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


  
  </style>