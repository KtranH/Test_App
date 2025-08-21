<template>
  <header class="fixed top-0 right-0 left-0 md:left-64 z-40 h-14 border-b border-black/10 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 shadow-sm">
    <div class="h-full flex items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <!-- Mobile Menu Toggle -->
        <button 
          class="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          @click="toggleSidebar"
          aria-label="Toggle sidebar"
        >
          <component :is="isSidebarOpen ? X : Menu" class="h-5 w-5 text-gray-700" />
        </button>
        
        <!-- Desktop Title -->
        <span class="font-medium tracking-tight text-gray-900 hidden md:block">Quản trị</span>
        
        <!-- Mobile Title -->
        <span class="font-medium tracking-tight text-gray-900 md:hidden">Admin Panel</span>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Search Bar - Hidden on mobile -->
        <div class="hidden md:flex items-center">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            class="h-9 w-56 rounded-lg border border-black/10 bg-white/80 placeholder-black/40 text-sm px-3 outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>
        
        <!-- Reset Demo Button - Hidden on mobile -->
        <button
          type="button"
          class="hidden md:inline-flex h-9 px-3 rounded-lg bg-black/5 text-black/70 hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-black/20 items-center gap-2"
          @click="resetDemo"
        >
          <RotateCcw class="h-4 w-4" />
          <span class="text-sm">Reset demo</span>
        </button>
        
        <slot />
        
        <!-- User Account Button -->
        <button
          type="button"
          class="h-9 w-9 rounded-full bg-black/5 text-black/70 hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-black/20 inline-flex items-center justify-center"
          aria-label="Tài khoản"
        >
          <User class="h-5 w-5" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { db } from '@/admin/services/db'
import { computed } from 'vue'
import { Menu, X, RotateCcw, User } from 'lucide-vue-next'
import { useUiStore } from '@/admin/stores/ui.store'

const ui = useUiStore()
const isSidebarOpen = computed(() => ui.isSidebarOpen)
const toggleSidebar = () => ui.toggleSidebar()

const resetDemo = () => {
  db.reset(['admin.attributes','admin.attributeValues','admin.categories','admin.products','admin.variants','admin.productImages','admin.inventory'])
  // fallback: also clear without namespace in case
  db.reset(['attributes','attributeValues','categories','products','variants','productImages','inventory'])
  location.reload()
}
</script>
