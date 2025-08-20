<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <h1 class="text-xl font-semibold tracking-tight">Tồn kho</h1>
    </header>

    <AdminCard v-if="isLoading">
      <Skeletons type="table" :rows="8" />
    </AdminCard>

    <AdminCard v-else>
      <table class="w-full rounded-lg overflow-hidden">
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
    </AdminCard>
    <div v-if="store.hasMore" class="flex justify-center mt-4">
      <button class="px-4 py-2 border rounded-lg hover:bg-black/5 text-sm" @click="store.fetchNextPage" :disabled="isLoading">
        Tải thêm
      </button>
      <div class="ml-3 text-xs text-black/60 self-center">Đã tải {{ items.length }}/{{ store.total }}</div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '@/admin/stores/inventory.store'
import AdminCard from '@/admin/components/ui/AdminCard.vue'
import Skeletons from '@/admin/components/ui/Skeletons.vue'

const store = useInventoryStore()
const { items, isLoading } = storeToRefs(store)
const { adjust, ensureInitialized } = store

onMounted(async () => {
  await ensureInitialized()
})
</script>


