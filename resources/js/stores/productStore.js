import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref([
    {
      id: 1,
      name: 'Áo thun nam basic',
      description: 'Áo thun nam chất liệu cotton 100%, thoáng mát, dễ mặc',
      base_price: 299000,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      category: 'Áo thun',
      is_active: true,
      variants: [
        { id: 1, size: 'S', color: 'Đen', material: 'Cotton', price_adjustment: 0, stock: 50, sku: 'ATB-S-D-001' },
        { id: 2, size: 'M', color: 'Đen', material: 'Cotton', price_adjustment: 0, stock: 75, sku: 'ATB-M-D-002' },
        { id: 3, size: 'L', color: 'Đen', material: 'Cotton', price_adjustment: 0, stock: 60, sku: 'ATB-L-D-003' },
        { id: 4, size: 'S', color: 'Trắng', material: 'Cotton', price_adjustment: 0, stock: 45, sku: 'ATB-S-T-004' },
        { id: 5, size: 'M', color: 'Trắng', material: 'Cotton', price_adjustment: 0, stock: 65, sku: 'ATB-M-T-005' },
      ]
    },
    {
      id: 2,
      name: 'Quần jean nam slim fit',
      description: 'Quần jean nam kiểu dáng slim fit, chất liệu denim cao cấp',
      base_price: 899000,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      category: 'Quần jean',
      is_active: true,
      variants: [
        { id: 6, size: '30', color: 'Xanh đậm', material: 'Denim', price_adjustment: 0, stock: 30, sku: 'QJN-30-XD-001' },
        { id: 7, size: '32', color: 'Xanh đậm', material: 'Denim', price_adjustment: 0, stock: 40, sku: 'QJN-32-XD-002' },
        { id: 8, size: '34', color: 'Xanh đậm', material: 'Denim', price_adjustment: 0, stock: 35, sku: 'QJN-34-XD-003' },
        { id: 9, size: '30', color: 'Đen', material: 'Denim', price_adjustment: 50000, stock: 25, sku: 'QJN-30-D-004' },
        { id: 10, size: '32', color: 'Đen', material: 'Denim', price_adjustment: 50000, stock: 30, sku: 'QJN-32-D-005' },
      ]
    }
  ])

  const selectedProduct = ref(null)
  const isLoading = ref(false)

  // Getters
  const activeProducts = computed(() => products.value.filter(product => product.is_active))
  
  const getProductById = (id) => {
    return products.value.find(product => product.id === id)
  }

  const getProductVariants = (productId) => {
    const product = getProductById(productId)
    return product ? product.variants : []
  }

  // Actions
  const setSelectedProduct = (product) => {
    isLoading.value = true
    setTimeout(() => {
      selectedProduct.value = product
      isLoading.value = false
    }, 300)
  }

  const clearSelectedProduct = () => {
    selectedProduct.value = null
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return {
    products,
    selectedProduct,
    isLoading,
    activeProducts,
    getProductById,
    getProductVariants,
    setSelectedProduct,
    clearSelectedProduct,
    formatPrice
  }
})
