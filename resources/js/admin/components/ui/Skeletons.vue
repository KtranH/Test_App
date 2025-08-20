<template>
  <div v-if="type === 'table'" class="w-full">
    <div class="animate-pulse">
      <div class="h-9 bg-black/5 rounded mb-2"></div>
      <div v-for="n in rows" :key="n" class="h-10 bg-black/5 rounded mb-2"></div>
    </div>
  </div>

  <div v-else-if="type === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-pulse">
    <div v-for="n in rows" :key="n" class="border border-black/10 rounded-xl p-4">
      <div class="h-4 w-24 bg-black/10 rounded mb-3"></div>
      <div class="h-3 w-full bg-black/5 rounded mb-2"></div>
      <div class="h-3 w-2/3 bg-black/5 rounded"></div>
    </div>
  </div>

  <div v-else class="flex items-center justify-center py-16">
    <div class="animate-pulse text-black/50 text-sm">Đang tải...</div>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'table' },
  rows: { type: Number, default: 6 },
})
</script>

<style scoped>
</style>


