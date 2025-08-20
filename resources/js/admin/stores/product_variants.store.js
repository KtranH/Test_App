import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/admin/services/db'
import { ProductVariantsApi } from '@/admin/api/product_variants'

const PRODUCT_VARIANTS_KEY = 'productVariants'

export const useProductVariantsStore = defineStore('admin.productVariants', () => {
  const variants = ref(db.getCollection(PRODUCT_VARIANTS_KEY))
  const isLoading = ref(false)
  const hasLoaded = ref(false)

  const byId = computed(() => Object.fromEntries(variants.value.map(v => [v.id, v])))
  const byProductId = computed(() => {
    const map = {}
    for (const v of variants.value) {
      if (!map[v.productId]) map[v.productId] = []
      map[v.productId].push(v)
    }
    return map
  })

  const fetchAll = async () => {
    isLoading.value = true
    try {
      const res = await ProductVariantsApi.getProductVariants()
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      variants.value = list.map(r => ({
        id: r.id,
        productId: r.product_id,
        product: r.product ? { id: r.product.id, name: r.product.name, slug: r.product.slug } : null,
        sku: r.sku || '',
        name: r.name || '',
        price: Number(r.price ?? 0),
        salePrice: r.sale_price != null ? Number(r.sale_price) : null,
        weight: r.weight != null ? Number(r.weight) : null,
        width: r.width != null ? Number(r.width) : null,
        height: r.height != null ? Number(r.height) : null,
        length: r.length != null ? Number(r.length) : null,
        isActive: !!r.is_active,
        attributeCombination: r.attribute_combination ?? {},
        inventory: r.inventory ?? null,
      }))
      db.setCollection(PRODUCT_VARIANTS_KEY, variants.value)
    } finally {
      isLoading.value = false
      hasLoaded.value = true
    }
  }

  const ensureInitialized = async () => {
    if (hasLoaded.value) return
    if (variants.value?.length > 0) {
      hasLoaded.value = true
      return
    }
    await fetchAll()
  }

  return {
    variants,
    isLoading,
    byId,
    byProductId,
    fetchAll,
    ensureInitialized,
  }
})


