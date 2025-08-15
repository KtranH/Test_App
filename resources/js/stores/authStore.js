import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { AuthApi } from '@/api/index.js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = ref(!!token.value)
  const isLoading = ref(false)

  // Getters
  const currentUser = computed(() => user.value)
  const isLoggedIn = computed(() => isAuthenticated.value && !!user.value)

  // Actions
  const login = async (credentials) => {
    try {
      isLoading.value = true      
      // gọi API login
      const response = await AuthApi.login(credentials)
      
      // lấy dữ liệu từ response
      const { user: userData, token: tokenData } = response.data
      
      // Update state
      user.value = userData
      token.value = tokenData
      isAuthenticated.value = true
      
      // Save to localStorage và sessionStorage
      localStorage.setItem('token', tokenData)
      localStorage.setItem('user', JSON.stringify(userData))
      sessionStorage.setItem('token', tokenData)
      sessionStorage.setItem('user', JSON.stringify(userData))
      
      message.success('Đăng nhập thành công!')
      
      return { success: true, user: userData }
      
    } catch (error) {
      console.error('Login error:', error)
      message.error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập!')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data) => {
    try {
      isLoading.value = true

      // gọi API register
      const response = await AuthApi.register(data)

      // lấy dữ liệu từ response
      const { user: userData, token: tokenData } = response.data

      // Update state
      user.value = userData
      token.value = tokenData
      isAuthenticated.value = true
      
      // Save to localStorage
      localStorage.setItem('token', tokenData)
      localStorage.setItem('user', JSON.stringify(userData))
      
      message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.')
      
      return { success: true }
      
    } catch (error) {
      console.error('Registration error:', error)
      message.error('Đăng ký thất bại. Vui lòng thử lại!')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      isLoading.value = true

      // gọi API logout
      await AuthApi.logout()

      // Clear state
      user.value = null
      token.value = null
      isAuthenticated.value = false 
      
      // Clear localStorage và sessionStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      
      message.success('Đăng xuất thành công!')
      
    } catch (error) {
      console.error('Logout error:', error)
      // Vẫn clear state ngay cả khi API call thất bại
      user.value = null
      token.value = null
      isAuthenticated.value = false 
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    } finally {
      isLoading.value = false
    }
  }

  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem('token')
      
      if (storedToken) {  
        // gọi API me
        const response = await AuthApi.me()

        // lấy dữ liệu từ response
        const { user: userData } = response.data

        // Update state
        user.value = userData
        isAuthenticated.value = true
        
        // Update localStorage với user mới
        localStorage.setItem('user', JSON.stringify(userData))
        
        return true
      }
      
      return false
      
    } catch (error) {
      console.error('Auth check error:', error)
      logout()
      return false
    }
  }

  const refresh = async () => {
    try {
      isLoading.value = true

      // gọi API refresh
      const response = await AuthApi.refresh()

      // lấy dữ liệu từ response
      const { token: tokenData } = response.data

      // Update state
      token.value = tokenData
      
      // Update localStorage
      localStorage.setItem('token', tokenData)
      
      message.success('Token refreshed thành công!')
      
    } catch (error) {
      console.error('Token refresh error:', error)
      message.error('Token refresh thất bại!')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    try {
      isLoading.value = true

      // gọi API update profile
      const response = await AuthApi.updateProfile(profileData)

      // lấy dữ liệu từ response
      const { user: userData } = response.data

      // Update state
      user.value = userData
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      
      message.success('Cập nhật thông tin thành công!')
      
    } catch (error) {
      console.error('Profile update error:', error)
      message.error('Cập nhật thông tin thất bại!')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    try {
      isLoading.value = true

      // gọi API change password
      await AuthApi.changePassword(passwordData)

      message.success('Đổi mật khẩu thành công!')
      
    } catch (error) {
      console.error('Password change error:', error)
      message.error('Đổi mật khẩu thất bại!')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Initialize auth state on store creation
  const initAuth = async () => {
    await checkAuth()
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    
    // Getters
    currentUser,
    isLoggedIn,
    
    // Actions
    login,
    register,
    logout,
    checkAuth,
    refresh,
    updateProfile,
    changePassword,
    initAuth
  }
})
