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
       <VeeForm  v-slot="{ handleSubmit }" as="div" ref="form" >
         <form  @submit="handleSubmit($event, onSubmit)" :validation-schema="updateContractorSchema" class="form-wrapper" >
            <BaseInput v-model="props.formData.name" name="name" type="text" placeholder="Define contractor name" class="outlined" label="Contractor Name"/>
            <BaseInput v-model="props.formData.address" name="address" type="text" placeholder="Fill contractor address" class="outlined" label="Contractor Address"/>
            <BaseInput v-model="props.formData.picName" name="picName" type="text" placeholder="Fill PIC name" class="outlined" label="PIC Name"/>
            <BaseInput v-model="props.formData.picPhone" name="picPhone" type="tel" placeholder="Fill PIC phone number" class="outlined" label="PIC Phone Number"/>
            <!-- <BaseInput :modelValue="props.formData.formattedContractStart" v-model="props.formData.contractStart" name="contractStart" type="date" placeholder="When contract start?" class="outlined" label="Contract Start Date"/> -->
            <!-- <BaseInput :modelValue="props.formData.formattedContractEnd" v-model="props.formData.contractEnd" name="contractEnd" type="date" placeholder="When contract expired?" class="outlined" label="Contract Expired Date"/> -->
           <div class="flex justify-between gap-10">
             <BaseButton type="button" class="filled__softblue" :label="cancelLabel" @click="cancelForm"/>
             <BaseButton type="submit" class="filled__green" :label="registerLabel" :loading="updateContractorsIsLoading"  />
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
import BaseButton from '@/components/button/BaseButton.vue'
import { Form as VeeForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
// import { useSitesStore } from '@/stores/master-data/sitesStore'
import { updateContractorSchema } from '@/composable/contractorSchema'
import { useContractorsStore } from '@/stores/master-data/contractorsStore'
 
  const props = defineProps({
      isOpen: Boolean,
      title: String,
      formData: {
        type: Object,
        default: () => ({name: '', phone: '', picName: '',picPhone: ''})
      }
  })

  const modalActive = ref(false)
  const contratorsStore = useContractorsStore()
  const { status, updateContractorsIsLoading } = storeToRefs(useContractorsStore())
  const cancelLabel = ref('CANCEL')
  const registerLabel = ref('SUBMIT')
  const regButtonClick = ref(0)
  const cancelButtonClick = ref(0)
  
  const onSubmit = async (values, { resetForm }) => {
    regButtonClick.value = ++regButtonClick.value
    if (regButtonClick.value == 1) {
      registerLabel.value = 'the data entered is correct?'
    }

    if (regButtonClick.value == 2) {
      await contratorsStore.updateContractor(props.formData.id,values) 
      modalActive.value = true
      if (!status.value.isError) {
        resetForm()
      }
      emits('close')
      setTimeout(closeNotification, 3000)
      registerLabel.value = 'SUBMIT'
      regButtonClick.value = 0
      contratorsStore.getContractors()

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


  
  </style>