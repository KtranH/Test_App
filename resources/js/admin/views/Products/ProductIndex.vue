<template>
  <section class="space-y-8">
    <!-- Header với gradient -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8 text-blue-900" data-aos="fade-up" data-aos-duration="800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <PackageSearch class="h-5 w-5 text-white" />
        </div>
        <div class="relative z-10">
          <h1 class="text-2xl font-bold mb-2">Quản lý sản phẩm</h1>
          <p class="text-black">Tạo và quản lý danh mục sản phẩm</p>
        </div>
      </div>
      <div class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div>
      <div class="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10"></div>
      <div class="absolute -right-8 top-8 h-16 w-16 rounded-full bg-white/5"></div>
    </div>

    <!-- Quick Actions -->
    <div class="flex items-center justify-between" data-aos="fade-up" data-aos-duration="1000">
      <div class="flex items-center gap-3">
        <RouterLink
          :to="{ name: 'admin.products.create' }"
          class="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-blue-700"
        >
          <Plus class="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          Tạo sản phẩm mới
        </RouterLink>
        <button @click="refresh()" class="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-blue-700">
          <LoaderCircle class="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          Tải mới
        </button>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <Package class="h-4 w-4" />
        <span>{{ products.length }} sản phẩm</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Đang tải sản phẩm...</span>
      </div>
    </div>

    <!-- Products Table -->
    <div v-else class="rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden" data-aos="fade-up" data-aos-duration="1200">
      <!-- Filters -->
      <div class="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input v-model="q" placeholder="Tìm theo tên..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
          </div>
          <select v-model="status" class="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="active">Đang hoạt động</option>
            <option value="archived">Lưu trữ</option>
          </select>
          <select v-model="categoryId" class="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
            <option :value="''">Tất cả danh mục</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-hidden" data-aos="fade-up" data-aos-duration="1400">
        <table class="w-full text-sm">
          <thead class="bg-gradient-to-r from-blue-50 to-purple-50 text-left">
            <tr>
              <th class="p-4 font-semibold text-gray-700">Tên sản phẩm</th>
              <th class="p-4 font-semibold text-gray-700">Danh mục</th>
              <th class="p-4 font-semibold text-gray-700">Trạng thái</th>
              <th class="p-4 font-semibold text-gray-700 w-64">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="p in filtered" :key="p.id">
              <tr class="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <Package class="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ p.name }}</div>
                      <div class="text-xs text-gray-500">{{ p.slug }}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <Folder class="h-4 w-4 text-gray-400" />
                    <span class="text-gray-700">{{ categoryName(p.categoryId) }}</span>
                  </div>
                </td>
                <td class="p-4">
                  <span v-if="p.status === 'active'" class="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                    <CheckCheck class="h-3 w-3" />
                    Đang hoạt động
                  </span>
                  <span v-else-if="p.status === 'draft'" class="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                    <FileText class="h-3 w-3" />
                    Nháp
                  </span>
                  <span v-else class="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                    <Archive class="h-3 w-3" />
                    Lưu trữ
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <button @click="toggleExpand(p)" class="group/btn inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                      <Blend class="h-4 w-4 text-gray-600 group-hover/btn:text-blue-600"/>
                    </button>
                    <RouterLink :to="{ name: 'admin.products.edit', params: { id: p.id } }" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200">
                      <Edit class="h-4 w-4 text-gray-600" />
                    </RouterLink>
                    <button @click="remove(p.id)" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200">
                      <Trash2 class="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Variants Row -->
              <tr v-if="expandedId === p.id" :key="p.id + '-variants'">
                <td colspan="4" class="p-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
                  <div class="p-6 border-t border-gray-200">
                    <div v-if="rowLoading[p.id]" class="py-4">
                      <div class="flex items-center justify-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span class="ml-3 text-gray-600">Đang tải biến thể...</span>
                      </div>
                    </div>
                    <div v-else-if="(p.variants?.length || 0) === 0" class="text-center py-8">
                      <div class="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                        <Blend class="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 class="text-lg font-semibold text-gray-900 mb-2">Chưa có biến thể</h3>
                      <p class="text-gray-600">Sản phẩm này chưa có biến thể nào.</p>
                    </div>
                    <div v-else class="space-y-4">
                      <div class="flex items-center gap-2 mb-4">
                        <Blend class="h-5 w-5 text-blue-600" />
                        <h4 class="font-semibold text-gray-900">Danh sách biến thể</h4>
                        <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{{ p.variants.length }} biến thể</span>
                      </div>
                      <div class="overflow-x-auto">
                        <table class="w-full text-xs">
                          <thead class="bg-white/80 text-left">
                            <tr>
                              <th class="p-3 font-medium text-gray-700">SKU</th>
                              <th class="p-3 font-medium text-gray-700">Tên</th>
                              <th class="p-3 font-medium text-gray-700">Giá</th>
                              <th class="p-3 font-medium text-gray-700">Trạng thái</th>
                              <th class="p-3 font-medium text-gray-700">Thuộc tính</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="v in p.variants" :key="v.id" class="border-t border-gray-100 hover:bg-white/60 transition-colors duration-200">
                              <td class="p-3">
                                <div class="flex items-center gap-2">
                                  <Hash class="h-3 w-3 text-gray-400" />
                                  <span class="font-mono text-gray-700">{{ v.sku || '-' }}</span>
                                </div>
                              </td>
                              <td class="p-3 font-medium text-gray-900">{{ v.name || '-' }}</td>
                              <td class="p-3">
                                <span v-if="p.basePrice != null" class="text-emerald-600 font-medium">{{ formatPrice(p.basePrice) }}</span>
                                <span v-else class="text-gray-700">{{ formatPrice(v.price ?? v.salePrice ?? 0) }}</span>
                              </td>
                              <td class="p-3">
                                <div class="flex items-center gap-2">
                                  <CheckCheck v-if="v.isActive" class="h-4 w-4 text-emerald-600" />
                                  <X v-else class="h-4 w-4 text-gray-400" />
                                  <span class="text-xs">{{ v.isActive ? 'Hoạt động' : 'Không hoạt động' }}</span>
                                </div>
                              </td>
                              <td class="p-3">
                                <div class="flex flex-wrap gap-1">
                                  <span v-for="(val, key) in v.attributeCombination" :key="key" class="inline-flex items-center gap-1 px-2 py-1 text-[10px] rounded-lg border border-gray-200 bg-white text-gray-700">
                                    <span class="uppercase font-medium">{{ key }}:</span> {{ val }}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            
            <!-- Empty State -->
            <tr v-if="filtered.length === 0">
              <td colspan="4" class="p-8">
                <div class="text-center">
                  <div class="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Package class="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Không có sản phẩm</h3>
                  <p class="text-gray-600 mb-4">Hãy thử thay đổi bộ lọc hoặc thêm sản phẩm mới.</p>
                  <RouterLink
                    :to="{ name: 'admin.products.create' }"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  >
                    <Plus class="h-4 w-4" />
                    Tạo sản phẩm đầu tiên
                  </RouterLink>
                </div>
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
import { 
  Plus, Package, Blend, Edit, Trash2, CheckCheck, X, 
  Search, Folder, FileText, Archive, Hash, PackageSearch, LoaderCircle
} from 'lucide-vue-next'
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

const formatPrice = (n) => {
  const num = Number(n ?? 0)
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num)
}

// Làm mới dữ liệu
const refresh = () => {
  productStore.fetchFirstPage()
}

onMounted(async () => {
  await Promise.all([
    categoryStore.ensureInitialized(),
    productStore.ensureInitialized(),
  ])
})
</script>


