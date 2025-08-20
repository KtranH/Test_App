<template>
  <header class="sticky top-0 z-40 h-14 border-b border-black/10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <div class="h-full flex items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <span class="inline-flex h-2.5 w-2.5 rounded-full bg-black/80"></span>
        <span class="font-medium tracking-tight">Quản trị</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="hidden md:flex items-center">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            class="h-9 w-56 rounded-lg border border-black/10 bg-white/80 placeholder-black/40 text-sm px-3 outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>
        <button
          type="button"
          class="h-9 px-3 rounded-lg bg-black/5 text-black/70 hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-black/20 inline-flex items-center gap-2"
          @click="resetDemo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-4 w-4">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.5 12a7.5 7.5 0 1112.72 5.303M4.5 12H3m1.5 0h1.5" />
          </svg>
          <span class="text-sm">Reset demo</span>
        </button>
        <slot />
        <button
          type="button"
          class="h-9 w-9 rounded-full bg-black/5 text-black/70 hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-black/20 inline-flex items-center justify-center"
          aria-label="Tài khoản"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 12a5 5 0 100-10 5 5 0 000 10z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 22a8 8 0 1116 0" />
          </svg>
        </button>
      </div>
    </div>
  </header>
  </template>

<script setup>
import { db } from '@/admin/services/db'

const resetDemo = () => {
  db.reset(['admin.attributes','admin.attributeValues','admin.categories','admin.products','admin.variants','admin.productImages','admin.inventory'])
  // fallback: also clear without namespace in case
  db.reset(['attributes','attributeValues','categories','products','variants','productImages','inventory'])
  location.reload()
}
</script>
