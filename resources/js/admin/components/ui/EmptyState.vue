<template>
  <div class="py-16 flex flex-col items-center justify-center text-center">
    <div class="h-14 w-14 rounded-full bg-black/5 text-black/60 inline-flex items-center justify-center mb-3">
      <component :is="icon" class="h-7 w-7" />
    </div>
    <h3 v-if="title" class="text-sm font-semibold">{{ title }}</h3>
    <p v-if="description" class="text-sm text-black/60 mt-1">{{ description }}</p>
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: [Object, Function], default: null },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})
</script>

<style scoped>
</style>


