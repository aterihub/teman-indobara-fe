<template>
  <div>
    <div class="input-wrapper" v-bind="$attrs">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 28 28" width="300" height="300"><path d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"/></svg>
      </span>
      <input maxlength="40"
        :placeholder="placeholder"
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)"
        >
    </div>
  </div>
</template>
<script>

export default {
  props: {
    modelValue: {
    type: [String, Number],
    default: '',
    },
    placeholder: {
      type: String
    }
  }
}
</script>

<style scoped>


input {
  @apply flex pl-3 text-[12px] font-normal bg-transparent focus:outline-none w-full h-full
} 

input::placeholder {
  @apply text-[12px] font-normal text-[#9A9EA4] 
} 

.input-wrapper {
  @apply 
    flex flex-row items-center bg-white p-2 pl-4 hover:bg-[#eef3f7] transition-colors duration-300 h-[32px] w-full
}

.floating {
  box-shadow: 0px 0px 11px 1px rgba(0, 0, 0, 0.19);
  @apply rounded-lg
}
.outlined {
  @apply
  border-solid border-t border-x rounded-t-[8px]  border-[#EBEBED]
}

svg {
  @apply w-4 h-4 fill-[#9A9EA4]
}

</style>