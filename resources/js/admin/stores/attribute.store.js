import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db, uid } from '@/admin/services/db'
import { AttributesApi } from '@/admin/api/attributes'

const ATTRIBUTES_KEY = 'attributes'
const ATTRIBUTE_VALUES_KEY = 'attributeValues'

export const useAttributeStore = defineStore('admin.attributes', () => {
  const attributes = ref(db.getCollection(ATTRIBUTES_KEY))
  const values = ref(db.getCollection(ATTRIBUTE_VALUES_KEY)) // flat list
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const pagingNext = ref(null)
  const total = ref(0)

  const byId = computed(() => Object.fromEntries(attributes.value.map(a => [a.id, a])))
  const valuesByAttrId = computed(() => {
    const map = {}
    for (const v of values.value) {
      if (!map[v.attributeId]) map[v.attributeId] = []
      map[v.attributeId].push(v)
    }
    return map
  })

  const createAttribute = (payload) => {
    const entity = { id: uid(), name: payload.name, code: payload.code, type: payload.type || 'select', isVariantDefining: !!payload.isVariantDefining }
    attributes.value.push(entity)
    db.setCollection(ATTRIBUTES_KEY, attributes.value)
    return entity
  }

  const updateAttribute = (id, patch) => {
    const idx = attributes.value.findIndex(a => a.id === id)
    if (idx < 0) return
    attributes.value[idx] = { ...attributes.value[idx], ...patch }
    db.setCollection(ATTRIBUTES_KEY, attributes.value)
  }

  const removeAttribute = (id) => {
    attributes.value = attributes.value.filter(a => a.id !== id)
    values.value = values.value.filter(v => v.attributeId !== id)
    db.setCollection(ATTRIBUTES_KEY, attributes.value)
    db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
  }

  const addValue = (attributeId, value) => {
    const v = { id: uid(), attributeId, value: value.value, meta: value.meta || {} }
    values.value.push(v)
    db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
    return v
  }

  const updateValue = (id, patch) => {
    const idx = values.value.findIndex(v => v.id === id)
    if (idx < 0) return
    values.value[idx] = { ...values.value[idx], ...patch }
    db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
  }

  const removeValue = (id) => {
    values.value = values.value.filter(v => v.id !== id)
    db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
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
      const detailPromises = attributes.value.map(a => AttributesApi.getAttributesValues(a.id).catch(() => null))
      const detailResults = await Promise.all(detailPromises)

      const collected = []
      for (let idx = 0; idx < attributes.value.length; idx++) {
        const a = attributes.value[idx]
        const res = detailResults[idx]
        const dataNode = res?.data?.data
        // API hiện tại trả về dạng: { data: [ { id, name, values: [...] } ] }
        // Nên cần lấy phần tử trong mảng (ưu tiên phần tử khớp id)
        const attrNode = Array.isArray(dataNode)
          ? (dataNode.find(n => n?.id === a.id) ?? dataNode[0])
          : dataNode
        const rawValues = Array.isArray(attrNode?.values) ? attrNode.values : []

        for (const v of rawValues) {
          const valueText = typeof v === 'string' ? v : (v?.value ?? '')
          if (!valueText) continue
          collected.push({
            id: v?.id ?? `${a.id}:${valueText}`,
            attributeId: a.id,
            value: valueText,
            meta: {
              hex: v?.color_code || null,
              code: v?.code || null,
              image: v?.image || null,
            },
            sortOrder: v?.sort_order ?? 0,
            isActive: v?.is_active != null ? !!v.is_active : true,
          })
        }
      }
      values.value = collected
      db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
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
      const detailPromises = nextAttrs.map(a => AttributesApi.getAttributesValues(a.id).catch(() => null))
      const detailResults = await Promise.all(detailPromises)
      const collected = [...values.value]
      for (let idx = 0; idx < nextAttrs.length; idx++) {
        const a = nextAttrs[idx]
        const res = detailResults[idx]
        const dataNode = res?.data?.data
        const attrNode = Array.isArray(dataNode)
          ? (dataNode.find(n => n?.id === a.id) ?? dataNode[0])
          : dataNode
        const rawValues = Array.isArray(attrNode?.values) ? attrNode.values : []
        for (const v of rawValues) {
          const valueText = typeof v === 'string' ? v : (v?.value ?? '')
          if (!valueText) continue
          collected.push({
            id: v?.id ?? `${a.id}:${valueText}`,
            attributeId: a.id,
            value: valueText,
            meta: { hex: v?.color_code || null, code: v?.code || null, image: v?.image || null },
            sortOrder: v?.sort_order ?? 0,
            isActive: v?.is_active != null ? !!v.is_active : true,
          })
        }
      }
      values.value = collected
      db.setCollection(ATTRIBUTE_VALUES_KEY, values.value)
    } finally {
      isLoading.value = false
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

  return {
    attributes,
    values,
    isLoading,
    total,
    hasMore: computed(() => !!pagingNext.value),
    byId,
    valuesByAttrId,
    fetchFirstPage,
    fetchNextPage,
    ensureInitialized,
    createAttribute,
    updateAttribute,
    removeAttribute,
    addValue,
    updateValue,
    removeValue,
    importDefaultsIfEmpty,
  }
})


