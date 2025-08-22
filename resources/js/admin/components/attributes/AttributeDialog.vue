<template>
  <dialog ref="dialogRef" class="p-0 rounded-xl border border-gray-200 shadow-2xl backdrop:bg-black/20">
    <form method="dialog" class="min-w-[480px] p-6 space-y-6" @submit.prevent>
      <div class="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900">{{ form.id ? 'Sửa thuộc tính' : 'Thêm thuộc tính mới' }}</h3>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tên thuộc tính</label>
          <input 
            v-model="form.name" 
            placeholder="Ví dụ: Màu sắc, Kích thước, Chất liệu..." 
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Mã thuộc tính</label>
          <input 
            v-model="form.code" 
            placeholder="Ví dụ: color, size, material..." 
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-mono"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Loại thuộc tính</label>
          <select 
            v-model="form.type" 
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
          >
            <option value="select">Select - Chọn từ danh sách</option>
            <option value="color">Color - Màu sắc</option>
            <option value="text">Text - Văn bản</option>
          </select>
        </div>
        
        <label class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <input 
            type="checkbox" 
            v-model="form.is_active"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <div class="text-sm font-medium text-blue-900">Dùng để tạo biến thể sản phẩm</div>
            <div class="text-xs text-blue-700">Khi bật, thuộc tính này sẽ được sử dụng để tạo các biến thể khác nhau của sản phẩm</div>
          </div>
        </label>
      </div>
      
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button 
          type="button"
          class="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          @click="closeDialog"
        >
          Hủy
        </button>
        <button 
          type="button"
          class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          @click="save"
        >
          {{ form.id ? 'Cập nhật' : 'Tạo mới' }}
        </button>
      </div>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  attribute: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue', 'save'])

const dialogRef = ref(null)
const form = ref({ id: null, name: '', code: '', type: 'select', is_active: false })

// Watch for changes in attribute prop
watch(() => props.attribute, (newAttr) => {
  if (newAttr && Object.keys(newAttr).length > 0) {
    form.value = { ...newAttr }
  } else {
    form.value = { id: null, name: '', code: '', type: 'select', is_active: false }
  }
}, { immediate: true })

// Watch for modelValue changes to show/hide dialog
watch(() => props.modelValue, (show) => {
  if (show) {
    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
  }
})

const closeDialog = () => {
  emit('update:modelValue', false)
}

const save = () => {
  if (!form.value.name || !form.value.code) return
  emit('save', { ...form.value })
  closeDialog()
}
</script>

<style scoped>
dialog::backdrop { 
  background: rgba(0,0,0,0.3); 
  backdrop-filter: blur(4px);
}
</style>
