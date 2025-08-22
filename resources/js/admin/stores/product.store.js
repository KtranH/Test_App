import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db, uid } from '@/admin/services/db'
import { ProductsApi } from '@/admin/api/products'

const PRODUCTS_KEY = 'products'
const VARIANTS_KEY = 'variants'

export const useProductStore = defineStore('admin.products', () => {
  const products = ref(db.getCollection(PRODUCTS_KEY))
  const variants = ref(db.getCollection(VARIANTS_KEY))
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const pagingNext = ref(null)
  const total = ref(0)

  const byId = computed(() => Object.fromEntries(products.value.map(p => [p.id, p])))
  const variantsByProductId = computed(() => {
    const map = {}
    for (const v of variants.value) {
      if (!map[v.productId]) map[v.productId] = []
      map[v.productId].push(v)
    }
    return map
  })

  const createProduct = (payload) => {
    const entity = {
      id: uid(),
      name: payload.name,
      slug: payload.slug,
      categoryId: payload.categoryId || null,
      description: payload.description || '',
      status: payload.status || 'draft',
      basePrice: payload.basePrice || 0,
      attributesSelected: payload.attributesSelected || {},
      imageIds: [],
    }
    products.value.push(entity)
    db.setCollection(PRODUCTS_KEY, products.value)
    return entity
  }

  const mapProduct = (p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        categoryId: p.category_id ?? null,
        description: p.description ?? '',
        status: p.is_active ? 'active' : 'archived',
        basePrice: Number(p.base_price ?? 0),
        salePrice: p.sale_price != null ? Number(p.sale_price) : null,
        saleStartDate: p.sale_start_date ?? null,
        saleEndDate: p.sale_end_date ?? null,
        isFeatured: !!p.is_featured,
        meta: p.meta_data ?? null,
        images: Array.isArray(p.images) ? p.images : [],
        sortOrder: p.sort_order ?? 0,
        variants: Array.isArray(p.variants) ? p.variants.map(v => ({
          id: v.id,
          productId: v.product_id,
          sku: v.sku || '',
          name: v.name || '',
          price: v.price != null ? Number(v.price) : null,
          salePrice: v.sale_price != null ? Number(v.sale_price) : null,
          weight: v.weight != null ? Number(v.weight) : null,
          width: v.width != null ? Number(v.width) : null,
          height: v.height != null ? Number(v.height) : null,
          length: v.length != null ? Number(v.length) : null,
          isActive: !!v.is_active,
          attributeCombination: v.attribute_combination ?? {},
          deletedAt: v.deleted_at ?? null,
        })) : [],
      })

  const fetchFirstPage = async (params = {}) => {
    isLoading.value = true
    try {
      const res = await ProductsApi.getProducts(params)
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      products.value = list.map(mapProduct)
      const meta = res?.data?.meta || {}
      const paging = meta?.paging || {}
      pagingNext.value = paging?.links?.next ?? null
      total.value = Number(paging?.total ?? products.value.length)
      db.setCollection(PRODUCTS_KEY, products.value)
    } finally {
      isLoading.value = false
      hasLoaded.value = true
    }
  }

  const fetchNextPage = async () => {
    if (!pagingNext.value) return
    isLoading.value = true
    try {
      const res = await ProductsApi.getByUrl(pagingNext.value)
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      products.value = products.value.concat(list.map(mapProduct))
      const meta = res?.data?.meta || {}
      const paging = meta?.paging || {}
      pagingNext.value = paging?.links?.next ?? null
      total.value = Number(paging?.total ?? total.value)
      db.setCollection(PRODUCTS_KEY, products.value)
    } finally {
      isLoading.value = false
    }
  }

  const ensureInitialized = async () => {
    if (hasLoaded.value) return
    if (products.value?.length > 0) {
      hasLoaded.value = true
      return
    }
    await fetchFirstPage()
  }

  const updateProduct = (id, patch) => {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx < 0) return
    products.value[idx] = { ...products.value[idx], ...patch }
    db.setCollection(PRODUCTS_KEY, products.value)
  }

  const removeProduct = (id) => {
    products.value = products.value.filter(p => p.id !== id)
    variants.value = variants.value.filter(v => v.productId !== id)
    db.setCollection(PRODUCTS_KEY, products.value)
    db.setCollection(VARIANTS_KEY, variants.value)
  }

  const upsertVariant = (variant) => {
    const entity = { id: variant.id || uid(), ...variant }
    const idx = variants.value.findIndex(v => v.id === entity.id)
    if (idx >= 0) variants.value[idx] = { ...variants.value[idx], ...entity }
    else variants.value.push(entity)
    db.setCollection(VARIANTS_KEY, variants.value)
    return entity
  }

  const removeVariant = (id) => {
    variants.value = variants.value.filter(v => v.id !== id)
    db.setCollection(VARIANTS_KEY, variants.value)
  }

  return {
    products,
    variants,
    isLoading,
    total,
    hasMore: computed(() => !!pagingNext.value),
    byId,
    variantsByProductId,
    fetchFirstPage,
    fetchNextPage,
    ensureInitialized,
    createProduct,
    updateProduct,
    removeProduct,
    upsertVariant,
    removeVariant,
  }
})


