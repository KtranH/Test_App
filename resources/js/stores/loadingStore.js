import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  // State
  const isLoading = ref(false)
  const loadingText = ref('Loading...')
  const loadingDuration = ref(1000)
  const showProgress = ref(true)
  const loadingCount = ref(0)

  // Getters
  const isGlobalLoading = computed(() => isLoading.value)
  const currentLoadingText = computed(() => loadingText.value)
  const currentDuration = computed(() => loadingDuration.value)
  const shouldShowProgress = computed(() => showProgress.value)

  // Actions
  const showLoading = (options = {}) => {
    const {
      text = 'Loading...',
      duration = 1000,
      progress = true
    } = options

    loadingText.value = text
    loadingDuration.value = duration
    showProgress.value = progress
    isLoading.value = true
    loadingCount.value++
  }

  const hideLoading = () => {
    loadingCount.value = Math.max(0, loadingCount.value - 1)
    
    if (loadingCount.value === 0) {
      isLoading.value = false
      // Reset về giá trị mặc định
      loadingText.value = 'Loading...'
      loadingDuration.value = 1000
      showProgress.value = true
    }
  }

  const forceHideLoading = () => {
    isLoading.value = false
    loadingCount.value = 0
    loadingText.value = 'Loading...'
    loadingDuration.value = 1000
    showProgress.value = true
  }

  // Loading với delay tối thiểu
  const showLoadingWithDelay = (options = {}) => {
    const {
      text = 'Loading...',
      duration = 1000,
      progress = true,
      minDelay = 1000
    } = options

    showLoading({ text, duration, progress })
    
    // Đảm bảo loading hiển thị ít nhất minDelay ms
    setTimeout(() => {
      hideLoading()
    }, Math.max(duration, minDelay))
  }

  // Loading cho navigation
  const showNavigationLoading = () => {
    showLoading({
      text: 'Đang chuyển trang...',
      duration: 1000,
      progress: true
    })
  }

  // Loading cho API calls
  const showApiLoading = (text = 'Đang xử lý...') => {
    showLoading({
      text,
      duration: 1500,
      progress: true
    })
  }

  // Loading cho form submission
  const showFormLoading = (text = 'Đang gửi dữ liệu...') => {
    showLoading({
      text,
      duration: 2000,
      progress: true
    })
  }

  return {
    // State
    isLoading,
    loadingText,
    loadingDuration,
    showProgress,
    loadingCount,
    
    // Getters
    isGlobalLoading,
    currentLoadingText,
    currentDuration,
    shouldShowProgress,
    
    // Actions
    showLoading,
    hideLoading,
    forceHideLoading,
    showLoadingWithDelay,
    showNavigationLoading,
    showApiLoading,
    showFormLoading
  }
})
