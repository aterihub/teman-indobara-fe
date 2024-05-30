<template>
  <div :class="loading ? 'appLoading appLoading-loading' : 'appLoading'">
      <div class="lottie">
        <lottie :options="lottieOptions" :width="300" :height="300" />
      </div>
  </div>

</template>

<script>
import animationData from '@/assets/animations/loading_anim.json'
export default {
  props: [
    'loading', 'message'
  ],
  data() {
    ``
    return {
      lottieOptions: {
        animationData
      }
      // isLoading: props.loading,
      // message: ''
    }
  }
  // methods: {
  //   start(message) {
  //     this.message = message
  //     this.isLoading = true
  //   },
  //   finish() {
  //     this.isLoading = false
  //     this.message = ''
  //   }
  // }
}

// function start(message) {
//   message.value = message,
//   isLoading.value = true
// }

// function finish() {
//   message.value = '',
//   isLoading.value = true
// }


</script>

<style scoped>
.appLoading {
  @apply relative
}

.appLoading__backdrop {
  @apply bg-[#FEFEFE]/40 backdrop-blur-[2px]
  /* bg-transparent */
  flex justify-center items-center
}

.appLoading__text {
  @apply animate-pulse text-lg text-[#f2f2f2]
}
</style>