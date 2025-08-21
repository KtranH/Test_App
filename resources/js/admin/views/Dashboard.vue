<template>
  <section class="space-y-8">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 text-white">
      <div class="relative z-10">
        <h1 class="text-4xl font-bold mb-3">Chào mừng trở lại! 👋</h1>
        <p class="text-xl text-indigo-100 mb-6">Tổng quan hệ thống quản lý sản phẩm</p>
        <div class="flex items-center gap-6 text-sm">
          <div class="flex items-center gap-2">
            <Clock class="h-4 w-4" />
            <span>{{ new Date().toLocaleDateString('vi-VN') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Activity class="h-4 w-4" />
            <span>Hệ thống hoạt động bình thường</span>
          </div>
        </div>
      </div>
      <div class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div>
      <div class="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 animate-pulse"></div>
      <div class="absolute -right-16 top-16 h-24 w-24 rounded-full bg-white/5 animate-pulse" style="animation-delay: 1s;"></div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Products Card -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative z-10">
          <div class="flex items-start justify-between mb-4">
            <div class="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Package class="h-6 w-6" />
            </div>
            <TrendingUp class="h-6 w-6 text-white/60" />
          </div>
          <div class="text-3xl font-bold mb-1">{{ counts.products }}</div>
          <div class="text-blue-100 text-sm">Tổng sản phẩm</div>
        </div>
        <div class="absolute bottom-0 right-0 h-16 w-16 rounded-full bg-white/10"></div>
      </div>

      <!-- Variants Card -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative z-10">
          <div class="flex items-start justify-between mb-4">
            <div class="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Blend class="h-6 w-6" />
            </div>
            <TrendingUp class="h-6 w-6 text-white/60" />
          </div>
          <div class="text-3xl font-bold mb-1">{{ counts.variants }}</div>
          <div class="text-emerald-100 text-sm">Biến thể sản phẩm</div>
        </div>
        <div class="absolute bottom-0 right-0 h-16 w-16 rounded-full bg-white/10"></div>
      </div>

      <!-- Attributes Card -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative z-10">
          <div class="flex items-start justify-between mb-4">
            <div class="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Settings2 class="h-6 w-6" />
            </div>
            <TrendingUp class="h-6 w-6 text-white/60" />
          </div>
          <div class="text-3xl font-bold mb-1">{{ counts.attributes }}</div>
          <div class="text-purple-100 text-sm">Thuộc tính</div>
        </div>
        <div class="absolute bottom-0 right-0 h-16 w-16 rounded-full bg-white/10"></div>
      </div>

      <!-- Low Stock Card -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative z-10">
          <div class="flex items-start justify-between mb-4">
            <div class="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertTriangle class="h-6 w-6" />
            </div>
            <TrendingDown class="h-6 w-6 text-white/60" />
          </div>
          <div class="text-3xl font-bold mb-1">{{ counts.lowStock }}</div>
          <div class="text-orange-100 text-sm">Cảnh báo tồn kho</div>
        </div>
        <div class="absolute bottom-0 right-0 h-16 w-16 rounded-full bg-white/10"></div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Products by Category Chart -->
      <div class="lg:col-span-2 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
        <div class="flex items-center gap-3 mb-6">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <BarChart3 class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Sản phẩm theo danh mục</h3>
            <p class="text-sm text-gray-600">Phân bố sản phẩm trong hệ thống</p>
          </div>
        </div>
        <SimpleBarChart :labels="categoryLabels" :values="categoryCounts" />
      </div>

      <!-- Inventory Status Chart -->
      <div class="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
        <div class="flex items-center gap-3 mb-6">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
            <PieChart class="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Tình trạng tồn kho</h3>
            <p class="text-sm text-gray-600">Tỷ lệ tồn kho thấp</p>
          </div>
        </div>
        <SimpleDonutChart :value="lowStockCount" :total="totalInventoryItems" label="Low vs OK" />
        <div class="mt-4 flex items-center justify-center gap-4 text-xs">
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-red-500"></div>
            <span class="text-gray-600">Tồn kho thấp</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-gray-300"></div>
            <span class="text-gray-600">Bình thường</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RouterLink to="/admin/products/create" class="group flex items-center gap-3 p-4 rounded-xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:scale-105">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <Plus class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div class="font-medium text-gray-900">Tạo sản phẩm</div>
            <div class="text-sm text-gray-600">Thêm sản phẩm mới</div>
          </div>
        </RouterLink>

        <RouterLink to="/admin/categories" class="group flex items-center gap-3 p-4 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition-all duration-200 hover:scale-105">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
            <FolderPlus class="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div class="font-medium text-gray-900">Quản lý danh mục</div>
            <div class="text-sm text-gray-600">Tổ chức sản phẩm</div>
          </div>
        </RouterLink>

        <RouterLink to="/admin/attributes" class="group flex items-center gap-3 p-4 rounded-xl bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 transition-all duration-200 hover:scale-105">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
            <Settings2 class="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <div class="font-medium text-gray-900">Thuộc tính</div>
            <div class="text-sm text-gray-600">Cấu hình sản phẩm</div>
          </div>
        </RouterLink>

        <RouterLink to="/admin/inventory" class="group flex items-center gap-3 p-4 rounded-xl bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 transition-all duration-200 hover:scale-105">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <Warehouse class="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <div class="font-medium text-gray-900">Tồn kho</div>
            <div class="text-sm text-gray-600">Kiểm tra hàng tồn</div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/admin/stores/product.store'
import { useAttributeStore } from '@/admin/stores/attribute.store'
import { useInventoryStore } from '@/admin/stores/inventory.store'
import SimpleBarChart from '@/admin/components/ui/SimpleBarChart.vue'
import SimpleDonutChart from '@/admin/components/ui/SimpleDonutChart.vue'
import { 
  Package, Blend, Settings2, AlertTriangle, Clock, Activity,
  TrendingUp, TrendingDown, BarChart3, PieChart, Plus, 
  FolderPlus, Warehouse 
} from 'lucide-vue-next'

const productStore = useProductStore()
const attributeStore = useAttributeStore()
const inventoryStore = useInventoryStore()

const counts = computed(() => ({
  products: productStore.products.length,
  variants: productStore.products.reduce((sum, p) => sum + (Array.isArray(p.variants) ? p.variants.length : 0), 0),
  attributes: attributeStore.attributes.length,
  lowStock: inventoryStore.items.filter(i => i.isLowStock).length
}))

// Bar chart: products by category
const categoryLabels = computed(() => {
  const ids = productStore.products.map(p => p.categoryId)
  const unique = Array.from(new Set(ids))
  return unique.map(id => productStore.categoryName?.(id) || `Danh mục ${id}`)
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
  ])
})
</script>
