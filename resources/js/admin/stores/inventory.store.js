import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db, uid } from '@/admin/services/db'
import { InventoryApi } from '@/admin/api/inventory'

const INVENTORY_KEY = 'inventory'

// Helper function to calculate if stock is low
// Logic: Stock is considered low when quantity <= safetyStock
// Special case: If safetyStock is 0 or negative, stock is never considered low
const calculateIsLowStock = (quantity, safetyStock) => {
  if (safetyStock <= 0) return false
  return quantity <= safetyStock
}

export const useInventoryStore = defineStore('admin.inventory', () => {
  const items = ref(db.getCollection(INVENTORY_KEY))
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const pagingNext = ref(null)
  const total = ref(0)

  const setQty = (productVariantId, quantity, safetyStock = 0) => {
    const idx = items.value.findIndex(i => i.productVariantId === productVariantId)
    const entity = {
      id: idx >= 0 ? items.value[idx].id : uid(),
      productVariantId,
      quantity,
      safetyStock,
      isLowStock: calculateIsLowStock(quantity, safetyStock)
    }
    if (idx >= 0) items.value[idx] = entity
    else items.value.push(entity)
    db.setCollection(INVENTORY_KEY, items.value)
  }

  const adjust = (productVariantId, delta) => {
    const idx = items.value.findIndex(i => i.productVariantId === productVariantId)
    if (idx < 0) return
    const nextQty = Math.max(0, items.value[idx].quantity + delta)
    const currentItem = items.value[idx]
    items.value[idx] = { 
      ...currentItem, 
      quantity: nextQty, 
      isLowStock: calculateIsLowStock(nextQty, currentItem.safetyStock) 
    }
    db.setCollection(INVENTORY_KEY, items.value)
  }

  const mapInventory = (r) => {
    const quantity = Number(r.quantity ?? 0)
    const reserved = Number(r.reserved_quantity ?? 0)
    const available = Number(r.available_quantity ?? Math.max(0, quantity - reserved))
    const threshold = Number(r.low_stock_threshold ?? 0)
    return {
      id: r.id,
      productVariantId: r.product_variant_id,
      variant: r.variant,
      quantity,
      reservedQuantity: reserved,
      availableQuantity: available,
      safetyStock: threshold,
      isLowStock: calculateIsLowStock(quantity, threshold),
      isInStock: !!r.is_in_stock,
      isBackorderAllowed: !!r.is_backorder_allowed,
      lastRestockedAt: r.last_restocked_at || null,
    }
  }

  const fetchFirstPage = async (params = {}) => {
    isLoading.value = true
    try {
      const res = await InventoryApi.getInventory(params)
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      items.value = list.map(mapInventory)
      const meta = res?.data?.meta || {}
      const paging = meta?.paging || {}
      pagingNext.value = paging?.links?.next ?? null
      total.value = Number(paging?.total ?? items.value.length)
      db.setCollection(INVENTORY_KEY, items.value)
    } finally {
      isLoading.value = false
      hasLoaded.value = true
    }
  }

  const fetchNextPage = async () => {
    if (!pagingNext.value) return
    isLoading.value = true
    try {
      const res = await InventoryApi.getByUrl(pagingNext.value)
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      items.value = items.value.concat(list.map(mapInventory))
      const meta = res?.data?.meta || {}
      const paging = meta?.paging || {}
      pagingNext.value = paging?.links?.next ?? null
      total.value = Number(paging?.total ?? total.value)
      db.setCollection(INVENTORY_KEY, items.value)
    } finally {
      isLoading.value = false
    }
  }

  const ensureInitialized = async () => {
    if (hasLoaded.value) return
    if (items.value?.length > 0) {
      hasLoaded.value = true
      return
    }
    await fetchFirstPage()
  }

  // Update stock status for all items
  const updateStockStatus = () => {
    items.value.forEach(item => {
      item.isLowStock = calculateIsLowStock(item.quantity, item.safetyStock)
    })
    db.setCollection(INVENTORY_KEY, items.value)
  }

  // Test method to verify low stock logic
  const testLowStockLogic = () => {
    const testCases = [
      { quantity: 0, safetyStock: 10, expected: true },
      { quantity: 5, safetyStock: 10, expected: true },
      { quantity: 10, safetyStock: 10, expected: true },
      { quantity: 11, safetyStock: 10, expected: false },
      { quantity: 20, safetyStock: 10, expected: false },
      { quantity: 5, safetyStock: 0, expected: false },
      { quantity: 0, safetyStock: 0, expected: false }
    ]
    
    const results = testCases.map(test => ({
      ...test,
      actual: calculateIsLowStock(test.quantity, test.safetyStock),
      passed: calculateIsLowStock(test.quantity, test.safetyStock) === test.expected
    }))
    
    console.log('Low Stock Logic Test Results:', results)
    return results
  }

  // Computed properties for inventory status
  const lowStockItems = computed(() => 
    items.value.filter(item => item.isLowStock)
  )
  
  const criticalStockItems = computed(() => 
    items.value.filter(item => item.quantity === 0 && item.safetyStock > 0)
  )
  
  const stableStockItems = computed(() => 
    items.value.filter(item => !item.isLowStock)
  )

  return { 
    items, 
    isLoading, 
    total, 
    hasMore: computed(() => !!pagingNext.value), 
    lowStockItems,
    criticalStockItems,
    stableStockItems,
    setQty, 
    adjust, 
    fetchFirstPage, 
    fetchNextPage, 
    ensureInitialized,
    updateStockStatus,
    testLowStockLogic
  }
})



