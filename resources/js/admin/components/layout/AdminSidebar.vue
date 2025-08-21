<template>
  <!-- Desktop Sidebar -->
  <aside
    class="fixed top-0 left-0 h-full w-64 border-r border-black/10 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-lg z-50 hidden md:block"
    aria-label="Thanh điều hướng quản trị"
  >
    <div class="h-full flex flex-col">
      <!-- Logo/Brand Section -->
      <div class="px-4 pt-6 pb-4 border-b border-black/10">
        <div class="flex items-center gap-2">
          <Blend class="h-6 w-6 text-blue-600" />
          <span class="font-bold text-lg tracking-tight text-gray-900">Admin</span>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <RouterLink to="/admin/dashboard" custom v-slot="{ href, navigate, isActive }">
          <a
            :href="href"
            @click="navigate"
            :class="[baseItemClass, isActive ? activeItemClass : '']"
          >
            <Home class="h-5 w-5" />
            <span>Tổng quan</span>
          </a>
        </RouterLink>

        <RouterLink to="/admin/products" custom v-slot="{ href, navigate, isActive }">
          <a
            :href="href"
            @click="navigate"
            :class="[baseItemClass, isActive ? activeItemClass : '']"
          >
            <Shirt class="h-5 w-5" />
            <span>Sản phẩm</span>
          </a>
        </RouterLink>

        <RouterLink to="/admin/attributes" custom v-slot="{ href, navigate, isActive }">
          <a
            :href="href"
            @click="navigate"
            :class="[baseItemClass, isActive ? activeItemClass : '']"
          >
            <Menu class="h-5 w-5" />
            <span>Thuộc tính</span>
          </a>
        </RouterLink>

        <RouterLink to="/admin/categories" custom v-slot="{ href, navigate, isActive }">
          <a
            :href="href"
            @click="navigate"
            :class="[baseItemClass, isActive ? activeItemClass : '']"
          >
            <ChartBarStacked class="h-5 w-5" />
            <span>Danh mục</span>
          </a>
        </RouterLink>

        <RouterLink to="/admin/inventory" custom v-slot="{ href, navigate, isActive }">
          <a
            :href="href"
            @click="navigate"
            :class="[baseItemClass, isActive ? activeItemClass : '']"
          >
            <Warehouse class="h-5 w-5" />
            <span>Tồn kho</span>
          </a>
        </RouterLink>
      </nav>

      <!-- Footer Section -->
      <div class="p-4 border-t border-black/10">
        <div class="text-xs text-gray-500 text-center">
          © 2024 Admin Panel
        </div>
      </div>
    </div>
  </aside>

  <!-- Mobile Sidebar Overlay -->
  <div 
    v-if="isSidebarOpen" 
    class="fixed inset-0 bg-black/50 z-40 md:hidden"
    @click="closeSidebar"
  ></div>

  <!-- Mobile Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 h-full w-80 border-r border-black/10 bg-white/95 backdrop-blur-md shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
    aria-label="Thanh điều hướng quản trị mobile"
  >
    <div class="h-full flex flex-col">
      <!-- Mobile Header -->
      <div class="px-4 pt-6 pb-4 border-b border-black/10 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Blend class="h-6 w-6 text-blue-600" />
          <span class="font-bold text-lg tracking-tight text-gray-900">Admin</span>
        </div>
        <button 
          @click="closeSidebar"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <X class="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <!-- Mobile Navigation Menu -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <RouterLink to="/admin/dashboard" custom v-slot="{ href, navigate, isActive }">
          <a
            :href="href"
            @click="navigateAndClose"
            :class="[baseItemClass, isActive ? activeItemClass : '']"
          >
            <Home class="h-5 w-5" />
            <span>Tổng quan</span>
          </a>
        </RouterLink>

        <RouterLink to="/admin/products" custom v-slot="{ href, navigate, isActive }">
          <a
            :href="href"
            @click="navigateAndClose"
            :class="[baseItemClass, isActive ? activeItemClass : '']"
          >
            <Shirt class="h-5 w-5" />
            <span>Sản phẩm</span>
          </a>
        </RouterLink>

        <RouterLink to="/admin/attributes" custom v-slot="{ href, navigate, isActive }">
          <a
            :href="href"
            @click="navigateAndClose"
            :class="[baseItemClass, isActive ? activeItemClass : '']"
          >
            <Menu class="h-5 w-5" />
            <span>Thuộc tính</span>
          </a>
        </RouterLink>

        <RouterLink to="/admin/categories" custom v-slot="{ href, navigate, isActive }">
          <a
            :href="href"
            @click="navigateAndClose"
            :class="[baseItemClass, isActive ? activeItemClass : '']"
          >
            <ChartBarStacked class="h-5 w-5" />
            <span>Danh mục</span>
          </a>
        </RouterLink>

        <RouterLink to="/admin/inventory" custom v-slot="{ href, navigate, isActive }">
          <a
            :href="href"
            @click="navigateAndClose"
            :class="[baseItemClass, isActive ? activeItemClass : '']"
          >
            <Warehouse class="h-5 w-5" />
            <span>Tồn kho</span>
          </a>
        </RouterLink>
      </nav>

      <!-- Mobile Footer -->
      <div class="p-4 border-t border-black/10">
        <div class="text-xs text-gray-500 text-center">
          © 2024 Admin Panel
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { onMounted, computed } from 'vue'
import { useCategoryStore } from '@/admin/stores/category.store'
import { useInventoryStore } from '@/admin/stores/inventory.store'
import { useUiStore } from '@/admin/stores/ui.store'
import { Shirt, Warehouse, Menu, ChartBarStacked, Blend, Home, X } from 'lucide-vue-next'

const ui = useUiStore()
const isSidebarOpen = computed(() => ui.isSidebarOpen)
const closeSidebar = () => ui.toggleSidebar()

const baseItemClass = 'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';
const activeItemClass = 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 shadow-sm';

// Prefetch nhẹ danh mục và tồn kho để điều hướng mượt mà
const categoryStore = useCategoryStore()
const inventoryStore = useInventoryStore()

const navigateAndClose = () => {
  // Đóng sidebar sau khi navigate trên mobile
  if (window.innerWidth < 768) {
    closeSidebar()
  }
}

onMounted(() => {
  categoryStore.ensureInitialized?.()
  inventoryStore.ensureInitialized?.()
})
</script>
