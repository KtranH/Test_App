<template>
  <section class="space-y-6">
    <h1 class="text-xl font-semibold tracking-tight">Tổng quan</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="group border border-black/10 rounded-lg p-4 hover:bg-black/5 transition-colors focus-within:ring-2 focus-within:ring-black/10">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-[10px] uppercase tracking-wide text-black/50">Sản phẩm</div>
            <div class="text-2xl font-semibold">{{ counts.products }}</div>
          </div>
          <div class="h-9 w-9 rounded-lg bg-black/5 text-black/70 inline-flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.25 7.5l-8.25-4.5-8.25 4.5M20.25 7.5V16.5l-8.25 4.5M3.75 7.5V16.5l8.25 4.5" />
            </svg>
          </div>
        </div>
      </div>

      <div class="group border border-black/10 rounded-lg p-4 hover:bg-black/5 transition-colors focus-within:ring-2 focus-within:ring-black/10">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-[10px] uppercase tracking-wide text-black/50">Biến thể</div>
            <div class="text-2xl font-semibold">{{ counts.variants }}</div>
          </div>
          <div class="h-9 w-9 rounded-lg bg-black/5 text-black/70 inline-flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </div>
        </div>
      </div>

      <div class="group border border-black/10 rounded-lg p-4 hover:bg-black/5 transition-colors focus-within:ring-2 focus-within:ring-black/10">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-[10px] uppercase tracking-wide text-black/50">Thuộc tính</div>
            <div class="text-2xl font-semibold">{{ counts.attributes }}</div>
          </div>
          <div class="h-9 w-9 rounded-lg bg-black/5 text-black/70 inline-flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 12h12M6 6h12M6 18h12" />
            </svg>
          </div>
        </div>
      </div>

      <div class="group border border-black/10 rounded-lg p-4 hover:bg-black/5 transition-colors focus-within:ring-2 focus-within:ring-black/10">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-[10px] uppercase tracking-wide text-black/50">Cảnh báo tồn kho</div>
            <div class="text-2xl font-semibold">{{ counts.lowStock }}</div>
          </div>
          <div class="h-9 w-9 rounded-lg bg-black/5 text-black/70 inline-flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="border border-black/10 rounded-lg p-4 lg:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <div class="font-medium">Sản phẩm theo danh mục</div>
        </div>
        <SimpleBarChart :labels="categoryLabels" :values="categoryCounts" />
      </div>

      <div class="border border-black/10 rounded-lg p-4">
        <div class="font-medium mb-2">Tồn kho thấp</div>
        <SimpleDonutChart :value="lowStockCount" :total="totalInventoryItems" label="Low vs OK" />
        <div class="mt-2 flex items-center justify-center gap-3 text-xs text-black/60">
          <span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-black inline-block"></span> Low</span>
          <span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-black/10 inline-block"></span> OK</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProductStore } from '@/admin/stores/product.store'
import { useProductVariantsStore } from '@/admin/stores/product_variants.store'
import { useAttributeStore } from '@/admin/stores/attribute.store'
import { useInventoryStore } from '@/admin/stores/inventory.store'
import SimpleBarChart from '@/admin/components/ui/SimpleBarChart.vue'
import SimpleDonutChart from '@/admin/components/ui/SimpleDonutChart.vue'

const productStore = useProductStore()
const attributeStore = useAttributeStore()
const inventoryStore = useInventoryStore()
const variantsStore = useProductVariantsStore()

const counts = computed(() => ({
  products: productStore.products.length,
  variants: variantsStore.variants.length,
  attributes: attributeStore.attributes.length,
  lowStock: inventoryStore.items.filter(i => i.isLowStock).length
}))

// Bar chart: products by category
const categoryLabels = computed(() => {
  const ids = productStore.products.map(p => p.categoryId)
  const unique = Array.from(new Set(ids))
  return unique.map(id => productStore.categoryName?.(id) || `Cat ${id}`)
})
const categoryCounts = computed(() => {
  const map = new Map()
  for (const p of productStore.products) {
    map.set(p.categoryId, (map.get(p.categoryId) || 0) + 1)
  }
  return Array.from(map.values())
})

// Donut: inventory low vs ok
const totalInventoryItems = computed(() => inventoryStore.items.length || 1)
const lowStockCount = computed(() => inventoryStore.items.filter(i => i.isLowStock).length)

onMounted(async () => {
  await Promise.all([
    productStore.ensureInitialized(),
    attributeStore.ensureInitialized(),
    inventoryStore.ensureInitialized(),
    variantsStore.ensureInitialized(),
  ])
})
</script>


