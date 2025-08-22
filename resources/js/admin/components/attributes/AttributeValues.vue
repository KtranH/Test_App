<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-medium text-gray-700">Giá trị thuộc tính</h4>
      <span class="text-xs text-gray-500">{{ values.length }} giá trị</span>
    </div>
    
    <div class="flex flex-wrap gap-2 min-h-[40px]">
      <span 
        v-for="v in values" 
        :key="v.id" 
        class="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm transition-colors duration-200 group/value"
        :title="attribute.type === 'color' ? (v.meta?.hex || v.value) : v.value"
        :class="{ 'bg-gray-50 text-gray-700 hover:bg-gray-100': attribute.type !== 'color' }"
        :style="chipStyle(attribute, v)"
      >
        <span v-if="attribute.type === 'color'" 
              class="w-5 h-5 rounded-md border border-white/40 shadow-sm" 
              :style="{ backgroundColor: (v.meta?.hex || v.value) }" />
        <span>{{ v.value }}</span>
        <span v-if="attribute.type === 'color' && (v.meta?.hex || v.value)" class="px-1.5 py-0.5 text-[10px] font-mono bg-white/60 border border-white/40 rounded">
          {{ (v.meta?.hex || v.value).toUpperCase() }}
        </span>
        <button 
          class="ml-1 w-5 h-5 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors duration-200 opacity-0 group-hover/value:opacity-100"
          @click="$emit('removeValue', v.id)"
          title="Xóa giá trị"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </span>
    </div>

    <!-- Add New Value Form -->
    <form class="flex gap-2" @submit.prevent="addNewValue">
      <div class="flex-1 relative">
        <input 
          v-model="newValue" 
          :placeholder="attribute.type === 'color' ? 'Nhập tên màu hoặc mã hex...' : 'Nhập giá trị mới...'" 
          class="w-full px-3 py-2 border rounded-lg outline-none transition-all duration-200 text-sm focus:ring-2"
          :class="valueError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'"
          :aria-invalid="!!valueError"
          @input="onValueInput"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </div>
      </div>
      
      <input 
        v-if="attribute.type === 'color'" 
        v-model="newColor" 
        type="color" 
        class="w-10 h-10 p-0 border border-gray-200 rounded-lg cursor-pointer hover:scale-110 transition-transform duration-200" 
        :title="newColor || '#000000'"
      />
      <div v-if="attribute.type === 'color'" class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-lg border border-gray-200 shadow-sm" :style="{ backgroundColor: newColor || '#000000' }"></div>
        <span class="text-xs font-mono text-gray-600">{{ (newColor || '#000000').toUpperCase() }}</span>
      </div>
      <button 
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Thêm
      </button>
    </form>
    
    <div v-if="attribute.type === 'color'" class="mt-2">
      <div class="text-xs text-gray-500 mb-1">Màu phổ biến:</div>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="p in colorPresets" :key="p.hex"
          class="w-8 h-8 rounded-md border border-gray-200 shadow-sm hover:scale-110 transition" 
          :style="{ backgroundColor: p.hex }"
          :title="p.name + ' ' + p.hex"
          @click.prevent="applyPreset(p)"
        />
      </div>
    </div>
    
    <p v-if="valueError" class="text-xs text-red-600 mt-1">{{ valueError }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  attribute: { type: Object, required: true },
  values: { type: Array, default: () => [] }
})

const emit = defineEmits(['addValue', 'removeValue'])

// Local state
const newValue = ref('')
const newColor = ref('')
const valueError = ref('')

// Color presets
const colorPresets = [
  { name: 'Đỏ', hex: '#EF4444' },
  { name: 'Hồng', hex: '#F472B6' },
  { name: 'Cam', hex: '#F97316' },
  { name: 'Vàng', hex: '#F59E0B' },
  { name: 'Xanh lá', hex: '#22C55E' },
  { name: 'Xanh dương', hex: '#3B82F6' },
  { name: 'Tím', hex: '#8B5CF6' },
  { name: 'Đen', hex: '#111827' },
  { name: 'Trắng', hex: '#FFFFFF' }
]

// Methods
const onValueInput = () => {
  if (valueError.value) {
    valueError.value = ''
  }
  
  if (props.attribute.type === 'color') {
    const input = newValue.value.trim()
    const hexRegex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
    if (hexRegex.test(input)) {
      newColor.value = input.length === 4
        ? '#' + input.slice(1).split('').map((c) => c + c).join('')
        : input
    }
  }
}

const addNewValue = () => {
  const valueInput = newValue.value.trim()
  if (!valueInput) {
    valueError.value = 'Vui lòng nhập giá trị trước khi thêm'
    return
  }
  
  const meta = {}
  if (newColor.value && props.attribute.type === 'color') {
    meta.hex = newColor.value
  }
  
  emit('addValue', { value: valueInput, meta })
  newValue.value = ''
  valueError.value = ''
}

const applyPreset = (preset) => {
  newColor.value = preset.hex
  newValue.value = preset.name
}

// Style động cho chip màu
const chipStyle = (attr, v) => {
  if (attr.type !== 'color') return {}
  const hex = (v.meta?.hex || v.value || '').toString()
  const normalized = normalizeHex(hex)
  const text = pickTextColor(normalized)
  return { backgroundColor: normalized || '#f3f4f6', color: text }
}

const normalizeHex = (hex) => {
  if (!hex) return ''
  let h = hex.startsWith('#') ? hex : '#' + hex
  const short3 = /^#([0-9a-fA-F]{3})$/
  const full6 = /^#([0-9a-fA-F]{6})$/
  if (short3.test(h)) {
    const s = h.slice(1)
    h = '#' + s.split('').map(c => c + c).join('')
  }
  if (!full6.test(h)) return hex
  return h.toUpperCase()
}

const pickTextColor = (hex) => {
  const m = /^#([0-9A-F]{6})$/.exec(hex || '')
  if (!m) return '#111827'
  const num = parseInt(m[1], 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return l > 160 ? '#111827' : '#FFFFFF'
}
</script>
