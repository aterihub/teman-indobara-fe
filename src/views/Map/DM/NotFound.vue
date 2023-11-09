<template>
  <sideNav :isDMActive="true" />
  <div class="w-full h-screen bg-black flex flex-col justify-center items-center gap-[40px]">
    <img class="w-[400px]" src="@/assets/img/404.png" alt="" srcset="">
    <img class="absolute" src="@/assets/img/crossline.png" alt="" srcset="">
    <div>
      <h1 class="text-[48px] text-white">SORRY, THIS PAGE IS UNDER DEVELOPMENT</h1>
      <!-- <h1 class="text-[48px] text-[#2482E6] ">NOTHING HERE</h1> -->
    </div>
    <!-- <div class="w-[200px]">
      <BaseButton type="button" class="filled__red" label="GO BACK" @click="goHome()" />
    </div> -->
  </div>
</template>


<script setup>
import BaseButton from '@/components/button/BaseButton.vue'
import router from '@/router';
import sideNav from '@/components/navigation/sideNav.vue'
  
  function goHome() {
    router.push({ name: 'Dashboard' });
  }
</script>
