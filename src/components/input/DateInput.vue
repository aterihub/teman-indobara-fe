<template>
  <div 
    v-bind="$attrs"
    class="input-wrapper">
    <label v-show="props.label" :for="name">{{ props.label }}</label>
      <input class="text-field" :id="name" :name="props.name" type="date" v-model="value" :placeholder="props.placeholder" v-bind="$attrs" />
    <span class="error-message" v-show="errorMessage">{{ errorMessage }}</span>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'
  
  const props = defineProps(['name','label', 'placeholder', 'modelValue'])
  const{ value, errorMessage } = useField(props.name)

</script>

<style scoped>
.input-wrapper {
  @apply flex flex-col gap-1 text-left
}

.text-field {
  @apply flex gap-1 bg-[#F2F2F2]
}

.text-field:focus {
  @apply bg-[#FFFFFF] !important
}
label {
  @apply  text-[14px] font-medium
}

input {
  @apply outline-none text-[14px] bg-transparent
}

.outlined .text-field {
  @apply  px-6 py-3
          rounded-[5px] border border-[#CFCFCF]
} 

.outlined input::placeholder {
  @apply text-[14px] text-[#2F393F]/40 font-normal
} 

.error-message {
    @apply text-xs text-[#F15412] mt-1
}


</style>