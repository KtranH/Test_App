<template>
  <div 
    class="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    :class="{ 'opacity-60 grayscale pointer-events-auto': attribute.isActive === false }"
  >

    <div class="p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" 
                 :class="{
                   'bg-blue-100': attribute.type === 'select',
                   'bg-green-100': attribute.type === 'color',
                   'bg-purple-100': attribute.type === 'text'
                 }">
              <svg v-if="attribute.type === 'select'" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              <svg v-else-if="attribute.type === 'color'" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M7 7h.01"></path>
              </svg>
              <svg v-else class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 text-lg">{{ attribute.name }}</h3>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <span class="px-2 py-1 bg-gray-100 rounded-md font-mono">{{ attribute.code }}</span>
                <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-md capitalize">{{ attribute.type }}</span>
                <span v-if="attribute.isVariantDefining" class="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">
                  Tạo biến thể
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            @click="$emit('edit', attribute)"
            title="Sửa thuộc tính"
          >
            <Pencil class="w-4 h-4" />
          </button>
          
          <button 
            class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
            @click="$emit('createValue', attribute)"
            title="Thêm giá trị mới"
          >
            <Plus class="w-4 h-4" />
          </button>
          
          <button
            class="px-3 py-1.5 rounded-lg border transition-colors duration-200"
            :class="attribute.isActive ? 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100' : 'border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100'"
            @click="$emit('toggle', attribute)"
            :title="attribute.isActive ? 'Đang bật - nhấn để tắt' : 'Đang tắt - nhấn để bật'"
          >
            <span class="inline-flex items-center gap-1 text-xs font-medium">
              <span class="w-2 h-2 rounded-full" :class="attribute.isActive ? 'bg-green-500' : 'bg-gray-400'"></span>
              {{ attribute.isActive ? 'Bật' : 'Tắt' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Values Section -->
      <AttributeValues 
        :attribute="attribute"
        :values="values"
        :has-more="hasMore"
        :total="total"
        @add-value="$emit('addValue', $event)"
        @remove-value="$emit('removeValue', $event)"
        @load-more="$emit('loadMore', $event)"
        @toggle-value="$emit('toggleValue', $event)"
        @edit-value="$emit('editValue', $event)"
        @create-value="$emit('createValue', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import AttributeValues from './AttributeValues.vue'
import { Plus, Pencil } from 'lucide-vue-next'

defineProps({
  attribute: { type: Object, required: true },
  values: { type: Array, default: () => [] },
  hasMore: { type: Boolean, default: false },
  total: { type: Number, default: 0 }
})

defineEmits(['edit', 'toggle', 'addValue', 'removeValue', 'loadMore', 'toggleValue', 'editValue', 'createValue'])
</script>
