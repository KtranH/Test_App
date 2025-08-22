<template>
  <div class="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
    <div class="flex flex-wrap gap-4 items-center">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input 
          :value="searchTerm"
          @input="$emit('update:searchTerm', $event.target.value)"
          placeholder="Tìm theo tên..." 
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
        />
      </div>
      <select 
        :value="status"
        @change="$emit('update:status', $event.target.value)"
        class="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="draft">Nháp</option>
        <option value="active">Đang hoạt động</option>
        <option value="archived">Lưu trữ</option>
      </select>
      <select 
        :value="categoryId"
        @change="$emit('update:categoryId', $event.target.value)"
        class="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <option :value="''">Tất cả danh mục</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next'

defineProps({
  searchTerm: { type: String, required: true },
  status: { type: String, required: true },
  categoryId: { type: [String, Number], required: true },
  categories: { type: Array, required: true }
})

defineEmits(['update:searchTerm', 'update:status', 'update:categoryId'])
</script>
