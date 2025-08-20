import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { message } from 'ant-design-vue'

export function useProductActions() {
  const router = useRouter()
  const productStore = useProductStore()
  
  // Product actions
  const createProduct = () => {
    router.push('/products/create')
  }
  
  const editProduct = (product) => {
    router.push(`/products/${product.id}/edit`)
  }
  
  const deleteProduct = async (product) => {
    try {
      // Logic xóa sản phẩm sẽ được implement ở đây
      await productStore.deleteProduct(product.id)
      message.success('Xóa sản phẩm thành công')
    } catch (error) {
      console.error('Error deleting product:', error)
      message.error('Có lỗi xảy ra khi xóa sản phẩm')
    }
  }
  
  const toggleProductStatus = async (product) => {
    try {
      // Logic toggle trạng thái sản phẩm
      await productStore.toggleProductStatus(product.id)
      message.success('Cập nhật trạng thái thành công')
    } catch (error) {
      console.error('Error toggling product status:', error)
      message.error('Có lỗi xảy ra khi cập nhật trạng thái')
    }
  }
  
  // Variant actions
  const createVariant = (product) => {
    router.push(`/products/${product.id}/variants/create`)
  }
  
  const editVariant = (product, variant) => {
    router.push(`/products/${product.id}/variants/${variant.id}/edit`)
  }
  
  const deleteVariant = async (product, variant) => {
    try {
      // Logic xóa biến thể
      await productStore.deleteVariant(product.id, variant.id)
      message.success('Xóa biến thể thành công')
    } catch (error) {
      console.error('Error deleting variant:', error)
      message.error('Có lỗi xảy ra khi xóa biến thể')
    }
  }
  
  const toggleVariantStatus = async (product, variant) => {
    try {
      // Logic toggle trạng thái biến thể
      await productStore.toggleVariantStatus(product.id, variant.id)
      message.success('Cập nhật trạng thái biến thể thành công')
    } catch (error) {
      console.error('Error toggling variant status:', error)
      message.error('Có lỗi xảy ra khi cập nhật trạng thái biến thể')
    }
  }
  
  // Export actions
  const exportProductReport = (product) => {
    try {
      // Logic xuất báo cáo sản phẩm
      console.log('Exporting product report:', product.id)
      message.info('Đang xuất báo cáo...')
    } catch (error) {
      console.error('Error exporting report:', error)
      message.error('Có lỗi xảy ra khi xuất báo cáo')
    }
  }
  
  // Bulk actions
  const bulkDeleteProducts = async (productIds) => {
    try {
      // Logic xóa nhiều sản phẩm
      await productStore.bulkDeleteProducts(productIds)
      message.success(`Đã xóa ${productIds.length} sản phẩm`)
    } catch (error) {
      console.error('Error bulk deleting products:', error)
      message.error('Có lỗi xảy ra khi xóa sản phẩm')
    }
  }
  
  const bulkUpdateStatus = async (productIds, status) => {
    try {
      // Logic cập nhật trạng thái nhiều sản phẩm
      await productStore.bulkUpdateStatus(productIds, status)
      message.success(`Đã cập nhật trạng thái ${productIds.length} sản phẩm`)
    } catch (error) {
      console.error('Error bulk updating status:', error)
      message.error('Có lỗi xảy ra khi cập nhật trạng thái')
    }
  }
  
  return {
    // Product actions
    createProduct,
    editProduct,
    deleteProduct,
    toggleProductStatus,
    
    // Variant actions
    createVariant,
    editVariant,
    deleteVariant,
    toggleVariantStatus,
    
    // Export actions
    exportProductReport,
    
    // Bulk actions
    bulkDeleteProducts,
    bulkUpdateStatus
  }
}
