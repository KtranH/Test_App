<template>
  <dialog ref="dialogRef" class="p-0 rounded-2xl border border-gray-200 shadow-2xl backdrop:bg-black/20">
    <form method="dialog" class="min-w-[500px] p-6 space-y-6" @submit.prevent>
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isEditing ? 'Sửa giá trị thuộc tính' : 'Thêm giá trị thuộc tính' }}
        </h3>
        <button 
          type="button" 
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          @click="closeDialog"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <!-- Value -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Giá trị <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="form.value" 
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Nhập giá trị thuộc tính"
            :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.value }"
          />
          <p v-if="errors.value" class="mt-1 text-sm text-red-600">{{ errors.value }}</p>
        </div>

        <!-- Code -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mã code
          </label>
          <input 
            v-model="form.code" 
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Nhập mã code (tự động tạo nếu để trống)"
          />
        </div>

        <!-- Color Code (chỉ hiển thị khi attribute type là color) -->
        <div v-if="attributeType === 'color'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mã màu
          </label>
          <div class="flex gap-2">
            <input 
              v-model="form.color_code" 
              type="color" 
              class="w-16 h-10 p-0 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input 
              v-model="form.color_code" 
              type="text" 
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="#000000"
            />
          </div>
        </div>

        <!-- Image URL -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            URL hình ảnh
          </label>
          <input 
            v-model="form.image" 
            type="url" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <!-- Sort Order -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Thứ tự sắp xếp
          </label>
          <input 
            v-model.number="form.sort_order" 
            type="number" 
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="0"
          />
        </div>

        <!-- Is Active -->
        <div class="flex items-center">
          <input 
            v-model="form.is_active" 
            type="checkbox" 
            id="is_active"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label for="is_active" class="ml-2 text-sm font-medium text-gray-700">
            Kích hoạt giá trị này
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button 
          type="button" 
          class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          @click="closeDialog"
        >
          Hủy
        </button>
        <button 
          type="submit" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          @click="handleSave"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="inline-flex items-center gap-2">
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang lưu...
          </span>
          <span v-else>{{ isEditing ? 'Cập nhật' : 'Thêm mới' }}</span>
        </button>
      </div>
    </form>
  </dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { message } from 'ant-design-vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  attributeType: { type: String, default: 'select' },
  value: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'save'])

const dialogRef = ref(null)
const isSubmitting = ref(false)

// Form data
const form = reactive({
  id: null,
  value: '',
  code: '',
  color_code: '',
  image: '',
  sort_order: 0,
  is_active: true
})

// Validation errors
const errors = reactive({
  value: ''
})



// Watch for modelValue changes
watch(() => props.modelValue, (show) => {
  if (show) {
    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
  }
})

// Watch for value changes to populate form
watch(() => props.value, (newValue) => {
  if (newValue && newValue.id) {
    // Edit existing value
    Object.assign(form, {
      id: newValue.id,
      value: newValue.value || '',
      code: newValue.meta?.code || '',
      color_code: newValue.meta?.hex || '',
      image: newValue.meta?.image || '',
      sort_order: newValue.sortOrder || 0,
      is_active: newValue.isActive !== false
    })
  } else {
    // Reset form for new value
    Object.assign(form, {
      id: null,
      value: '',
      code: '',
      color_code: '',
      image: '',
      sort_order: 0,
      is_active: true
    })
  }
}, { immediate: true })

// Computed để kiểm tra chính xác hơn
const isEditing = computed(() => {
  return props.value && props.value.id && form.id === props.value.id
})

// Methods
const validateForm = () => {
  errors.value = ''
  
  if (!form.value.trim()) {
    errors.value = 'Vui lòng nhập giá trị thuộc tính'
    return false
  }
  
  return true
}

const closeDialog = () => {
  emit('update:modelValue', false)
}

const handleSave = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    // Auto-generate code if empty
    if (!form.code.trim()) {
      form.code = form.value.toLowerCase().replace(/\s+/g, '_')
    }
    
    // Prepare data for API
    const data = {
      value: form.value.trim(),
      code: form.code.trim(),
      color_code: form.color_code || null,
      image: form.image || null,
      sort_order: form.sort_order || 0,
      is_active: form.is_active
    }
    
    emit('save', { id: form.id, data })
    closeDialog()
    message.success(isEditing.value ? 'Đã cập nhật giá trị thuộc tính' : 'Đã thêm giá trị thuộc tính')
  } catch (error) {
    console.error('Error saving attribute value:', error)
    message.error('Không thể lưu giá trị thuộc tính')
  } finally {
    isSubmitting.value = false
  }
}

// Expose methods
defineExpose({
  open: () => dialogRef.value?.showModal(),
  close: () => dialogRef.value?.close()
})
</script>

<style scoped>
dialog::backdrop {
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
}
</style>
