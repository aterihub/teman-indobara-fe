<template>
    <div class="flex gap-2 items-center text-base font-medium">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="15" viewBox="0 0 26 15" fill="none">
        <path d="M3 2.18164L3 12.818" :stroke="barFill(10)" stroke-width="2" stroke-linecap="round"/>
        <path d="M5 2.18164L5 12.818" :stroke="barFill(20)" stroke-width="2" stroke-linecap="round"/>
        <path d="M7 2.18164L7 12.818" :stroke="barFill(30)" stroke-width="2" stroke-linecap="round"/>
        <path d="M9 2.18164L9 12.818" :stroke="barFill(40)" stroke-width="2" stroke-linecap="round"/>
        <path d="M11 2.18164L11 12.818" :stroke="barFill(50)" stroke-width="2" stroke-linecap="round"/>
        <path d="M13 2.18164L13 12.818" :stroke="barFill(60)" stroke-width="2" stroke-linecap="round"/>
        <path d="M15 2.18164L15 12.818" :stroke="barFill(70)" stroke-width="2" stroke-linecap="round"/>
        <path d="M17 2.18164L17 12.818" :stroke="barFill(80)" stroke-width="2" stroke-linecap="round"/>
        <path d="M19 2.18164L19 12.818" :stroke="barFill(90)" stroke-width="2" stroke-linecap="round"/>
        <path d="M21 2.18164L21 12.818" :stroke="barFill(100)" stroke-width="2" stroke-linecap="round"/>
        <path d="M23 2.18164L23 12.818" :stroke="barFill(100)" stroke-width="2" stroke-linecap="round"/>
        <path d="M4 1H20.5C21.2956 1 22.0587 1.27393 22.6213 1.76152C23.1839 2.24912 23.5 2.91044 23.5 3.6V4.25C23.5 4.42239 23.579 4.58772 23.7197 4.70962C23.8603 4.83152 24.0511 4.9 24.25 4.9C24.4489 4.9 24.6397 4.96848 24.7803 5.09038C24.921 5.21228 25 5.37761 25 5.55V9.45C25 9.62239 24.921 9.78772 24.7803 9.90962C24.6397 10.0315 24.4489 10.1 24.25 10.1C24.0511 10.1 23.8603 10.1685 23.7197 10.2904C23.579 10.4123 23.5 10.5776 23.5 10.75V11.4C23.5 12.0896 23.1839 12.7509 22.6213 13.2385C22.0587 13.7261 21.2956 14 20.5 14H4C3.20435 14 2.44129 13.7261 1.87868 13.2385C1.31607 12.7509 1 12.0896 1 11.4V3.6C1 2.91044 1.31607 2.24912 1.87868 1.76152C2.44129 1.27393 3.20435 1 4 1Z" stroke="#34C759" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>{{props.status}}%</p>
    </div>
  </template>
  
  <script setup>
  import { watchEffect } from 'vue';
  
  const props = defineProps({
    status: Boolean,
  });

  function barFill(barIndex) {
    const activeColor = '#34C759';
    const inactiveColor = '#D1D1D6';
    return props.status >= barIndex ? activeColor : inactiveColor;
  }
  
  watchEffect(() => {
    console.log('status changed:', props.status);
  });
  </script>
  