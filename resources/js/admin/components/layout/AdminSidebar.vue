<template>
  <aside
    class="hidden md:flex md:flex-col md:w-64 border-r border-black/10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
    aria-label="Thanh điều hướng quản trị"
  >
    <div class="sticky top-0">
      <div class="px-4 pt-4 pb-3">
        <div class="flex items-center gap-2">
          <span class="inline-flex h-2.5 w-2.5 rounded-full bg-black/80"></span>
          <span class="font-semibold tracking-tight">Admin</span>
        </div>
      </div>
      <div class="px-4">
        <div class="h-px bg-black/10"></div>
      </div>
    </div>

    <nav class="p-4 space-y-1">
      <RouterLink to="/admin" custom v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click="navigate"
          :class="[baseItemClass, isActive ? activeItemClass : '']"
        >
          <House class="h-5 w-5" />
          <span>Dashboard</span>
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

      <RouterLink to="/admin/product-variants" custom v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click="navigate"
          :class="[baseItemClass, isActive ? activeItemClass : '']"
        >
          <Blend class="h-5 w-5" />
          <span>Biến thể</span>
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
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { onMounted } from 'vue'
import { useCategoryStore } from '@/admin/stores/category.store'
import { useInventoryStore } from '@/admin/stores/inventory.store'
import { useProductVariantsStore } from '@/admin/stores/product_variants.store'
import { Shirt, Warehouse, House, Menu, ChartBarStacked, Blend } from 'lucide-vue-next'

const baseItemClass = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-black/70 hover:text-black hover:bg-black/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20';
const activeItemClass = 'bg-black/5 text-black ring-1 ring-black/10';

// Prefetch nhẹ danh mục và tồn kho để điều hướng mượt mà
const categoryStore = useCategoryStore()
const inventoryStore = useInventoryStore()
const variantsStore = useProductVariantsStore()
onMounted(() => {
  categoryStore.fetchAll?.()
  inventoryStore.fetchAll?.()
  variantsStore.fetchAll?.()
})
</script>
