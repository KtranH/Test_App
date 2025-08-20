import { useRouter, useRoute } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'

export function useProduct() {
  const productStore = useProductStore()
  const router = useRouter()
  const route = useRoute()
  
  // Store refs
  const { activeProducts, selectedProduct, isLoading } = storeToRefs(productStore)
  const { formatPrice, getProductById, setSelectedProduct, clearSelectedProduct } = productStore

  // Methods
  const viewProduct = (product) => {
    router.push(`/products/${product.id}`)
  }

  const goBack = () => {
    clearSelectedProduct()
    router.push('/products')
  }

  const getTotalStock = () => {
    if (!selectedProduct.value) return 0
    return selectedProduct.value.variants.reduce((total, variant) => total + variant.stock, 0)
  }

  const getActiveVariants = () => {
    if (!selectedProduct.value) return 0
    return selectedProduct.value.variants.filter(variant => variant.is_active).length
  }

  const getColorHex = (color) => {
    const colorMap = {
      'Đen': '#000000',
      'Trắng': '#FFFFFF',
      'Xanh đậm': '#1e3a8a',
      'Đỏ': '#dc2626',
      'Xanh': '#2563eb'
    }
    return colorMap[color] || '#6b7280'
  }

  const loadProductById = (productId) => {
    if (productId) {
      const product = getProductById(productId)
      if (product) {
        setSelectedProduct(product)
      } else {
        // Nếu không tìm thấy sản phẩm, redirect về danh sách
        router.push('/products')
      }
    }
  }

  const handleRouteChange = (newId) => {
    if (newId) {
      const product = getProductById(parseInt(newId))
      if (product) {
        setSelectedProduct(product)
      } else {
        // Nếu không tìm thấy sản phẩm, redirect về danh sách
        router.push('/products')
      }
    }
  }

  const initProductDetail = () => {
    // Lấy product ID từ route params
    const productId = parseInt(route.params.id)
    
    // Tự động load sản phẩm khi component mount
    onMounted(() => {
      loadProductById(productId)
    })

    // Watch route changes
    watch(() => route.params.id, (newId) => {
      handleRouteChange(newId)
    })
  }

  return {
    // Store refs
    activeProducts,
    selectedProduct,
    isLoading,
    
    // Methods
    viewProduct,
    goBack,
    getTotalStock,
    getActiveVariants,
    getColorHex,
    loadProductById,
    handleRouteChange,
    initProductDetail,
    
    // Store methods
    formatPrice,
    getProductById,
    setSelectedProduct,
    clearSelectedProduct
  }
}
