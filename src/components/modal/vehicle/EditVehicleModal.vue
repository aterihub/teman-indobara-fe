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
          <BaseInput v-model="updatePayload.name" name="name" type="text" placeholder="Define vehicle name" class="outlined" label="Vehicle Name"/>
          <div class="flex flex-col gap-1 text-left">
            <label for="contractorId" class="text-xs font-bold">Vehicle Type</label>
            <select name="contractorId" v-model="updatePayload.type" class="cursor-pointer select-option text-sm" required>
              <option v-if="!vehicleTypes.length" class="text-sm" value="0" disabled selected>No Type Available</option>
              <option class="text-sm" v-for="brand in vehicleTypes" :key="brand.id" :value="brand.name">{{ brand.name }}</option>
            </select> 
          </div>
          <div class="flex flex-col gap-1 text-left">
            <label for="contractorId" class="text-xs font-bold">Vehicle Brand</label>
            <select name="contractorId" v-model="updatePayload.brandName" class="cursor-pointer select-option text-sm" required>
              <option v-if="!vehicleBrands.length" class="text-sm" value="0" disabled selected>No Brand Available</option>
              <option class="text-sm" v-for="brand in vehicleBrands" :key="brand.id" :value="brand.name">{{ brand.name }}</option>
            </select> 
          </div>
          <div class="flex flex-col gap-1 text-left">
            <label for="contractorId" class="text-xs font-bold">Hull Number</label>
            <select name="contractorId" v-model="updatePayload.hullNumber" class="cursor-pointer select-option text-sm" required>
              <option v-if="!hulls.length" class="text-sm" value="0" disabled selected>No Hull Number Available</option>
              <option class="text-sm" v-for="hull in hulls" :key="hull.id" :value="hull.number">{{ hull.number }}</option>
            </select> 
          </div>
          <div class="flex flex-col gap-1 text-left">
            <label for="contractorId" class="text-xs font-bold">Contractor</label>
            <select name="contractorId" v-model="updatePayload.contractor.id" class="cursor-pointer select-option text-sm" required @change="fillSitesList(updatePayload.contractor.id)">
              <option v-if="!contractors.length" class="text-sm" value="0" disabled selected>No Contractor Available</option>
              <option class="text-sm" v-for="contractor in contractors" :key="contractor.id" :value="contractor.id">{{ contractor.name }}</option>
            </select> 
          </div>
          <div class="flex flex-col gap-1 text-left">
            <label for="contractorId" class="text-xs font-bold">Site</label>
            <select name="contractorId" v-model="updatePayload.site.id" class="cursor-pointer select-option text-sm" required>
              <option v-if="!site.length" class="text-sm" disabled selected>No Site Available</option>
              <option class="text-sm" v-for="data in site" :key="data.id" :value="data.id">{{ data.name }}</option>
            </select> 
          </div>
          <BaseInput v-model="updatePayload.fabricationYear" name="fabricationYear" type="number" placeholder="Input the fabrication year" class="outlined" label="Fabrication Year"/>
          <BaseInput v-model="updatePayload.purchaseYear" name="purchaseYear" type="number" placeholder="Input the purchase year" class="outlined" label="Purchase Year"/>
          <BaseInput v-model="updatePayload.registrationNumber" name="registrationNumber" type="text" placeholder="Input the registration number" class="outlined" label="Registration Number"/>
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
import { useVehiclesStore } from '@/stores/master-data/vehiclesStore'
import { useVehicleTypesStore } from '@/stores/master-data/vehicleTypesStore'
import { useVehicleBrandsStore } from '@/stores/master-data/vehicleBrandsStore'
import { useHullsStore } from '@/stores/master-data/hullNumberStore'
import { useContractorsStore } from '@/stores/master-data/contractorsStore'
import { useSitesStore } from '@/stores/master-data/sitesStore'

  const props = defineProps({
      isOpen: Boolean,
      title: String,
      formData: {
        type: Object,
        default: () => ({name: null,brandName: null, type: null, registrationNumber: null,fabricationYear: null,purchaseYear: null,hullNumber: null, contractor: {id: null, name: null}, site: {id: null, name: null}})
      }
  })

  const modalActive = ref(false)
  const cancelLabel = ref('CANCEL')
  const registerLabel = ref('SUBMIT')
  const regButtonClick = ref(0)
  const cancelButtonClick = ref(0)

  const updatePayload = ref({
    name: null,
    brandName: null,
    type: null,
    registrationNumber: null,
    fabricationYear: null,
    purchaseYear: null,
    hullNumber: null, 
    contractor: {id: null, name: null}, 
    site: {id: null, name: null}
  })

  //stores
  const vehiclesStore = useVehiclesStore()
  const vehicleTypesStore = useVehicleTypesStore()
  const vehicleBrandsStore = useVehicleBrandsStore()
  const hullsStore = useHullsStore()
  const contractorsStore = useContractorsStore()
  const sitesStore = useSitesStore()
  const { status, updateVehicleIsLoading } = storeToRefs(useVehiclesStore())
  const { vehicleTypes } = storeToRefs(useVehicleTypesStore())
  const { vehicleBrands } = storeToRefs(useVehicleBrandsStore())
  const { hulls } = storeToRefs(useHullsStore())
  const { contractors } = storeToRefs(useContractorsStore())
  const { site } = storeToRefs(useSitesStore())
  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

  onMounted(() => {
    vehicleTypesStore.getVehicleTypes()
    vehicleBrandsStore.getVehicleBrands()
    hullsStore.getHulls()
    contractorsStore.getContractors()
  })
  onBeforeUpdate(()=> {
    updatePayload.value = props.formData
    console.log(updatePayload.value)
    let params = {
      contractorId: props.formData.contractor.id
    }
    sitesStore.getSite(params)
  })

  function fillSitesList(item) {
    let params = {
      contractorId: item
    }
    sitesStore.getSite(params)
  }


  const onSubmit = async (values, { resetForm }) => {
    updatePayload.value.name = updatePayload.value.name.toUpperCase()
    updatePayload.value.fabricationYear = updatePayload.value.fabricationYear.toString()
    updatePayload.value.purchaseYear = updatePayload.value.purchaseYear.toString()
    updatePayload.value.registrationNumber = updatePayload.value.registrationNumber.toUpperCase()
    console.log('update', updatePayload.value)
    values.name = values.name.toUpperCase()
    regButtonClick.value = ++regButtonClick.value
    if (regButtonClick.value == 1) {
      registerLabel.value = 'the data entered is correct?'
    }

    if (regButtonClick.value == 2) {
      await vehiclesStore.updateVehicle(props.formData.id,updatePayload.value) 
      modalActive.value = true
      if (!status.value.isError) {
        resetForm()
        emits('close')
      }
      setTimeout(closeNotification, 3000)
      registerLabel.value = 'SUBMIT'
      regButtonClick.value = 0
      await delay(1000)
      vehiclesStore.getVehicles()

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