<template>
    <svg :width="width" :height="height" :viewBox="viewBox" :fill="fill" >
      <path :d="path"  fill-rule="evenodd" clip-rule="evenodd" />
      <slot></slot>
    </svg>
</template>

<script setup>
    const props = defineProps({
        width: String,
        height: String,
        viewBox: String,
        fill: String,
        path: {
            type: String,
            required: true
        }
    })
</script>

<style scoped>
svg {
    pointer-events: none;
}
</style>