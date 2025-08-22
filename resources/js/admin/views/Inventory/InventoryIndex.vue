<template>
  <section class="space-y-8">
    <!-- Header với gradient và shadow -->
    <header class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 shadow-sm border border-emerald-100" data-aos="fade-up" data-aos-duration="800">
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
          <button @click="refresh()" class="px-4 py-2 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors duration-200 flex items-center gap-2">
            <LoaderCircle class="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            Tải mới
          </button>
        </div>
      </div>
    </header>

    <!-- Stats Cards -->
    <InventoryStats 
      :total-variants="items?.length ?? 0"
      :stable-stock="items?.filter?.(i => !i.isLowStock)?.length ?? 0"
      :low-stock="items?.filter?.(i => i.isLowStock)?.length ?? 0"
      :total-quantity="totalQuantity ?? 0"
    />

    <!-- Filters và Search -->
    <InventoryFilters 
      v-model:search-term="searchTerm"
      v-model:stock-filter="stockFilter"
      @refresh="refreshData"
    />

    <!-- Loading State -->
    <AdminCard v-if="isLoading" class="animate-pulse">
      <Skeletons type="table" :rows="8" />
    </AdminCard>

    <!-- Inventory Table -->
    <InventoryTable 
      v-else
      :items="filteredItems"
      @adjust="adjust"
      @open-adjust-modal="openAdjustModal"
    />

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
import { onMounted } from 'vue'
import { useInventory } from '@/admin/composable/useInventory'
import AdminCard from '@/admin/components/ui/AdminCard.vue'
import Skeletons from '@/admin/components/ui/Skeletons.vue'
import InventoryStats from '@/admin/components/inventory/InventoryStats.vue'
import InventoryFilters from '@/admin/components/inventory/InventoryFilters.vue'
import InventoryTable from '@/admin/components/inventory/InventoryTable.vue'
import { LoaderCircle } from 'lucide-vue-next'

const {
  store,
  items,
  isLoading,
  searchTerm,
  stockFilter,
  adjustModalRef,
  selectedItem,
  adjustQuantity,
  totalQuantity,
  filteredItems,
  refreshData,
  openAdjustModal,
  closeAdjustModal,
  saveAdjustment,
  refresh,
  adjust,
  ensureInitialized
} = useInventory()

onMounted(async () => {
  await ensureInitialized()
})
</script>

<style scoped>
dialog::backdrop { 
  background: rgba(0,0,0,0.3); 
  backdrop-filter: blur(4px);
}
</style>


