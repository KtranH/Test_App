<template>
  <div class="border border-black/10 rounded-lg overflow-hidden">
    <div class="p-3 flex items-center gap-2 border-b border-black/10">
      <span class="text-sm text-black/60">Bulk:</span>
      <input v-model.number="bulk.price" type="number" min="0" placeholder="Giá" class="px-2 py-1 border rounded" />
      <button class="px-2 py-1 border rounded-lg hover:bg-black/5" @click="applyBulk">Áp dụng</button>
    </div>
    <table class="w-full text-sm">
      <thead class="bg-black/5 text-left">
        <tr>
          <th class="p-2">SKU</th>
          <th class="p-2">Giá</th>
          <th class="p-2">Tùy chọn</th>
          <th class="p-2 w-24">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in variantList" :key="v.id" class="border-t">
          <td class="p-2"><input v-model="v.sku" class="w-full px-2 py-1 border rounded" /></td>
          <td class="p-2"><input v-model.number="v.price" type="number" min="0" class="w-full px-2 py-1 border rounded" /></td>
          <td class="p-2"><code>{{ v.options }}</code></td>
          <td class="p-2">
            <button class="px-2 py-1 border rounded-lg hover:bg-black/5" @click="save(v)">Lưu</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '@/admin/stores/product.store'

const props = defineProps({ productId: { type: String, required: true } })
const store = useProductStore()

const variantList = computed(() => store.variants.filter(v => v.productId === props.productId))
const save = (v) => store.upsertVariant({ ...v })

const bulk = ref({ price: null })
const applyBulk = () => {
  if (bulk.value.price == null) return
  variantList.value.forEach(v => save({ ...v, price: Number(bulk.value.price) }))
}
</script>


