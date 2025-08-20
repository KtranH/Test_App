import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('admin.ui', () => {
  const isPageLoading = ref(false)
  const loadingMessage = ref('Đang tải...')
  const isSidebarOpen = ref(false)

  const startLoading = (message) => {
    if (message) loadingMessage.value = message
    isPageLoading.value = true
  }

  const stopLoading = () => {
    isPageLoading.value = false
    loadingMessage.value = 'Đang tải...'
  }

  const openSidebar = () => { isSidebarOpen.value = true }
  const closeSidebar = () => { isSidebarOpen.value = false }
  const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value }

  return {
    // state
    isPageLoading,
    loadingMessage,
    isSidebarOpen,
    // actions
    startLoading,
    stopLoading,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  }
})


