import { useLoadingStore } from '@/stores/loadingStore'

export function useLoading() {
  const loadingStore = useLoadingStore()

  // Loading cho navigation
  const showNavigationLoading = () => {
    loadingStore.showNavigationLoading()
  }

  // Loading cho API calls
  const showApiLoading = (text = 'Đang xử lý...') => {
    loadingStore.showApiLoading(text)
  }

  // Loading cho form submission
  const showFormLoading = (text = 'Đang gửi dữ liệu...') => {
    loadingStore.showFormLoading(text)
  }

  // Loading tùy chỉnh
  const showCustomLoading = (options = {}) => {
    loadingStore.showLoading(options)
  }

  // Ẩn loading
  const hideLoading = () => {
    loadingStore.hideLoading()
  }

  // Force ẩn loading
  const forceHideLoading = () => {
    loadingStore.forceHideLoading()
  }

  // Loading với delay tối thiểu
  const showLoadingWithDelay = (options = {}) => {
    loadingStore.showLoadingWithDelay(options)
  }

  // Wrapper cho async functions
  const withLoading = async (asyncFn, options = {}) => {
    const {
      text = 'Đang xử lý...',
      duration = 1500,
      progress = true,
      minDelay = 1000
    } = options

    try {
      showCustomLoading({ text, duration, progress })
      
      const result = await asyncFn()
      
      // Đảm bảo loading hiển thị ít nhất minDelay ms
      const elapsed = Date.now() - Date.now()
      const remainingDelay = Math.max(0, minDelay - elapsed)
      
      if (remainingDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingDelay))
      }
      
      return result
    } finally {
      hideLoading()
    }
  }

  // Wrapper cho navigation
  const withNavigationLoading = async (asyncFn) => {
    return withLoading(asyncFn, {
      text: 'Đang chuyển trang...',
      duration: 1000,
      progress: true,
      minDelay: 1000
    })
  }

  // Wrapper cho form submission
  const withFormLoading = async (asyncFn) => {
    return withLoading(asyncFn, {
      text: 'Đang gửi dữ liệu...',
      duration: 2000,
      progress: true,
      minDelay: 1500
    })
  }

  return {
    // Store methods
    showLoading: loadingStore.showLoading,
    hideLoading,
    forceHideLoading,
    
    // Convenience methods
    showNavigationLoading,
    showApiLoading,
    showFormLoading,
    showCustomLoading,
    showLoadingWithDelay,
    
    // Wrapper methods
    withLoading,
    withNavigationLoading,
    withFormLoading,
    
    // Store state
    isLoading: loadingStore.isGlobalLoading,
    loadingText: loadingStore.currentLoadingText,
    loadingDuration: loadingStore.currentDuration,
    showProgress: loadingStore.shouldShowProgress
  }
}
