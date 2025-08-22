<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-medium text-gray-700">Giá trị thuộc tính</h4>
      <span class="text-xs text-gray-500">
        {{ values.filter(v => v.isActive !== false).length }}{{ total > values.length ? `/${total}` : '' }} giá trị
        <span v-if="hiddenValues.length > 0" class="text-gray-400">({{ hiddenValues.length }} ẩn)</span>
      </span>
    </div>
    
    <div class="flex flex-wrap gap-2 min-h-[40px]">
      <span 
        v-for="v in values.filter(v => v.isActive !== false)" 
        :key="v.id" 
        class="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors duration-200 group/value"
        :title="attribute.type === 'color' ? (v.meta?.hex || v.value) : v.value"
        :class="[
          attribute.type !== 'color' ? 'bg-gray-50 text-gray-700 hover:bg-gray-100' : '',
          !v.isActive ? 'opacity-50 grayscale border-gray-300' : 'border-gray-200'
        ]"
        :style="chipStyle(attribute, v)"
      >
        <span v-if="attribute.type === 'color'" 
              class="w-5 h-5 rounded-md border border-white/40 shadow-sm" 
              :style="{ backgroundColor: (v.meta?.hex || v.value) }" />
        <span>{{ v.value }}</span>
        <span v-if="attribute.type === 'color' && (v.meta?.hex || v.value)" class="px-1.5 py-0.5 text-[10px] font-mono bg-white/60 border border-white/40 rounded">
          {{ (v.meta?.hex || v.value).toUpperCase() }}
        </span>
        
        <!-- Status indicator -->
        <span v-if="!v.isActive" class="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded">
          Ẩn
        </span>
        
        <div class="flex items-center gap-1 opacity-0 group-hover/value:opacity-100 transition-opacity duration-200">
          <!-- TODO: Edit button -->
          <button 
            class="w-5 h-5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors duration-200"
            @click="$emit('editValue', v)"
            title="Sửa giá trị"
          >
            <Pencil class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          </button>
          <!-- Toggle button -->
          <button 
            class="w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-200 text-red-600"
            :class="v.isActive ? 'bg-red-100 hover:bg-red-200' : 'bg-green-100 hover:bg-green-200'"
            @click="$emit('toggleValue', { id: v.id, isActive: !v.isActive })"
            :title="v.isActive ? 'Nhấn để ẩn' : 'Nhấn để hiện'"
          >
            <EyeOff v-if="v.isActive" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          </button>
          
          <!-- Delete button -->
          <!--<button 
            class="w-5 h-5 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors duration-200"
            @click="$emit('removeValue', v.id)"
            title="Xóa giá trị"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>-->
        </div>
      </span>
    </div>

    <!-- Add New Value Button -->
    <div class="flex justify-center mt-4">
      <button 
        @click="$emit('createValue', attribute)"
        class="px-4 py-2 w-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 font-medium rounded-lg hover:shadow-lg hover:shadow-blue-100/50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex justify-center items-center gap-2"
      >
        <span class="flex items-center gap-2">
          <Plus class="w-4 h-4" />
          <span>Thêm giá trị mới</span>
        </span>
      </button>
    </div>
    
    <!-- Hidden Values Section -->
    <div v-if="hiddenValues.length > 0" class="mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center justify-between mb-2">
        <h5 class="text-xs font-medium text-gray-500">Giá trị đã ẩn</h5>
        <span class="text-xs text-gray-400">{{ hiddenValues.length }} giá trị</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="v in hiddenValues" 
          :key="v.id" 
          class="inline-flex items-center gap-2 px-2 py-1 border border-gray-300 rounded text-xs opacity-60 group/hidden"
        >
          <span v-if="attribute.type === 'color'" 
                class="w-3 h-3 rounded border border-white/40 shadow-sm" 
                :style="{ backgroundColor: (v.meta?.hex || v.value) }" />
          <span class="text-gray-600">{{ v.value }}</span>
          
          <!-- Show button for hidden values -->
          <button 
            class="w-4 h-4 rounded-full bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 flex items-center justify-center transition-colors duration-200 opacity-0 group-hover/hidden:opacity-100"
            @click="$emit('toggleValue', { id: v.id, isActive: true })"
            title="Hiện giá trị"
          >
          <Eye class="w-3 h-3 text-green-600 hover:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          </button>
        </span>
      </div>
    </div>
    
    <!-- Load More Button -->
    <div v-if="hasMore" class="mt-3 pt-3 border-t border-gray-100">
      <button 
        @click="$emit('loadMore')"
        class="w-full px-4 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7l-7-7"></path>
        </svg>
        Tải thêm giá trị
        <span class="text-xs text-gray-500">({{ values.length }}/{{ total }})</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Eye, EyeOff, Pencil, Plus } from 'lucide-vue-next'

const props = defineProps({
  attribute: { type: Object, required: true },
  values: { type: Array, default: () => [] },
  hasMore: { type: Boolean, default: false },
  total: { type: Number, default: 0 }
})

const emit = defineEmits(['addValue', 'removeValue', 'loadMore', 'toggleValue', 'editValue', 'createValue'])

// Computed properties
const hiddenValues = computed(() => 
  props.values.filter(v => v.isActive === false)
)



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
