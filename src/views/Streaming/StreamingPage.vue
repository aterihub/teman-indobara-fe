<template>
  <sideNav :is-dumptruck-active="true" />
  <div class="content">
    <h1 class="text-semibold text-left text-2xl">Live Video Streaming for {{ props.hullNumber }} - {{ props.imei }}</h1>
    <iframe
      :src="streamingUrl"
      width="100%" height="100%" frameborder="0" allowfullscreen>
    </iframe>
  </div>
</template>

<script setup>
import sideNav from '@/components/navigation/sideNav.vue'
import { ref, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const props = defineProps(['imei', 'token', 'hullNumber'])
const streamingUrl = ref('')

onMounted(() => {
  streamingUrl.value = `http://47.252.16.64:9966/vss/apiPage/RealVideo.html?token=${props.token}&deviceId=${props.imei}&chs=1_2&stream=0&wnum=4&panel=1&buffer=2000`
})


</script>

<style scoped>
.content {
  @apply w-full h-full relative ml-[70px] pt-[82px] mr-[26px] flex flex-col gap-5
}

.navigation {
  @apply flex w-fit
}

.title {
  @apply text-[24px] font-medium flex justify-start items-center text-[#353535]
}

.table-wrap {
  @apply overflow-auto sm:overflow-visible
}

.table-header {
  @apply flex flex-row w-full justify-between mb-6
}

/* .search-wrapper {
  @apply
    w-[280px] h-[40px]
} */
.operation {
  @apply flex gap-4
}

.customize-table {
  --easy-table-border: 1px solid #EBEBED;
  --easy-table-header-font-size: 14px;
  --easy-table-header-background-color: transparent;
  --easy-table-header-font-color: #6E6E78;
  --easy-table-header-height: 40px;

  --easy-table-body-row-font-size: 14px;
  --easy-table-body-font-color: #3A3A3E;
  --easy-table-body-row-height: 46px;

  --easy-table-footer-font-size: 12px;
  --easy-table-footer-height: 40px;
  --easy-table-footer-font-color: #6E6E78;
  border-collapse: collapse;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>