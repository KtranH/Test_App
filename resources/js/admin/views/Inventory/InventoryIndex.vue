<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <h1 class="text-xl font-semibold tracking-tight">Tồn kho</h1>
    </header>

    <div v-if="isLoading" class="p-4 border rounded-lg text-sm">Đang tải dữ liệu tồn kho...</div>

    <table v-else class="w-full border border-black/10 rounded-lg overflow-hidden">
      <thead class="bg-black/5 text-left text-xs uppercase">
        <tr>
          <th class="p-2 border-b">Variant ID</th>
          <th class="p-2 border-b">Tên sản phẩm</th>
          <th class="p-2 border-b">Số lượng</th>
          <th class="p-2 border-b">Tồn an toàn</th>
          <th class="p-2 border-b">Cảnh báo</th>
          <th class="p-2 border-b w-40">Điều chỉnh</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in items" :key="i.id" class="border-b hover:bg-black/5">
          <td class="p-2">{{ i.productVariantId }}</td>
          <td class="p-2">{{ i.variant?.name ? i.variant.name : '-' }}</td>
          <td class="p-2">{{ i.quantity }}</td>
          <td class="p-2">{{ i.safetyStock }}</td>
          <td class="p-2">
            <span :class="['px-2 py-1 text-xs rounded border', i.isLowStock ? 'border-black bg-black text-white' : 'border-black/20']">{{ i.isLowStock ? 'Thấp' : 'OK' }}</span>
          </td>
          <td class="p-2 space-x-2">
            <button class="px-2 py-1 border rounded-lg hover:bg-black/5" @click="adjust(i.productVariantId, -1)">-1</button>
            <button class="px-2 py-1 border rounded-lg hover:bg-black/5" @click="adjust(i.productVariantId, 1)">+1</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '@/admin/stores/inventory.store'

const store = useInventoryStore()
const { items, isLoading } = storeToRefs(store)
const { adjust, fetchAll } = store

onMounted(async () => {
  await fetchAll()
})
</script>


