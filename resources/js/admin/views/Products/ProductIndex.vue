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

    <AdminCard v-if="isLoading">
      <Skeletons type="table" :rows="6" />
    </AdminCard>

    <AdminCard v-else>
      <div class="pb-3 flex flex-wrap gap-3 items-center">
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
              <th class="p-2 w-56">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="p in filtered" :key="p.id">
              <tr class="border-t hover:bg-black/5">
                <td class="p-2">{{ p.name }}</td>
                <td class="p-2">{{ categoryName(p.categoryId) }}</td>
                <td class="p-2">
                  <span v-if="p.status === 'active'" class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-emerald-200 bg-emerald-50 text-emerald-700">
                    <CheckCheck class="h-4 w-4" />
                    Đang hoạt động
                  </span>
                  <span v-else-if="p.status === 'draft'" class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-gray-200 bg-gray-50 text-gray-700">
                    Nháp
                  </span>
                  <span v-else class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-gray-200 bg-gray-50 text-gray-700">
                    Lưu trữ
                  </span>
                </td>
                <td class="p-2 space-x-2">
                  <button class="px-2 py-1 border rounded-lg hover:bg-black/5" @click="toggleExpand(p)">
                    {{ expandedId === p.id ? 'Ẩn biến thể' : 'Xem biến thể' }}
                  </button>
                  <RouterLink :to="{ name: 'admin.products.edit', params: { id: p.id } }" class="px-2 py-1 border rounded-lg hover:bg-black/5">Sửa</RouterLink>
                  <button class="px-2 py-1 border rounded-lg hover:bg-black/5" @click="remove(p.id)">Xóa</button>
                </td>
              </tr>
              <tr v-if="expandedId === p.id">
                <td colspan="4" class="p-0 bg-black/2">
                  <div class="px-3 py-2 border-t border-black/10">
                    <div v-if="rowLoading[p.id]" class="py-4">
                      <Skeletons type="table" :rows="3" />
                    </div>
                    <div v-else-if="(p.variants?.length || 0) === 0" class="text-sm text-black/60 py-4">
                      <EmptyState :icon="Blend" title="Chưa có biến thể" description="Sản phẩm này chưa có biến thể nào." />
                    </div>
                    <div v-else class="overflow-x-auto">
                      <table class="w-full text-xs">
                        <thead class="bg-black/5 text-left">
                          <tr>
                            <th class="p-2">SKU</th>
                            <th class="p-2">Tên</th>
                            <th class="p-2">Giá</th>
                            <th class="p-2">Trạng thái</th>
                            <th class="p-2">Thuộc tính</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="v in p.variants" :key="v.id" class="border-t hover:bg-black/5">
                            <td class="p-2">{{ v.sku || '-' }}</td>
                            <td class="p-2">{{ v.name || '-' }}</td>
                            <td class="p-2" v-if="p.basePrice != null">{{ formatPrice(p.basePrice) }}</td>
                            <td class="p-2" v-else>{{ formatPrice(v.price ?? v.salePrice ?? 0) }}</td>
                            <td class="p-2">
                              <CheckCheck v-if="v.isActive" class="h-4 w-4 text-emerald-600" />
                              <X v-else class="h-4 w-4 text-gray-400" />
                            </td>
                            <td class="p-2">
                              <span v-for="(val, key) in v.attributeCombination" :key="key" class="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-black/15 mr-1 mb-1">
                                <span class="uppercase">{{ key }}:</span> {{ val }}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="filtered.length === 0">
              <td colspan="4">
                <EmptyState :icon="Package" title="Không có sản phẩm" description="Hãy thử thay đổi bộ lọc hoặc thêm sản phẩm mới." />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="productStore.hasMore" class="mt-4 flex flex-col items-center gap-3">
        <button class="px-4 py-2 border rounded-lg hover:bg-black/5 text-sm" @click="productStore.fetchNextPage" :disabled="isLoading">
          Tải thêm
        </button>
        <div class="text-xs text-black/60">Đã tải {{ products.length }}/{{ productStore.total }}</div>
      </div>
    </AdminCard>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/admin/stores/product.store'
import { useCategoryStore } from '@/admin/stores/category.store'
import { Plus, CheckCheck, X} from 'lucide-vue-next'
import { Package } from 'lucide-vue-next'
import { Blend } from 'lucide-vue-next'
import AdminCard from '@/admin/components/ui/AdminCard.vue'
import Skeletons from '@/admin/components/ui/Skeletons.vue'
import EmptyState from '@/admin/components/ui/EmptyState.vue'
import { ProductsApi } from '@/admin/api/products'

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
const expandedId = ref(null)
const rowLoading = ref({})
const toggleExpand = async (product) => {
  if (expandedId.value === product.id) {
    expandedId.value = null
    return
  }
  expandedId.value = product.id
  // nếu sản phẩm chưa có mảng variants từ API, thử fetch chi tiết
  if (!Array.isArray(product.variants) || product.variants.length === 0) {
    rowLoading.value[product.id] = true
    try {
      const res = await ProductsApi.getProductById(product.id)
      const p = res?.data?.data
      if (p && Array.isArray(p.variants)) {
        // cập nhật trực tiếp object trong danh sách phản ứng
        product.variants = p.variants.map(v => ({
          id: v.id,
          productId: v.product_id,
          sku: v.sku || '',
          name: v.name || '',
          price: v.price != null ? Number(v.price) : null,
          salePrice: v.sale_price != null ? Number(v.sale_price) : null,
          weight: v.weight != null ? Number(v.weight) : null,
          width: v.width != null ? Number(v.width) : null,
          height: v.height != null ? Number(v.height) : null,
          length: v.length != null ? Number(v.length) : null,
          isActive: !!v.is_active,
          attributeCombination: v.attribute_combination ?? {},
          deletedAt: v.deleted_at ?? null,
        }))
      }
    } finally {
      rowLoading.value[product.id] = false
    }
  }
}

// removed getStatusIcon: thay bằng render trực tiếp icon trong template

const formatPrice = (n) => {
  const num = Number(n ?? 0)
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num)
}

onMounted(async () => {
  await Promise.all([
    categoryStore.ensureInitialized(),
    productStore.ensureInitialized(),
  ])
})
</script>


