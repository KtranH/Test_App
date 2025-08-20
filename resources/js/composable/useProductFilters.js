import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'

export function useProductFilters() {
  const productStore = useProductStore()
  
  // Filter state
  const selectedCategory = ref('')
  const selectedPriceRange = ref('')
  const selectedStatus = ref('')
  
  // Filter options
  const categories = [
    { value: '', label: 'Tất cả' },
    { value: 'ao-thun', label: 'Áo thun' },
    { value: 'quan-jean', label: 'Quần jean' }
  ]
  
  const priceRanges = [
    { value: '', label: 'Tất cả' },
    { value: '0-300000', label: 'Dưới 300k' },
    { value: '300000-500000', label: '300k - 500k' },
    { value: '500000+', label: 'Trên 500k' }
  ]
  
  const statuses = [
    { value: '', label: 'Tất cả' },
    { value: 'active', label: 'Đang bán' },
    { value: 'inactive', label: 'Ngừng bán' }
  ]
  
  // Computed filtered products
  const filteredProducts = computed(() => {
    let products = productStore.activeProducts
    
    // Filter by category
    if (selectedCategory.value) {
      products = products.filter(product => product.category === selectedCategory.value)
    }
    
    // Filter by price range
    if (selectedPriceRange.value) {
      products = products.filter(product => {
        const price = product.base_price
        switch (selectedPriceRange.value) {
          case '0-300000':
            return price <= 300000
          case '300000-500000':
            return price > 300000 && price <= 500000
          case '500000+':
            return price > 500000
          default:
            return true
        }
      })
    }
    
    // Filter by status
    if (selectedStatus.value) {
      products = products.filter(product => {
        const hasActiveVariants = product.variants.some(variant => variant.is_active)
        return selectedStatus.value === 'active' ? hasActiveVariants : !hasActiveVariants
      })
    }
    
    return products
  })
  
  // Methods
  const applyFilters = () => {
    // Logic để áp dụng filter có thể được mở rộng ở đây
    console.log('Applying filters:', {
      category: selectedCategory.value,
      priceRange: selectedPriceRange.value,
      status: selectedStatus.value
    })
  }
  
  const clearFilters = () => {
    selectedCategory.value = ''
    selectedPriceRange.value = ''
    selectedStatus.value = ''
  }
  
  const resetFilters = () => {
    clearFilters()
  }
  
  return {
    // State
    selectedCategory,
    selectedPriceRange,
    selectedStatus,
    
    // Options
    categories,
    priceRanges,
    statuses,
    
    // Computed
    filteredProducts,
    
    // Methods
    applyFilters,
    clearFilters,
    resetFilters
  }
}
