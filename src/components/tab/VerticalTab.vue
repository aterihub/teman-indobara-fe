<template>
  <div class="tab">
    <button v-for="(tab, index) in tabs" :key="tab.value"
        @click="$emit('clicked', tab.value)"
        class="nav"
        :value="index"
        :id="tab.value"
        >{{tab.title}}
      </button>
  </div>
</template>

<script>

export default {
  props:[
    'tabs'
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
  @apply 
    items-start justify-start h-full
    flex flex-col w-[200px] gap-2
    border rounded-lg shadow-inner p-2 bg-white
}

button {
  @apply disabled:opacity-75 flex items-center relative text-[#353535] cursor-pointer p-2 rounded-md
  w-full text-[10px] sm:text-[14px] border-transparent border
} 

button:hover {
  @apply bg-gray-100 text-[#353535] outline-none 
  transition-all duration-300 scale-105
}

.active {
  @apply border border-[#C21629]  text-[#C21629]
  transition-colors duration-300 box-border outline-none
}

.active:hover {
  @apply text-[#C21629] bg-transparent cursor-default
  transition-colors duration-300 box-border outline-none scale-100
}




</style>