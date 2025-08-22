import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '@/admin/stores/inventory.store'

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
    adjustModalRef.value?.showModal()
  }

  const closeAdjustModal = () => {
    adjustModalRef.value?.close()
    selectedItem.value = null
    adjustQuantity.value = 0
  }

  const saveAdjustment = () => {
    if (selectedItem.value && adjustQuantity.value >= 0) {
      const difference = adjustQuantity.value - selectedItem.value.quantity
      adjust(selectedItem.value.productVariantId, difference)
      closeAdjustModal()
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
