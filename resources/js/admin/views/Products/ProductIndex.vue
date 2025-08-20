<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <h1 class="text-xl font-semibold tracking-tight">Sản phẩm</h1>
      <RouterLink
        :to="{ name: 'admin.products.create' }"
        class="inline-flex items-center gap-2 px-4 py-2 border border-black/15 rounded-lg bg-black text-white hover:bg-black/10 transition-colors focus-visible:ring-2 focus-visible:ring-black/20 text-sm font-bold"
      >
        <Plus class="h-4 w-4" />
        Thêm sản phẩm
      </RouterLink>
    </header>

    <div v-if="isLoading" class="p-3 border rounded-lg text-sm">Đang tải sản phẩm...</div>

    <div v-else class="border border-black/10 rounded-lg">
      <div class="p-3 flex flex-wrap gap-3 items-center">
        <input v-model="q" placeholder="Tìm theo tên..." class="px-3 py-2 border rounded-lg text-sm" />
        <select v-model="status" class="px-3 py-2 border rounded-lg text-sm">
          <option value="">Tất cả trạng thái</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <select v-model="categoryId" class="px-3 py-2 border rounded-lg text-sm">
          <option :value="''">Tất cả danh mục</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
      <div class="border-t border-black/10 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-black/5 text-left">
          <tr>
            <th class="p-2">Tên</th>
            <th class="p-2">Danh mục</th>
            <th class="p-2">Trạng thái</th>
            <th class="p-2 w-36">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.id" class="border-t hover:bg-black/5">
            <td class="p-2">{{ p.name }}</td>
            <td class="p-2">{{ categoryName(p.categoryId) }}</td>
            <td class="p-2">{{ p.status }}</td>
            <td class="p-2 space-x-2">
              <RouterLink :to="{ name: 'admin.products.edit', params: { id: p.id } }" class="px-2 py-1 border rounded-lg hover:bg-black/5">Sửa</RouterLink>
              <button class="px-2 py-1 border rounded-lg hover:bg-black/5" @click="remove(p.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/admin/stores/product.store'
import { useCategoryStore } from '@/admin/stores/category.store'
import { Plus } from 'lucide-vue-next'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const products = computed(() => productStore.products)
const isLoading = computed(() => productStore.isLoading || categoryStore.isLoading)
const categoryName = (id) => categoryStore.categories.find(c => c.id === id)?.name || '-'
const remove = (id) => productStore.removeProduct(id)

const q = ref('')
const status = ref('')
const categoryId = ref('')
const categories = computed(() => categoryStore.categories)

const filtered = computed(() => {
  return products.value.filter(p => {
    const okName = q.value ? p.name.toLowerCase().includes(q.value.toLowerCase()) : true
    const okStatus = status.value ? p.status === status.value : true
    const okCat = categoryId.value ? p.categoryId === categoryId.value : true
    return okName && okStatus && okCat
  })
})

onMounted(async () => {
  await Promise.all([
    categoryStore.ensureInitialized(),
    productStore.ensureInitialized(),
  ])
})
</script>


