import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db, uid } from '@/admin/services/db'
import { AttributesApi } from '@/admin/api/attributes'
import { AttributesValuesApi } from '@/admin/api/attributes_values'

const ATTRIBUTES_KEY = 'attributes'
const ATTRIBUTE_VALUES_KEY = 'attributeValues'
const VALUES_PAGING_KEY = 'attributeValuesPaging'
const VALUES_TOTAL_KEY = 'attributeValuesTotal'

export const useAttributeStore = defineStore('admin.attributes', () => {
  const attributes = ref(db.getCollection(ATTRIBUTES_KEY))
  const values = ref(db.getCollection(ATTRIBUTE_VALUES_KEY)) // flat list
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const pagingNext = ref(null)
  const total = ref(0)
  
  // Pagination cho attribute values
  const valuesPagingNext = ref(db.getCollection(VALUES_PAGING_KEY) || {}) // Map attributeId -> next URL
  const valuesTotal = ref(db.getCollection(VALUES_TOTAL_KEY) || {}) // Map attributeId -> total count

  const byId = computed(() => Object.fromEntries(attributes.value.map(a => [a.id, a])))
  const valuesByAttrId = computed(() => {
    const map = {}
    for (const v of values.value) {
      if (!map[v.attributeId]) map[v.attributeId] = []
      map[v.attributeId].push(v)
    }
    return map
  })

  // Helper function để lưu thông tin phân trang
  const savePagingInfo = () => {
    db.setCollection(VALUES_PAGING_KEY, valuesPagingNext.value)
    db.setCollection(VALUES_TOTAL_KEY, valuesTotal.value)
  }

  const createAttribute = async (payload) => {
    // Map frontend fields sang backend fields
    const backendPayload = {
      name: payload.name,
      code: payload.code,
      type: payload.type || 'select',
      is_filterable: payload.isVariantDefining ?? payload.is_active ?? false,
      is_active: payload.is_active ?? true,
      sort_order: payload.sortOrder ?? 0,
    }
    
    // Gọi API tạo thuộc tính
    const respone = await AttributesApi.createAttribute(backendPayload)
    if (respone?.error) return
    const data = respone?.data?.data ?? respone?.data ?? {}
    const entity = {
      id: data.id ?? uid(),
      name: data.name ?? payload.name,
      code: data.code ?? payload.code,
      type: (data.type ?? payload.type) || 'select',
      isVariantDefining: !!(data.is_filterable ?? data.is_variant_defining ?? payload.isVariantDefining ?? payload.is_active),
      isActive: data.is_active != null ? !!data.is_active : true,
      sortOrder: data.sort_order ?? 0,
    }
    attributes.value.push(entity)
    db.setCollection(ATTRIBUTES_KEY, attributes.value)
    return entity
  }

  const updateAttribute = async (id, patch) => {
    // Map frontend fields sang backend fields
    const backendPatch = {}
    if (patch.hasOwnProperty('is_active')) {
      backendPatch.is_active = patch.is_active
    }
    if (patch.hasOwnProperty('isVariantDefining')) {
      backendPatch.is_filterable = patch.isVariantDefining
    }
    if (patch.hasOwnProperty('name')) {
      backendPatch.name = patch.name
    }
    if (patch.hasOwnProperty('code')) {
      backendPatch.code = patch.code
    }
    if (patch.hasOwnProperty('type')) {
      backendPatch.type = patch.type
    }
    if (patch.hasOwnProperty('sortOrder')) {
      backendPatch.sort_order = patch.sort_order
    }
    
    const respone = await AttributesApi.updateAttribute(id, backendPatch)
    if (respone?.error) return
    const idx = attributes.value.findIndex(a => a.id === id)
    if (idx < 0) return
    
    // Map backend response về frontend
    const normalized = {}
    if (Object.prototype.hasOwnProperty.call(respone?.data?.data || {}, 'is_active')) {
      normalized.isActive = !!respone.data.data.is_active
    }
    if (Object.prototype.hasOwnProperty.call(respone?.data?.data || {}, 'is_filterable')) {
      normalized.isVariantDefining = !!respone.data.data.is_filterable
    }
    if (Object.prototype.hasOwnProperty.call(respone?.data?.data || {}, 'name')) {
      normalized.name = respone.data.data.name
    }
    if (Object.prototype.hasOwnProperty.call(respone?.data?.data || {}, 'code')) {
      normalized.code = respone.data.data.code
    }
    if (Object.prototype.hasOwnProperty.call(respone?.data?.data || {}, 'type')) {
      normalized.type = respone.data.data.type
    }
    if (Object.prototype.hasOwnProperty.call(respone?.data?.data || {}, 'sort_order')) {
      normalized.sortOrder = respone.data.data.sort_order
    }
    
    // Cập nhật local state
    attributes.value[idx] = { ...attributes.value[idx], ...normalized }
    db.setCollection(ATTRIBUTES_KEY, attributes.value)
    
    return respone
  }

  const removeAttribute = async (id) => {
    const respone = await AttributesApi.deleteAttribute(id)
    if (respone.error) return
    attributes.value = attributes.value.filter(a => a.id !== id)
    values.value = values.value.filter(v => v.attributeId !== id)
    db.setCollection(ATTRIBUTES_KEY, attributes.value)
    db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
  }

  const addValue = async (attributeId, value) => {
    try {
      // Gọi API để tạo attribute value
      const response = await AttributesValuesApi.createAttributeValues({
        attribute_id: attributeId,
        value: value.value,
        code: value.value?.toLowerCase()?.replace(/\s+/g, '_'),
        color_code: value.meta?.hex || null,
        image: value.meta?.image || null,
        sort_order: 0,
        is_active: true
      })
      
      if (response?.error) {
        console.error('Failed to create attribute value:', response.error)
        return null
      }
      
      const data = response?.data?.data ?? response?.data ?? {}
      const newValue = {
        id: data.id ?? uid(),
        attributeId: attributeId,
        value: value.value,
        meta: {
          hex: value.meta?.hex || null,
          code: data.code || null,
          image: data.image || null,
        },
        sortOrder: data.sort_order ?? 0,
        isActive: data.is_active != null ? !!data.is_active : true,
      }
      
      // Cập nhật local state
      values.value.push(newValue)
      db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
      
      return newValue
    } catch (error) {
      console.error('Error creating attribute value:', error)
      return null
    }
  }

  const updateValue = async (id, patch) => {
    try {
      // Gọi API để cập nhật attribute value
      const response = await AttributesValuesApi.updateAttributeValues(id, patch)
      
      if (response?.error) {
        console.error('Failed to update attribute value:', response.error)
        return false
      }
      
      // Cập nhật local state
      const idx = values.value.findIndex(v => v.id === id)
      if (idx < 0) return false
      
      // Map backend response về frontend
      const updatedValue = { ...values.value[idx] }
      
      if (patch.hasOwnProperty('value')) {
        updatedValue.value = patch.value
      }
      if (patch.hasOwnProperty('code')) {
        updatedValue.meta = { ...updatedValue.meta, code: patch.code }
      }
      if (patch.hasOwnProperty('color_code')) {
        updatedValue.meta = { ...updatedValue.meta, hex: patch.color_code }
      }
      if (patch.hasOwnProperty('image')) {
        updatedValue.meta = { ...updatedValue.meta, image: patch.image }
      }
      if (patch.hasOwnProperty('sort_order')) {
        updatedValue.sortOrder = patch.sort_order
      }
      if (patch.hasOwnProperty('is_active')) {
        updatedValue.isActive = patch.is_active
      }
      
      values.value[idx] = updatedValue
      db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
      
      return true
    } catch (error) {
      console.error('Error updating attribute value:', error)
      return false
    }
  }

  const toggleValue = async (id, isActive) => {
    try {
      // Gọi API để ẩn/hiện attribute value
      const response = await AttributesValuesApi.toggleAttributeValue(id, isActive)
      
      if (response?.error) {
        console.error('Failed to toggle attribute value:', response.error)
        return false
      }
      
      // Cập nhật local state
      const valueIndex = values.value.findIndex(v => v.id === id)
      if (valueIndex !== -1) {
        values.value[valueIndex] = { ...values.value[valueIndex], isActive }
        db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
      }
      
      return true
    } catch (error) {
      console.error('Error toggling attribute value:', error)
      return false
    }
  }

  const removeValue = async (id) => {
    try {
      // Gọi API để xóa attribute value
      const response = await AttributesValuesApi.deleteAttributeValues(id)
      
      if (response?.error) {
        console.error('Failed to delete attribute value:', response.error)
        return false
      }
      
      // Cập nhật local state
      values.value = values.value.filter(v => v.id !== id)
      db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
      
      return true
    } catch (error) {
      console.error('Error deleting attribute value:', error)
      return false
    }
  }

  const importDefaultsIfEmpty = () => {
    if (attributes.value.length) return
    // Seed mặc định: Color, Size, Material
    const color = createAttribute({ name: 'Color', code: 'color', type: 'color', isVariantDefining: true })
    const size = createAttribute({ name: 'Size', code: 'size', type: 'select', isVariantDefining: true })
    const material = createAttribute({ name: 'Material', code: 'material', type: 'select', isVariantDefining: false })

    ;['Black', 'White', 'Gray'].forEach(n => addValue(color.id, { value: n }))
    ;['S', 'M', 'L', 'XL'].forEach(n => addValue(size.id, { value: n }))
    ;['Cotton', 'Linen', 'Wool'].forEach(n => addValue(material.id, { value: n }))
  }

  const fetchFirstPage = async (params = {}) => {
    isLoading.value = true
    try {
      const attrRes = await AttributesApi.getAttributes(params).catch(() => null)
      const attrList = Array.isArray(attrRes?.data?.data) ? attrRes.data.data : []

      attributes.value = attrList.map(a => ({
        id: a.id,
        name: a.name,
        code: a.code,
        type: a.type || 'select',
        isVariantDefining: !!(a.is_filterable ?? a.is_variant_defining),
        isActive: !!(a.is_active ?? true),
        sortOrder: a.sort_order ?? 0,
      }))
      db.setCollection(ATTRIBUTES_KEY, attributes.value)
      const meta = attrRes?.data?.meta || {}
      const paging = meta?.paging || {}
      pagingNext.value = paging?.links?.next ?? null
      total.value = Number(paging?.total ?? attributes.value.length)

      // 2) Với mỗi attribute, gọi API chi tiết để lấy values theo ID
      const detailPromises = attributes.value.map(a => AttributesValuesApi.getAttributeValuesByAttributeId(a.id).catch(() => null))
      const detailResults = await Promise.all(detailPromises)

      const collected = []
      for (let idx = 0; idx < attributes.value.length; idx++) {
        const a = attributes.value[idx]
        const res = detailResults[idx]
        const dataNode = res?.data?.data
        const meta = res?.data?.meta || {}
        const paging = meta?.paging || {}
        
        // Lưu thông tin phân trang cho attribute này
        valuesPagingNext.value[a.id] = paging?.links?.next ?? null
        valuesTotal.value[a.id] = Number(paging?.total ?? 0)
        
        // API trả về dạng: { data: [ { id, attribute_id, value, color_code, ... } ] }
        const rawValues = Array.isArray(dataNode) ? dataNode : []

        for (const v of rawValues) {
          if (!v?.value) continue
          collected.push({
            id: v.id ?? `${a.id}:${v.value}`,
            attributeId: a.id,
            value: v.value,
            meta: {
              hex: v.color_code || null,
              code: v.code || null,
              image: v.image || null,
            },
            sortOrder: v.sort_order ?? 0,
            isActive: v.is_active != null ? !!v.is_active : true,
          })
        }
      }
      values.value = collected
      db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
      
      // Lưu thông tin phân trang
      savePagingInfo()
    } finally {
      isLoading.value = false
      hasLoaded.value = true
    }
  }

  const fetchNextPage = async () => {
    if (!pagingNext.value) return
    isLoading.value = true
    try {
      const res = await AttributesApi.getByUrl(pagingNext.value).catch(() => null)
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      const nextAttrs = list.map(a => ({
        id: a.id,
        name: a.name,
        code: a.code,
        type: a.type || 'select',
        isVariantDefining: !!(a.is_filterable ?? a.is_variant_defining),
        isActive: !!(a.is_active ?? true),
        sortOrder: a.sort_order ?? 0,
      }))
      attributes.value = attributes.value.concat(nextAttrs)
      db.setCollection(ATTRIBUTES_KEY, attributes.value)

      const meta = res?.data?.meta || {}
      const paging = meta?.paging || {}
      pagingNext.value = paging?.links?.next ?? null
      total.value = Number(paging?.total ?? total.value)

      // fetch values cho trang mới
      const detailPromises = nextAttrs.map(a => AttributesValuesApi.getAttributeValuesByAttributeId(a.id).catch(() => null))
      const detailResults = await Promise.all(detailPromises)
      const collected = [...values.value]
      for (let idx = 0; idx < nextAttrs.length; idx++) {
        const a = nextAttrs[idx]
        const res = detailResults[idx]
        const dataNode = res?.data?.data
        const meta = res?.data?.meta || {}
        const paging = meta?.paging || {}
        
        // Lưu thông tin phân trang cho attribute này
        valuesPagingNext.value[a.id] = paging?.links?.next ?? null
        valuesTotal.value[a.id] = Number(paging?.total ?? 0)
        
        const rawValues = Array.isArray(dataNode) ? dataNode : []
        
        for (const v of rawValues) {
          if (!v?.value) continue
                      collected.push({
              id: v.id ?? `${a.id}:${v.value}`,
              attributeId: a.id,
              value: v.value,
              meta: { 
                hex: v.color_code || null, 
                code: v.code || null, 
                image: v.image || null 
              },
              sortOrder: v.sort_order ?? 0,
              isActive: v.is_active != null ? !!v.is_active : true,
            })
        }
      }
      values.value = collected
      db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
      
      // Lưu thông tin phân trang
      savePagingInfo()
    } finally {
      isLoading.value = false
    }
  }

  // Fetch thêm values cho một attribute cụ thể
  const fetchMoreValues = async (attributeId) => {
    const nextUrl = valuesPagingNext.value[attributeId]
    if (!nextUrl) return
    
    try {
      const res = await AttributesValuesApi.getByUrl(nextUrl).catch(() => null)
      const dataNode = res?.data?.data
      const meta = res?.data?.meta || {}
      const paging = meta?.paging || {}
      
      // Cập nhật thông tin phân trang
      valuesPagingNext.value[attributeId] = paging?.links?.next ?? null
      
      // Thêm values mới vào danh sách hiện tại
      const rawValues = Array.isArray(dataNode) ? dataNode : []
      const newValues = rawValues.map(v => ({
        id: v.id ?? `${attributeId}:${v.value}`,
        attributeId: attributeId,
        value: v.value,
        meta: {
          hex: v.color_code || null,
          code: v.code || null,
          image: v.image || null,
        },
        sortOrder: v.sort_order ?? 0,
        isActive: v.is_active != null ? !!v.is_active : true,
      }))
      
      values.value = values.value.concat(newValues)
      db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
      
      // Lưu thông tin phân trang
      savePagingInfo()
      
      return newValues
    } catch (error) {
      console.error('Error fetching more values:', error)
      return null
    }
  }

  const ensureInitialized = async () => {
    if (hasLoaded.value) return
    if (attributes.value?.length > 0 && values.value?.length > 0) {
      hasLoaded.value = true
      return
    }
    await fetchFirstPage()
  }

  // Clear pagination info khi cần reset
  const clearPagingInfo = () => {
    valuesPagingNext.value = {}
    valuesTotal.value = {}
    savePagingInfo()
  }

  const disableAttribute = async (id, isActive) => {
    await updateAttribute(id, { is_active: isActive })
  }

  return {
    attributes,
    values,
    isLoading,
    total,
    hasMore: computed(() => !!pagingNext.value),
    byId,
    valuesByAttrId,
    valuesPagingNext,
    valuesTotal,
    fetchFirstPage,
    fetchNextPage,
    fetchMoreValues,
    ensureInitialized,
    clearPagingInfo,
    createAttribute,
    updateAttribute,
    removeAttribute,
    addValue,
    updateValue,
    toggleValue,
    removeValue,
    importDefaultsIfEmpty,
    disableAttribute,
  }
})


