<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <h1 class="text-xl font-semibold tracking-tight">Biến thể sản phẩm</h1>
    </header>

    <div v-if="isLoading" class="p-3 border rounded-lg text-sm">Đang tải biến thể...</div>

    <div v-else class="border border-black/10 rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-black/5 text-left">
          <tr>
            <th class="p-2">SKU</th>
            <th class="p-2">Tên</th>
            <th class="p-2">Sản phẩm</th>
            <th class="p-2">Giá</th>
            <th class="p-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in variants" :key="v.id" class="border-t hover:bg-black/5">
            <td class="p-2">{{ v.sku || '-' }}</td>
            <td class="p-2">{{ v.name || '-' }}</td>
            <td class="p-2">{{ v.product?.name || ('#' + v.productId) }}</td>
            <td class="p-2">{{ formatPrice(v.salePrice ?? v.price) }}</td>
            <td class="p-2">{{ v.isActive ? 'Active' : 'Inactive' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductVariantsStore } from '@/admin/stores/product_variants.store'

const store = useProductVariantsStore()
const { variants, isLoading } = storeToRefs(store)

const formatPrice = (n) => {
  const num = Number(n ?? 0)
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num)
}

onMounted(async () => {
  await store.ensureInitialized()
})
</script>


