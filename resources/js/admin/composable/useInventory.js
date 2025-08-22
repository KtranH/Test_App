import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '@/admin/stores/inventory.store'
import { message } from 'ant-design-vue'
import { InventoryApi } from '@/admin/api/inventory'
import { MailQuestionMarkIcon } from 'lucide-vue-next'

export function useInventory() {
  const store = useInventoryStore()
  const { items, isLoading } = storeToRefs(store)
  const { adjust, ensureInitialized } = store

  // Reactive data
  const searchTerm = ref('')
  const stockFilter = ref('')
  const adjustModalRef = ref(null)
  const selectedItem = ref(null)
  const adjustQuantity = ref(0)
  const adjustSafetyStock = ref(0)

  const isValidAdjustment = computed(() => {
    const hasItem = selectedItem.value != null
    const qtyRaw = adjustQuantity.value
    const safetyRaw = adjustSafetyStock.value
    if (qtyRaw === null || qtyRaw === '' || safetyRaw === null || safetyRaw === '') return false
    const qty = Number(qtyRaw)
    const safety = Number(safetyRaw)
    const qtyValid = !Number.isNaN(qty) && qty >= 0
    const safetyValid = !Number.isNaN(safety) && safety >= 0
    return hasItem && qtyValid && safetyValid
  })

  // Computed properties
  const totalQuantity = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const filteredItems = computed(() => {
    let filtered = items.value

    if (searchTerm.value) {
      filtered = filtered.filter(item =>
        item.variant?.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        item.productVariantId.toString().includes(searchTerm.value)
      )
    }

    if (stockFilter.value === 'low') {
      filtered = filtered.filter(item => item.isLowStock)
    } else if (stockFilter.value === 'normal') {
      filtered = filtered.filter(item => !item.isLowStock)
    }

    return filtered
  })

  // Methods
  const refreshData = async () => {
    await ensureInitialized()
  }

  const openAdjustModal = (item) => {
    selectedItem.value = item
    adjustQuantity.value = item.quantity
    adjustSafetyStock.value = item.safetyStock ?? 0
    adjustModalRef.value?.showModal()
  }

  const closeAdjustModal = () => {
    adjustModalRef.value?.close()
    selectedItem.value = null
    adjustQuantity.value = 0
    adjustSafetyStock.value = 0
  }

  const saveAdjustment = async () => {
    try {
      if (!selectedItem.value) return
      // Gọi API để cập nhật số lượng
      const respone = await InventoryApi.updateInventory(selectedItem.value.id, {
        quantity: adjustQuantity.value,
        low_stock_threshold: adjustSafetyStock.value
      })
      if (respone?.error) {
        message.error(respone.error.message)
        return
      }
      const nextQty = Math.max(0, Number(adjustQuantity.value) || 0)
      const nextSafety = Math.max(0, Number(adjustSafetyStock.value) || 0)
      // Ghi trực tiếp số lượng và ngưỡng an toàn để đồng bộ isLowStock
      store.setQty(selectedItem.value.productVariantId, nextQty, nextSafety)
      closeAdjustModal()
      message.success('Cập nhật số lượng thành công')
    }
    catch (e) {
      console.error(e)
      message.error('Cập nhật số lượng thất bại')
    }
  }

  const refresh = () => {
    store.fetchFirstPage()
  }

  return {
    // Store
    store,
    items,
    isLoading,

    // Reactive data
    searchTerm,
    stockFilter,
    adjustModalRef,
    selectedItem,
    adjustQuantity,
    adjustSafetyStock,
    isValidAdjustment,

    // Computed
    totalQuantity,
    filteredItems,

    // Methods
    refreshData,
    openAdjustModal,
    closeAdjustModal,
    saveAdjustment,
    refresh,
    adjust,
    ensureInitialized
  }
}
