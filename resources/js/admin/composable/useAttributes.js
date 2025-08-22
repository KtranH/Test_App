import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAttributeStore } from '@/admin/stores/attribute.store'
import { message } from 'ant-design-vue'

export function useAttributes() {
  const store = useAttributeStore()
  const { attributes, valuesByAttrId, isLoading } = storeToRefs(store)
  const { createAttribute, updateAttribute, disableAttribute, addValue, ensureInitialized } = store

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

  const save = () => {
    try {
      if (!form.value.name || !form.value.code) return
      
      // Map frontend fields sang backend fields
      const backendPayload = {
        name: form.value.name,
        code: form.value.code,
        type: form.value.type || 'select',
        is_active: form.value.is_active ?? true,
        is_filterable: form.value.is_active ?? false, // is_active cũng dùng làm is_filterable
      }
      
      if (form.value.id) {
        updateAttribute(form.value.id, backendPayload)
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

  const addNewValue = async (attributeId) => {
    const valueInput = (newValueByAttrId.value[attributeId] || '').trim()
    if (!valueInput) {
      valueErrors.value[attributeId] = 'Vui lòng nhập giá trị trước khi thêm'
      return
    }
    const meta = {}
    if (newColorByAttrId.value[attributeId] && (attributes.value.find(a => a.id === attributeId)?.type === 'color')) {
      meta.hex = newColorByAttrId.value[attributeId]
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
    store.fetchFirstPage()
  }

  const toggleActive = async (attr) => {
    try {
      const next = !attr.isActive
      await updateAttribute(attr.id, { is_active: next })
      message.success(next ? 'Đã bật thuộc tính' : 'Đã tắt thuộc tính')
    } catch (e) {
      console.error(e)
      message.error('Không thể cập nhật trạng thái')
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
    toggleActive,
    removeValue,
    ensureInitialized
  }
}
