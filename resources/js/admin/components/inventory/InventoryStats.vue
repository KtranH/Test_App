<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4" data-aos="fade-up" data-aos-duration="1000">
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-900">{{ totalVariants }}</div>
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
          <div class="text-2xl font-bold text-gray-900">{{ stableStock }}</div>
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
          <div class="text-2xl font-bold text-gray-900">{{ lowStock }}</div>
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
</template>

<script setup>
defineProps({
  totalVariants: { type: Number, required: true },
  stableStock: { type: Number, required: true },
  lowStock: { type: Number, required: true },
  totalQuantity: { type: Number, required: true }
})
</script>
