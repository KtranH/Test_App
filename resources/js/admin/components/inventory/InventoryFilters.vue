<template>
  <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm" data-aos="fade-up" data-aos-duration="1000">
    <div class="flex flex-col md:flex-row gap-4 items-center">
      <div class="flex-1">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            :value="searchTerm"
            @input="$emit('update:searchTerm', $event.target.value)"
            placeholder="Tìm kiếm sản phẩm..." 
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
          />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <select 
          :value="stockFilter"
          @change="$emit('update:stockFilter', $event.target.value)"
          class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
        >
          <option value="">Tất cả</option>
          <option value="low">Tồn kho thấp</option>
          <option value="normal">Tồn kho ổn định</option>
        </select>
        <button 
          @click="$emit('refresh')"
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
</template>

<script setup>
defineProps({
  searchTerm: { type: String, required: true },
  stockFilter: { type: String, required: true }
})

defineEmits(['update:searchTerm', 'update:stockFilter', 'refresh'])
</script>
