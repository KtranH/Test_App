<template>
  <section class="border border-black/10 rounded-xl bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
    <header v-if="$slots.header || title" class="px-4 py-3 border-b border-black/10 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <slot name="icon" />
        <h2 v-if="title" class="text-sm font-semibold tracking-tight">{{ title }}</h2>
        <slot name="header" />
      </div>
      <div class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </header>
    <div class="p-4">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
})
</script>

<style scoped>
</style>


