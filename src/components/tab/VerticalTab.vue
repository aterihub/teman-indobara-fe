<template>
  <div class="tab">
    <button v-for="(tab, index) in tabs" :key="tab.value"
        @click="$emit('clicked', tab.value)"
        class="nav"
        :value="index"
        :id="tab.value"
        >
        <img class="w-[36px] cursor-pointer pointer-events-none" :src="require(`@/assets/icon/${tab.src}`)">
        {{tab.title}}
      </button>
  </div>
</template>

<script>

export default {
  props:[
    'tabs',
  ],
  setup(props, {emit}) {
    function changeTable(event) {
      var subNavs = document.getElementsByClassName("nav")
      for (var i of subNavs) {
        console.log(i)
        i.classList.remove("active");
      }
      event.target.className += " active"
    }
    return {
      changeTable
    }
  }
}
</script>

<style scoped>

.tab {
  @apply w-fit grid grid-rows-2 gap-[14px] h-fit
}

button {
  @apply disabled:opacity-75 flex flex-col gap-2 justify-center items-center relative 
  text-[#353535] cursor-pointer p-4 rounded-md
    w-[140px] text-[10px] sm:text-[12px] font-semibold
    border-2 border-[#D9D9D9]
    h-[140px]
    
} 

button:hover {
  @apply bg-[#f2f2f2]/60 text-[#353535]  
  transition-colors duration-300 
}

.active {
  @apply border-2 border-[#C21629]  text-[#C21629]
  transition-colors duration-300 box-border outline-none
}

.active:hover {
  @apply text-[#C21629] bg-transparent cursor-default
  transition-colors duration-300 box-border outline-none scale-100
}




</style>