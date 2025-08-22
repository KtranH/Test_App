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
      <ProductFilters 
        v-model:search-term="q"
        v-model:status="status"
        v-model:category-id="categoryId"
        :categories="categories"
      />

      <!-- Table -->
      <ProductTable 
        :products="filtered"
        :expanded-id="expandedId"
        :row-loading="rowLoading"
        :category-name="categoryName"
        :format-price="formatPrice"
        @toggle-expand="toggleExpand"
        @remove="remove"
        @edit-variant="handleEditVariant"
        @remove-variant="handleRemoveVariant"
      />
    </div>
    
    <!-- Dialog sửa biến thể -->
    <VariantEditDialog ref="editRef" />
    <!-- Dialog xác nhận xóa biến thể -->
    <ConfirmDialog ref="confirmRef" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProducts } from '@/admin/composable/useProducts'
import { 
  Plus, Package, PackageSearch, LoaderCircle
} from 'lucide-vue-next'
import VariantEditDialog from '@/admin/components/product/VariantEditDialog.vue'
import ConfirmDialog from '@/admin/components/ui/ConfirmDialog.vue'
import ProductFilters from '@/admin/components/products/ProductFilters.vue'
import ProductTable from '@/admin/components/products/ProductTable.vue'

const {
  productStore,
  categoryStore,
  q,
  status,
  categoryId,
  expandedId,
  rowLoading,
  products,
  isLoading,
  categories,
  filtered,
  categoryName,
  remove,
  toggleExpand,
  formatPrice,
  refresh,
  editVariant,
  removeVariant,
  ensureInitialized
} = useProducts()

// Dialog sửa biến thể
const editRef = ref(null)
const handleEditVariant = async (product, variant) => {
  const result = await editVariant(product, variant)
  if (!result) return
  
  const { mapped, inventory } = result
  const res = await editRef.value?.open(mapped, { inventory })
  if (!res) return
  
  // cập nhật biến thể trong danh sách product hiện tại (frontend-only)
  const idx = product.variants.findIndex(v => v.id === res.id)
  if (idx >= 0) {
    product.variants[idx] = {
      ...product.variants[idx],
      sku: res.sku,
      name: res.name,
      price: res.price,
      salePrice: res.salePrice,
      weight: res.weight,
      width: res.width,
      height: res.height,
      length: res.length,
      isActive: res.isActive,
      attributeCombination: res.attributeCombination,
      inventory: res.inventory,
    }
  }
}

// Xóa biến thể
const confirmRef = ref(null)
const handleRemoveVariant = async (product, variant) => {
  const ok = await confirmRef.value?.open({
    title: 'Xác nhận xóa biến thể',
    message: `Bạn có chắc muốn xóa biến thể SKU: ${variant.sku || variant.id}?`,
    confirmText: 'Xóa',
    cancelText: 'Hủy',
  })
  if (!ok) return
  
  await removeVariant(product, variant)
}

onMounted(async () => {
  await ensureInitialized()
})
</script>



 