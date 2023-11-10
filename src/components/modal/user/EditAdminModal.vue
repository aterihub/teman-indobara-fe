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
         <form  @submit="handleSubmit($event, onSubmit)" class="form-wrapper" >
          <BaseInput v-model="selectedRole" name="role" type="text" class="outlined pointer-events-none" label="Role" disabled/>
          <div class="flex flex-col gap-1 text-left">
            <label for="contractorId" class="text-xs font-bold">Contractor</label>
            <select name="contractorId" v-model="contractorId" class="cursor-pointer select-option text-sm" required>
              <option v-if="contractors == []" class="text-sm" value="0" disabled selected>No Contractor Available</option>
              <option class="text-sm" v-for="item in contractors" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select> 
          </div>
          <BaseInput name="username" type="text" placeholder="What your username" class="outlined" label="Username"/>
           <div class="flex justify-between gap-10">
             <BaseButton type="button" class="filled__softblue" :label="cancelLabel" @click="cancelForm"/>
             <BaseButton type="submit" class="filled__green" :label="registerLabel" :loading="updateVehicleIsLoading"  />
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
import { onBeforeUpdate, ref, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useUsersStore } from '@/stores/master-data/usersStore'
import { useContractorsStore } from '@/stores/master-data/contractorsStore'

  const props = defineProps({
      isOpen: Boolean,
      title: String,
      formData: {
        type: Object,
        default: () => ({role: null,contractorId: null, username: null, email: null,password: null, passwordConfirmation: null})
      }
  })

  const modalActive = ref(false)
  const cancelLabel = ref('CANCEL')
  const registerLabel = ref('SUBMIT')
  const regButtonClick = ref(0)
  const cancelButtonClick = ref(0)

  const updatePayload = ref({
    role: null, 
    contractorId: null, 
    username: null, 
    email: null,
    password: null, 
    passwordConfirmation: null
  })

  //stores
  const usersStore =  useUsersStore()
  const { status, createUserIsLoading, getUserIsLoading, users } = storeToRefs(useUsersStore())
  const contractorsStore = useContractorsStore()
  const { contractors } = storeToRefs(useContractorsStore())
  const delay = (time) =>
   new Promise((resolve) => setTimeout(resolve, time))

  onMounted(() => {
    contractorsStore.getContractors()
  })

  const onSubmit = async (values, { resetForm }) => {
    regButtonClick.value = ++regButtonClick.value
    if (regButtonClick.value == 1) {
      registerLabel.value = 'the data entered is correct?'
    }

    if (regButtonClick.value == 2) {
      // await usersStore.(props.formData.id,values) 
      modalActive.value = true
      if (!status.value.isError) {
        resetForm()
      }
      setTimeout(closeNotification, 3000)
      registerLabel.value = 'SUBMIT'
      regButtonClick.value = 0
      emits('close')
      await delay(1000)
      usersStore.getUsers()
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

.select-option {
@apply  px-6 py-3
        rounded-[5px] border border-[#CFCFCF] bg-[#F2F2F2]
} 
  
  </style>