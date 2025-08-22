<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4" data-aos="fade-up" data-aos-duration="1000">
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-900">{{ totalAttributes }}</div>
          <div class="text-sm text-gray-600">Tổng thuộc tính</div>
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
          <div class="text-2xl font-bold text-gray-900">{{ variantDefiningAttributes }}</div>
          <div class="text-sm text-gray-600">Tạo biến thể</div>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M7 7h.01"></path>
          </svg>
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-900">{{ colorAttributes }}</div>
          <div class="text-sm text-gray-600">Thuộc tính màu</div>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-900">{{ selectAttributes }}</div>
          <div class="text-sm text-gray-600">Thuộc tính chọn</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalAttributes: { type: Number, required: true },
  variantDefiningAttributes: { type: Number, required: true },
  colorAttributes: { type: Number, required: true },
  selectAttributes: { type: Number, required: true }
})
</script>
