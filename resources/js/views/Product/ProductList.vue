<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
            <p class="mt-2 text-gray-600">Quản lý sản phẩm và biến thể của bạn</p>
          </div>
          <button class="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Thêm Sản phẩm
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200">
              <option value="">Tất cả</option>
              <option value="ao-thun">Áo thun</option>
              <option value="quan-jean">Quần jean</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Giá</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200">
              <option value="">Tất cả</option>
              <option value="0-300000">Dưới 300k</option>
              <option value="300000-500000">300k - 500k</option>
              <option value="500000+">Trên 500k</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200">
              <option value="">Tất cả</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Ngừng bán</option>
            </select>
          </div>
          <div class="flex items-end">
            <button class="w-full bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition-all duration-300">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="product in activeProducts" 
          :key="product.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl group"
        >
          <!-- Product Image -->
          <div class="relative overflow-hidden bg-gray-100">
            <img 
              :src="product.image" 
              :alt="product.name"
              class="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110"
            />
            <div class="absolute top-4 right-4">
              <span class="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                {{ product.category }}
              </span>
            </div>
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>

          <!-- Product Info -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors duration-300">
              {{ product.name }}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ product.description }}
            </p>
            
            <!-- Price -->
            <div class="flex items-center justify-between mb-4">
              <span class="text-2xl font-bold text-black">
                {{ formatPrice(product.base_price) }}
              </span>
              <span class="text-sm text-gray-500">
                {{ product.variants.length }} biến thể
              </span>
            </div>

            <!-- Variants Preview -->
            <div class="mb-6">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="variant in product.variants.slice(0, 3)" 
                  :key="variant.id"
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                >
                  {{ variant.size }} - {{ variant.color }}
                </span>
                <span v-if="product.variants.length > 3" class="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                  +{{ product.variants.length - 3 }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button 
                @click="viewProduct(product)"
                class="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Xem chi tiết
              </button>
              <button class="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="activeProducts.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Không có sản phẩm</h3>
          <p class="mt-1 text-sm text-gray-500">Bắt đầu tạo sản phẩm đầu tiên của bạn.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProductStore } from '@/stores/productStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const productStore = useProductStore()
const router = useRouter()
const { activeProducts } = storeToRefs(productStore)
const { formatPrice } = productStore

const viewProduct = (product) => {
  router.push(`/products/${product.id}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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
