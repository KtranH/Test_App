import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const authStore = useAuthStore()
  let refreshInterval = null

  // Tự động refresh token mỗi phút
  const startAutoRefresh = () => {
    refreshInterval = setInterval(() => {
      authStore.autoRefreshToken()
    }, 60000) // 1 phút
  }

  // Dừng auto refresh
  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  onMounted(() => {
    if (authStore.isLoggedIn) {
      startAutoRefresh()
    }
  })

  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    startAutoRefresh,
    stopAutoRefresh
  }
}
