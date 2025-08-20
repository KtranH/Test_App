<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Back Button -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <button 
        @click="goBack"
        class="inline-flex items-center text-gray-600 hover:text-black transition-colors duration-200 mb-6 group"
      >
        <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Quay lại
      </button>
    </div>

    <div v-if="selectedProduct && selectedProduct.id && !isLoading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <!-- Product Header -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <!-- Product Image -->
          <div class="relative overflow-hidden bg-gray-100">
            <img 
              :src="selectedProduct.image" 
              :alt="selectedProduct.name"
              class="w-full h-96 lg:h-full object-cover"
            />
            <div class="absolute top-4 left-4">
              <span class="bg-black text-white px-4 py-2 rounded-full text-sm font-medium">
                {{ selectedProduct.category }}
              </span>
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-8 flex flex-col justify-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
              {{ selectedProduct.name }}
            </h1>
            <p class="text-gray-600 text-lg mb-6 leading-relaxed">
              {{ selectedProduct.description }}
            </p>
            
            <!-- Price -->
            <div class="mb-8">
              <span class="text-4xl font-bold text-black">
                {{ formatPrice(selectedProduct.base_price) }}
              </span>
              <p class="text-sm text-gray-500 mt-1">Giá cơ bản</p>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-3 gap-6 mb-8">
              <div class="text-center">
                <div class="text-2xl font-bold text-black">{{ selectedProduct.variants.length }}</div>
                <div class="text-sm text-gray-500">Biến thể</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-black">
                  {{ getTotalStock() }}
                </div>
                <div class="text-sm text-gray-500">Tổng tồn kho</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-black">
                  {{ getActiveVariants() }}
                </div>
                <div class="text-sm text-gray-500">Đang bán</div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-4">
              <button class="flex-1 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Chỉnh sửa
              </button>
              <button class="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:border-black hover:text-black rounded-lg font-medium transition-all duration-300">
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Variants Section -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Biến thể Sản phẩm</h2>
          <p class="text-gray-600 mt-1">Quản lý các biến thể về size, màu sắc và chất liệu</p>
        </div>

        <!-- Variants Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Màu sắc</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chất liệu</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="variant in selectedProduct.variants" 
                :key="variant.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {{ variant.sku }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ variant.size }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div 
                      class="w-4 h-4 rounded-full mr-2 border border-gray-300"
                      :style="{ backgroundColor: getColorHex(variant.color) }"
                    ></div>
                    <span class="text-sm text-gray-900">{{ variant.color }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{ variant.material }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatPrice(selectedProduct.base_price + variant.price_adjustment) }}
                    <span v-if="variant.price_adjustment > 0" class="text-xs text-green-600 ml-1">
                      (+{{ formatPrice(variant.price_adjustment) }})
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="variant.stock > 10 ? 'bg-green-100 text-green-800' : variant.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ variant.stock }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="variant.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ variant.is_active ? 'Đang bán' : 'Ngừng bán' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button class="text-gray-400 hover:text-black transition-colors duration-200">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button class="text-gray-400 hover:text-red-500 transition-colors duration-200">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Add Variant Button -->
        <div class="p-6 bg-gray-50">
          <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-black transition-all duration-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Thêm biến thể mới
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p class="mt-4 text-gray-600">Đang tải thông tin sản phẩm...</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="!selectedProduct || !selectedProduct.id" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-3.035 0-5.878-1.397-7.672-3.709M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
        <p class="mt-1 text-sm text-gray-500">Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
        <button 
          @click="goBack"
          class="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Quay lại danh sách
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProductStore } from '@/stores/productStore'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, watch } from 'vue'

const productStore = useProductStore()
const router = useRouter()
const route = useRoute()
const { selectedProduct, isLoading } = storeToRefs(productStore)
const { formatPrice, getProductById, setSelectedProduct } = productStore

// Lấy product ID từ route params
const productId = parseInt(route.params.id)

// Tự động load sản phẩm khi component mount hoặc route thay đổi
onMounted(() => {
  if (productId) {
    const product = getProductById(productId)
    if (product) {
      setSelectedProduct(product)
    } else {
      // Nếu không tìm thấy sản phẩm, redirect về danh sách
      router.push('/products')
    }
  }
})

// Watch route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    const product = getProductById(parseInt(newId))
    if (product) {
      setSelectedProduct(product)
    } else {
      // Nếu không tìm thấy sản phẩm, redirect về danh sách
      router.push('/products')
    }
  }
})

const goBack = () => {
  productStore.clearSelectedProduct()
  router.push('/products')
}

const getTotalStock = () => {
  if (!selectedProduct.value) return 0
  return selectedProduct.value.variants.reduce((total, variant) => total + variant.stock, 0)
}

const getActiveVariants = () => {
  if (!selectedProduct.value) return 0
  return selectedProduct.value.variants.filter(variant => variant.is_active).length
}

const getColorHex = (color) => {
  const colorMap = {
    'Đen': '#000000',
    'Trắng': '#FFFFFF',
    'Xanh đậm': '#1e3a8a',
    'Đỏ': '#dc2626',
    'Xanh': '#2563eb'
  }
  return colorMap[color] || '#6b7280'
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
