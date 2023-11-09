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
              <div class="flex flex-col gap-4">
                <h1 class="text-lg">Please verify the contractor before deleting it</h1>
                <div class="flex flex-col gap-2">
                  <h1 class="font-semibold">Name: {{ props.contractorInfo.name }}</h1>
                </div>
              </div>
              <div class="button-wrapper">
                <BaseButton type="button" class="filled__red" :label="delLabel" :loading="deleteContractorIsLoading" @click="onSubmit(props.contractorInfo.id)" />
                <BaseButton type="button" class="filled__softblue" label="CANCEL" @click="closeModal" />
              </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</div>
</template>

  
<script setup>
import BaseButton from '@/components/button/BaseButton.vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useContractorsStore } from '@/stores/master-data/contractorsStore'

  const props = defineProps({
    isOpen: Boolean,
    contractorInfo: {
        type: Object,
        default: () => ({name: 'null', field: 'null', notes: 'null', id: 'null'})
      }
  })

  const modalActive = ref(false)
  const contractorStore = useContractorsStore()
  const { status, deleteContractorIsLoading } = storeToRefs(useContractorsStore())
  const delLabel = ref('DELETE')
  const delButtonClick = ref(0)

  const onSubmit = async (id) => {
    delButtonClick.value = ++delButtonClick.value
    if (delButtonClick.value == 1) {
      delLabel.value = 'sure to remove this device?'
    }

    if (delButtonClick.value == 2) {
      await contractorStore.deleteContractor(id)
      modalActive.value = true
      setTimeout(closeNotification, 3000)
      resetButton()
      closeModal()
      contractorStore.getContractors()
    }
  }

  const closeNotification = () => {
    modalActive.value = false
  }
  // Define custom events
  const emits = defineEmits(['close'])
  
  function closeModal() {
    resetButton()
    emits('close')
  }
  const target = ref(null)

  onClickOutside(target, () => {
    if (props.isOpen) {
      console.log(props.contractorInfo)
      closeModal()
    }
  })

  function resetButton() {
    delLabel.value = 'DELETE'
    delButtonClick.value = 0
  }


</script>
  
  <style scoped>
  
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
    relative w-[600px] p-[40px] bg-white rounded-xl gap-[40px] flex flex-col
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

  .button-wrapper {
    @apply flex justify-between gap-8
}

  
  </style>