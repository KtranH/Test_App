import { ref, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useAttributeStore } from '@/admin/stores/attribute.store'
import { message } from 'ant-design-vue'

export function useAttributes() {
  const store = useAttributeStore()
  const { attributes, valuesByAttrId, isLoading, valuesPagingNext, valuesTotal } = storeToRefs(store)
  const { createAttribute, updateAttribute, disableAttribute, addValue, ensureInitialized, fetchMoreValues, toggleValue } = store

  // Reactive data
  const dialogRef = ref(null)
  const form = ref({ id: null, name: '', code: '', type: 'select', is_active: false })
  const newValueByAttrId = ref({})
  const newColorByAttrId = ref({})
  const valueErrors = ref({})

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

  // Computed properties
  const totalAttributes = computed(() => attributes.value.length)
  const variantDefiningAttributes = computed(() => attributes.value.filter(a => a.isVariantDefining).length)
  const colorAttributes = computed(() => attributes.value.filter(a => a.type === 'color').length)
  const selectAttributes = computed(() => attributes.value.filter(a => a.type === 'select').length)
  
  // Helper function để kiểm tra có cần load more values không
  const hasMoreValues = (attributeId) => {
    return !!valuesPagingNext.value[attributeId]
  }
  
  const getValuesTotal = (attributeId) => {
    return valuesTotal.value[attributeId] || 0
  }

  // Methods
  const openCreate = () => {
    form.value = { id: null, name: '', code: '', type: 'select', is_active: false }
    dialogRef.value?.showModal()
  }

  const edit = (attr) => {
    form.value = { ...attr }
    dialogRef.value?.showModal()
  }

  const closeDialog = () => dialogRef.value?.close()

  const save = (data) => {
    try {
      if (!data.name || !data.code) return
      
      // Map frontend fields sang backend fields
      const backendPayload = {
        name: data.name,
        code: data.code,
        type: data.type || 'select',
        is_active: data.is_active ?? true,
        is_filterable: data.is_active ?? false, // is_active cũng dùng làm is_filterable
      }
      
      if (data.id) {
        updateAttribute(data.id, backendPayload)
      } else {
        createAttribute(backendPayload)
      }
      closeDialog()
      message.success('Thao tác thuộc tính thành công!')
    } catch (error) {
      console.error(error)
      message.error('Thao tác thuộc tính thất bại!')
    }
  }

  const clearValueError = (attributeId) => {
    if (valueErrors.value[attributeId]) {
      const errs = valueErrors.value
      delete errs[attributeId]
    }
  }

  const onValueInput = (attr) => {
    const id = attr.id
    clearValueError(id)
    if (attr.type === 'color') {
      const input = (newValueByAttrId.value[id] || '').trim()
      const hexRegex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
      if (hexRegex.test(input)) {
        newColorByAttrId.value[id] = input.length === 4
          ? '#' + input.slice(1).split('').map((c) => c + c).join('')
          : input
      }
    }
  }

  const addNewValue = async (attributeId, data = null) => {
    let valueInput = ''
    let meta = {}
    
    if (data && data.value) {
      // Nếu có data được truyền vào, sử dụng data đó
      valueInput = data.value.trim()
      meta = data.meta || {}
    } else {
      // Nếu không có data, sử dụng giá trị từ local state
      valueInput = (newValueByAttrId.value[attributeId] || '').trim()
      if (newColorByAttrId.value[attributeId] && (attributes.value.find(a => a.id === attributeId)?.type === 'color')) {
        meta.hex = newColorByAttrId.value[attributeId]
      }
    }
    
    if (!valueInput) {
      valueErrors.value[attributeId] = 'Vui lòng nhập giá trị trước khi thêm'
      return
    }
    
    try {
      const result = await addValue(attributeId, { value: valueInput, meta })
      if (result) {
        newValueByAttrId.value[attributeId] = ''
        clearValueError(attributeId)
        message.success('Đã thêm giá trị thuộc tính')
      } else {
        message.error('Không thể thêm giá trị thuộc tính')
      }
    } catch (error) {
      console.error('Error adding attribute value:', error)
      message.error('Không thể thêm giá trị thuộc tính')
    }
  }

  const applyPreset = (preset, attributeId) => {
    newColorByAttrId.value[attributeId] = preset.hex
    newValueByAttrId.value[attributeId] = preset.name
  }

  const refresh = () => {
    // Clear pagination info trước khi refresh
    store.clearPagingInfo()
    store.fetchFirstPage()
  }
  
  const loadMoreValues = async (attributeId) => {
    try {
      const result = await fetchMoreValues(attributeId)
      if (result) {
        message.success(`Đã tải thêm ${result.length} giá trị`)
      }
      return result
    } catch (error) {
      console.error('Error loading more values:', error)
      message.error('Không thể tải thêm giá trị')
      return null
    }
  }

  const toggleActive = async (attr) => {
    try {
      const next = !attr.isActive
      
      await updateAttribute(attr.id, { is_active: next })
      
      // Cập nhật store để trigger reactivity
      const attrIndex = attributes.value.findIndex(a => a.id === attr.id)
      
      if (attrIndex !== -1) {
        // Sử dụng spread operator để tạo object mới và trigger reactivity
        const updatedAttr = { 
          ...attributes.value[attrIndex], 
          isActive: next 
        }
        attributes.value[attrIndex] = updatedAttr
        
        // Force trigger reactivity bằng cách gán lại array
        attributes.value = [...attributes.value]
        
        // Đảm bảo DOM được cập nhật
        await nextTick()     
      }
      
      message.success(next ? 'Đã bật thuộc tính' : 'Đã tắt thuộc tính')
    } catch (e) {
      console.error(e)
      message.error('Không thể cập nhật trạng thái')
    }
  }

  const toggleAttributeValue = async (id, isActive) => {
    try {
      const result = await store.toggleValue(id, isActive)
      if (result) {
        message.success(isActive ? 'Đã hiện giá trị thuộc tính' : 'Đã ẩn giá trị thuộc tính')
      } else {
        message.error('Không thể cập nhật trạng thái giá trị thuộc tính')
      }
      return result
    } catch (error) {
      console.error('Error toggling attribute value:', error)
      message.error('Không thể cập nhật trạng thái giá trị thuộc tính')
      return false
    }
  }

  const removeValue = async (id) => {
    try {
      const result = await store.removeValue(id)
      if (result) {
        message.success('Đã xóa giá trị thuộc tính')
      } else {
        message.error('Không thể xóa giá trị thuộc tính')
      }
    } catch (error) {
      console.error('Error removing attribute value:', error)
      message.error('Không thể xóa giá trị thuộc tính')
    }
  }

  return {
    // Store
    store,
    attributes,
    valuesByAttrId,
    isLoading,
    valuesPagingNext,
    valuesTotal,
    
    // Reactive data
    dialogRef,
    form,
    newValueByAttrId,
    newColorByAttrId,
    valueErrors,
    colorPresets,
    
    // Computed
    totalAttributes,
    variantDefiningAttributes,
    colorAttributes,
    selectAttributes,
    
    // Helper functions
    hasMoreValues,
    getValuesTotal,
    
    // Methods
    openCreate,
    edit,
    closeDialog,
    save,
    clearValueError,
    onValueInput,
    addNewValue,
    applyPreset,
    refresh,
    loadMoreValues,
    toggleActive,
    toggleAttributeValue,
    removeValue,
    ensureInitialized
  }
}
