import { ref, computed } from 'vue'
import { useProductStore } from '@/admin/stores/product.store'
import { useCategoryStore } from '@/admin/stores/category.store'
import { ProductsApi } from '@/admin/api/products'
import { ProductVariantsApi } from '@/admin/api/product_variants'
import { message } from 'ant-design-vue'

export function useProducts() {
  const productStore = useProductStore()
  const categoryStore = useCategoryStore()

  // Reactive data
  const q = ref('')
  const status = ref('')
  const categoryId = ref('')
  const expandedId = ref(null)
  const rowLoading = ref({})

  // Computed properties
  const products = computed(() => productStore.products)
  const isLoading = computed(() => productStore.isLoading || categoryStore.isLoading)
  const categories = computed(() => categoryStore.categories)

  const filtered = computed(() => {
    return products.value.filter(p => {
      const okName = q.value ? p.name.toLowerCase().includes(q.value.toLowerCase()) : true
      const okStatus = status.value ? p.status === status.value : true
      const okCat = categoryId.value ? p.categoryId === categoryId.value : true
      return okName && okStatus && okCat
    })
  })

  const categoryName = (id) => categoryStore.categories.find(c => c.id === id)?.name || '-'

  // Methods
  const remove = (id) => productStore.removeProduct(id)

  const toggleExpand = async (product) => {
    if (expandedId.value === product.id) {
      expandedId.value = null
      return
    }
    expandedId.value = product.id
    // nếu sản phẩm chưa có mảng variants từ API, thử fetch chi tiết
    if (!Array.isArray(product.variants) || product.variants.length === 0) {
      rowLoading.value[product.id] = true
      try {
        const res = await ProductsApi.getProductById(product.id)
        const p = res?.data?.data
        if (p && Array.isArray(p.variants)) {
          // cập nhật trực tiếp object trong danh sách phản ứng
          product.variants = p.variants.map(v => ({
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
          }))
        }
      } finally {
        rowLoading.value[product.id] = false
      }
    }
  }

  const formatPrice = (n) => {
    const num = Number(n ?? 0)
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num)
  }

  const refresh = () => {
    productStore.fetchFirstPage()
  }

  const editVariant = async (product, variant) => {
    const variantId = variant?.id ?? variant
    let raw
    try {
      const resp = await ProductVariantsApi.getProductVariantById(variantId)
      raw = Array.isArray(resp?.data?.data) ? resp.data.data?.[0] : resp?.data?.data
      if (!raw) return
    } catch (err) {
      console.error('Failed to fetch variant', err)
      return
    }

    const mapped = {
      id: raw.id,
      productId: raw.product_id ?? product.id,
      sku: raw.sku || '',
      name: raw.name || '',
      price: raw.price != null ? Number(raw.price) : null,
      salePrice: raw.sale_price != null ? Number(raw.sale_price) : null,
      weight: raw.weight != null ? Number(raw.weight) : null,
      width: raw.width != null ? Number(raw.width) : null,
      height: raw.height != null ? Number(raw.height) : null,
      length: raw.length != null ? Number(raw.length) : null,
      isActive: !!raw.is_active,
      attributeCombination: raw.attribute_combination ?? {},
    }

    const inv = raw.inventory ?? {}
    const inventory = {
      quantity: Number(inv.quantity ?? 0),
      reserved_quantity: Number(inv.reserved_quantity ?? 0),
      available_quantity: Number(inv.available_quantity ?? Math.max(0, Number(inv.quantity ?? 0) - Number(inv.reserved_quantity ?? 0))),
      low_stock_threshold: Number(inv.low_stock_threshold ?? 0),
      is_in_stock: inv.is_in_stock ?? true,
      is_backorder_allowed: !!(inv.is_backorder_allowed ?? false),
      id: inv.id ?? null,
    }

    return { mapped, inventory }
  }

  const removeVariant = async (product, variant) => {
    try {
      await ProductVariantsApi.deleteProductVariant(variant.id)
      product.variants = product.variants.filter(v => v.id !== variant.id)
      message.success('Đã xóa biến thể')
    } catch (e) {
      console.error(e)
      message.error('Xóa biến thể thất bại')
    }
  }

  const ensureInitialized = async () => {
    await Promise.all([
      categoryStore.ensureInitialized(),
      productStore.ensureInitialized(),
    ])
  }

  return {
    // Store
    productStore,
    categoryStore,
    
    // Reactive data
    q,
    status,
    categoryId,
    expandedId,
    rowLoading,
    
    // Computed
    products,
    isLoading,
    categories,
    filtered,
    
    // Methods
    categoryName,
    remove,
    toggleExpand,
    formatPrice,
    refresh,
    editVariant,
    removeVariant,
    ensureInitialized
  }
}
