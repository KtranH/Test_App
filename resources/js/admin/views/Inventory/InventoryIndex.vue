<template>
  <section class="space-y-8">
    <!-- Header với gradient và shadow -->
    <header class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 shadow-sm border border-emerald-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Quản lý tồn kho</h1>
            <p class="text-gray-600 text-sm">Theo dõi và quản lý số lượng sản phẩm trong kho</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors duration-200 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Xuất báo cáo
          </button>
        </div>
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ items.length }}</div>
            <div class="text-sm text-gray-600">Tổng biến thể</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ items.filter(i => !i.isLowStock).length }}</div>
            <div class="text-sm text-gray-600">Tồn kho ổn định</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ items.filter(i => i.isLowStock).length }}</div>
            <div class="text-sm text-gray-600">Cần bổ sung</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ totalQuantity }}</div>
            <div class="text-sm text-gray-600">Tổng số lượng</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters và Search -->
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              v-model="searchTerm" 
              placeholder="Tìm kiếm sản phẩm..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
            />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <select v-model="stockFilter" class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200">
            <option value="">Tất cả</option>
            <option value="low">Tồn kho thấp</option>
            <option value="normal">Tồn kho ổn định</option>
          </select>
          <button 
            @click="refreshData"
            class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
            title="Làm mới dữ liệu"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <AdminCard v-if="isLoading" class="animate-pulse">
      <Skeletons type="table" :rows="8" />
    </AdminCard>

    <!-- Inventory Table -->
    <AdminCard v-else class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  Biến thể
                </div>
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Tên sản phẩm
                </div>
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  Số lượng
                </div>
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Tồn an toàn
                </div>
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  Trạng thái
                </div>
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 w-48">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 100 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                  Điều chỉnh
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr 
              v-for="(item, index) in filteredItems" 
              :key="item.id" 
              class="hover:bg-gray-50 transition-colors duration-200 group"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                    <span class="text-xs font-mono text-emerald-700">#{{ item.productVariantId }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ item.variant?.name || 'Chưa có tên' }}
                </div>
                <div class="text-xs text-gray-500">ID: {{ item.productVariantId }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="text-sm font-semibold text-gray-900">{{ item.quantity }}</div>
                  <div class="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-300"
                      :class="{
                        'bg-red-500': item.quantity <= item.safetyStock * 0.5,
                        'bg-yellow-500': item.quantity > item.safetyStock * 0.5 && item.quantity <= item.safetyStock,
                        'bg-green-500': item.quantity > item.safetyStock
                      }"
                      :style="{ width: `${Math.min((item.quantity / (item.safetyStock * 2)) * 100, 100)}%` }"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ item.safetyStock }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    item.isLowStock 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-green-100 text-green-800 border border-green-200'
                  ]"
                >
                  <svg v-if="item.isLowStock" class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <svg v-else class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ item.isLowStock ? 'Cần bổ sung' : 'Ổn định' }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button 
                    class="group/btn p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
                    @click="adjust(item.productVariantId, -1)"
                    title="Giảm 1"
                  >
                    <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                    </svg>
                  </button>
                  <button 
                    class="group/btn p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 border border-transparent hover:border-green-200"
                    @click="adjust(item.productVariantId, 1)"
                    title="Tăng 1"
                  >
                    <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                  <button 
                    class="group/btn p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                    @click="openAdjustModal(item)"
                    title="Điều chỉnh số lượng"
                  >
                    <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 100 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminCard>

    <!-- Pagination -->
    <div v-if="store.hasMore" class="flex justify-center">
      <button 
        class="group px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center gap-2"
        @click="store.fetchNextPage" 
        :disabled="isLoading"
      >
        <svg class="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
        </svg>
        Tải thêm
        <span class="text-sm text-gray-500">({{ items.length }}/{{ store.total }})</span>
      </button>
    </div>

    <!-- Adjust Quantity Modal -->
    <dialog ref="adjustModalRef" class="p-0 rounded-xl border border-gray-200 shadow-2xl backdrop:bg-black/20">
      <form method="dialog" class="min-w-[400px] p-6 space-y-6" @submit.prevent>
        <div class="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 100 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">Điều chỉnh số lượng</h3>
        </div>
        
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-2">Sản phẩm</div>
            <div class="font-medium text-gray-900">{{ selectedItem?.variant?.name || `Variant #${selectedItem?.productVariantId}` }}</div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Số lượng hiện tại</label>
              <div class="px-3 py-2 bg-gray-100 rounded-lg text-gray-900 font-mono">{{ selectedItem?.quantity || 0 }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tồn an toàn</label>
              <div class="px-3 py-2 bg-gray-100 rounded-lg text-gray-900 font-mono">{{ selectedItem?.safetyStock || 0 }}</div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Số lượng mới</label>
            <input 
              v-model="adjustQuantity" 
              type="number" 
              min="0"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
              placeholder="Nhập số lượng mới"
            />
          </div>
          
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div class="text-sm text-blue-700">
              <strong>Lưu ý:</strong> Số lượng mới sẽ thay thế hoàn toàn số lượng hiện tại trong kho.
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="button"
            class="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            @click="closeAdjustModal"
          >
            Hủy
          </button>
          <button 
            type="button"
            class="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
            @click="saveAdjustment"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </dialog>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '@/admin/stores/inventory.store'
import AdminCard from '@/admin/components/ui/AdminCard.vue'
import Skeletons from '@/admin/components/ui/Skeletons.vue'

const store = useInventoryStore()
const { items, isLoading } = storeToRefs(store)
const { adjust, ensureInitialized } = store

// Reactive data
const searchTerm = ref('')
const stockFilter = ref('')
const adjustModalRef = ref(null)
const selectedItem = ref(null)
const adjustQuantity = ref(0)

// Computed properties
const totalQuantity = computed(() => {
  return items.value.reduce((sum, item) => sum + item.quantity, 0)
})

const filteredItems = computed(() => {
  let filtered = items.value

  if (searchTerm.value) {
    filtered = filtered.filter(item => 
      item.variant?.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      item.productVariantId.toString().includes(searchTerm.value)
    )
  }

  if (stockFilter.value === 'low') {
    filtered = filtered.filter(item => item.isLowStock)
  } else if (stockFilter.value === 'normal') {
    filtered = filtered.filter(item => !item.isLowStock)
  }

  return filtered
})

// Methods
const refreshData = async () => {
  await ensureInitialized()
}

const openAdjustModal = (item) => {
  selectedItem.value = item
  adjustQuantity.value = item.quantity
  adjustModalRef.value?.showModal()
}

const closeAdjustModal = () => {
  adjustModalRef.value?.close()
  selectedItem.value = null
  adjustQuantity.value = 0
}

const saveAdjustment = () => {
  if (selectedItem.value && adjustQuantity.value >= 0) {
    // Tính toán sự khác biệt để sử dụng hàm adjust
    const difference = adjustQuantity.value - selectedItem.value.quantity
    adjust(selectedItem.value.productVariantId, difference)
    closeAdjustModal()
  }
}

onMounted(async () => {
  await ensureInitialized()
})
</script>

<style scoped>
dialog::backdrop { 
  background: rgba(0,0,0,0.3); 
  backdrop-filter: blur(4px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

tbody tr {
  animation: fadeInUp 0.4s ease-out forwards;
}
</style>


