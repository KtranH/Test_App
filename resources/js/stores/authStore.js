import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { AuthApi } from '@/api/index.js'
import { useRouter } from 'vue-router'
export const useAuthStore = defineStore('auth', () => {
  // State
  const router = useRouter()
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const tokenExpiry = ref(localStorage.getItem('token_expiry') || null)
  const isAuthenticated = ref(!!token.value)
  const isLoading = ref(false)

  // Getters
  const currentUser = computed(() => user.value)
  const isLoggedIn = computed(() => isAuthenticated.value && !!user.value)

  //----------------------------------
  // Hàm đăng ký tài khoản
  //----------------------------------
  const register = async (userData) => {
    try {
      isLoading.value = true

      // Lưu thông tin đăng ký vào localStorage để sử dụng sau khi xác thực email
      const registrationData = {
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem('pendingRegistrationData', JSON.stringify(registrationData))
      
      message.success('Thông tin đăng ký đã được lưu! Vui lòng ấn nút "Gửi mã xác thực" để nhận mã.')
      return { success: true, message: 'Thông tin đăng ký đã được lưu! Vui lòng gửi mã xác thực.' }
      
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký tài khoản!'
      message.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }


  //----------------------------------
  // Hàm gửi mã xác thực email
  //----------------------------------
  const sendVerificationCode = async (email) => {
    try {
      isLoading.value = true
      
      const response = await AuthApi.sendVerificationCode({ email })
      
      if (response.data.success) {
        message.success(response.data.message || 'Mã xác thực đã được gửi!')
        return { success: true, data: response.data.data }
      } else {
        message.error(response.data.message || 'Không thể gửi mã xác thực!')
        return { success: false, message: response.data.message }
      }
      
    } catch (error) {
      console.error('Send verification code error:', error)
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi gửi mã xác thực!'
      message.error(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  //----------------------------------
  // Hàm xác thực email và tự động tạo tài khoản
  //----------------------------------
  const verifyEmailWithRegistration = async (data) => {
    try {
      isLoading.value = true
      
      const response = await AuthApi.verifyEmailWithRegistration(data)
      
      if (response.data.success) {
        // Kiểm tra xem có tự động tạo tài khoản không
        if (response.data.autoRegistered) {
          // Tài khoản đã được tạo tự động, cập nhật state
          const { user: userData, token: tokenData } = response.data
          
          user.value = userData
          token.value = tokenData
          isAuthenticated.value = true
          
          // Save to localStorage
          localStorage.setItem('token', tokenData)
          localStorage.setItem('user', JSON.stringify(userData))
          
          message.success(response.data.message || 'Email đã được xác thực và tài khoản đã được tạo thành công!')

          // Xóa dữ liệu đăng ký tài khoản
          localStorage.removeItem('pendingRegistrationData')
          
          return { 
            success: true, 
            message: response.data.message,
            autoRegistered: true
          }
        }
        
        message.success(response.data.message || 'Email đã được xác thực thành công!')
        return { 
          success: true, 
          message: response.data.message,
          autoRegistered: false
        }
      } else {
        message.error(response.data.message || 'Xác thực email thất bại!')
        return { success: false, message: response.data.message }
      }
      
    } catch (error) {
      console.error('Email verification with registration error:', error)
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xác thực email!'
      message.error(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  //----------------------------------
  // Hàm đăng nhập
  //----------------------------------
  const login = async (credentials) => {
    try {
      isLoading.value = true      
      
      const loginData = {
        email: credentials.email,
        password: credentials.password,
        remember: credentials.remember || false 
      }
      const response = await AuthApi.login(loginData)
      
      // Nếu backend yêu cầu 2FA
      if (response.data?.data?.requires_2fa) {
        return {
          success: false,
          requires2FA: true,
          challengeId: response.data.data.challenge_id
        }
      }

      // lấy dữ liệu từ response
      const { user: userData, token: tokenData, expires_at } = response.data.data
      
      // Update state
      user.value = userData
      token.value = tokenData
      tokenExpiry.value = expires_at
      isAuthenticated.value = true
      
      // Save to localStorage và sessionStorage
      localStorage.setItem('token', tokenData)
      localStorage.setItem('user', JSON.stringify(userData))
      if (expires_at) {
        localStorage.setItem('token_expiry', expires_at)
      }
      sessionStorage.setItem('token', tokenData)
      sessionStorage.setItem('user', JSON.stringify(userData))
      
      // Nếu remember me được chọn
      if (credentials.remember) {
        localStorage.setItem('remember_me', 'true')
        localStorage.setItem('remember_email', credentials.email)
      } else {
        localStorage.removeItem('remember_me')
        localStorage.removeItem('remember_email')
      }
      
      // Gọi checkAuth() để lấy thông tin user mới nhất từ server
      await checkAuth()
      
      message.success('Đăng nhập thành công!')
      
      return { success: true, user: user.value }
      
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  //----------------------------------
  // Hàm kiểm tra remember me status
  //----------------------------------
  const checkRememberMe = () => {
    const rememberMe = localStorage.getItem('remember_me')
    const rememberEmail = localStorage.getItem('remember_email')
    
    if (rememberMe === 'true' && rememberEmail) {
      return {
        remember: true,
        email: rememberEmail
      }
    }
    
    return {
      remember: false,
      email: ''
    }
  }

  //----------------------------------
  // Hàm xóa remember me data
  //----------------------------------
  const clearRememberMe = () => {
    localStorage.removeItem('remember_me')
    localStorage.removeItem('remember_email')
  }

  //----------------------------------
  // Hàm clear auth data
  //----------------------------------
  const clearLocalStorageAuthData = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('token_expiry')
    localStorage.removeItem('user')
  }
  const clearSessionStorageAuthData = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('token_expiry')
    sessionStorage.removeItem('user')
  }

  //----------------------------------
  // Hàm đăng xuất
  //----------------------------------
  const logout = async () => {
    try {
      isLoading.value = true

      // gọi API logout
      await AuthApi.logout()

      // Clear state
      user.value = null
      token.value = null
      tokenExpiry.value = null
      isAuthenticated.value = false 
      
      // Clear localStorage và sessionStorage
      clearLocalStorageAuthData()
      clearSessionStorageAuthData()      
      // Xóa remember me data khi đăng xuất
      clearRememberMe()

      message.success('Đăng xuất thành công!')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Vẫn clear state ngay cả khi API call thất bại
      user.value = null
      token.value = null
      tokenExpiry.value = null
      isAuthenticated.value = false 
      clearLocalStorageAuthData()
      clearSessionStorageAuthData()
      // Xóa remember me data
      clearRememberMe()
    } finally {
      isLoading.value = false
    }
  }

  //----------------------------------
  // Hàm kiểm tra đăng nhập
  //----------------------------------
  const checkAuth = async () => {
    try {
      if (!token.value) {
        isAuthenticated.value = false
        return false
      }

      const response = await AuthApi.me()
      if (response.data.success) {
        user.value = response.data.data.user || response.data.data
        isAuthenticated.value = true
        return true
      } else {
        // Token không hợp lệ, clear state
        user.value = null
        token.value = null
        isAuthenticated.value = false
        clearLocalStorageAuthData()
        clearSessionStorageAuthData()
        return false
      }
    } catch (error) {
      console.error('Check auth error:', error)
      // Token không hợp lệ, clear state
      user.value = null
      token.value = null
      isAuthenticated.value = false
      clearLocalStorageAuthData()
      clearSessionStorageAuthData()
      return false
    }
  }

  //----------------------------------
  // Hàm refresh token
  //----------------------------------
  const refresh = async () => {
    try {
      isLoading.value = true

      const response = await AuthApi.refresh()
      if (response.data.success) {
        const { token: tokenData, expires_at } = response.data.data
        token.value = tokenData
        tokenExpiry.value = expires_at
        
        // Update localStorage
        localStorage.setItem('token', tokenData)
        if (expires_at) {
          localStorage.setItem('token_expiry', expires_at)
        }      
        message.success('Token refreshed thành công!')
      } else {
        message.error('Token refresh thất bại!')
      }
      
    } catch (error) {
      console.error('Token refresh error:', error)
      message.error('Token refresh thất bại!')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  //----------------------------------
  // Hàm cập nhật thông tin user
  //----------------------------------
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

  //----------------------------------
  // Hàm đổi mật khẩu
  //----------------------------------
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

  //----------------------------------
  // Hàm khởi tạo auth state
  //----------------------------------
  const initAuth = async () => {
    // Kiểm tra xem có user trong localStorage không
    const storedUser = localStorage.getItem('user')
    const storedExpiry = localStorage.getItem('token_expiry')
    
    if (storedUser && token.value) {
      try {
        const userData = JSON.parse(storedUser)
        user.value = userData
        tokenExpiry.value = storedExpiry
        isAuthenticated.value = true
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token_expiry')
      }
    }
    await checkAuth()
  }

  //----------------------------------
  // Hàm kiểm tra token sắp hết hạn
  //----------------------------------
  const isTokenExpiringSoon = computed(() => {
    if (!tokenExpiry.value) return false
    const expiryTime = new Date(tokenExpiry.value)
    const now = new Date()
    const timeUntilExpiry = expiryTime.getTime() - now.getTime()
    const minutesUntilExpiry = timeUntilExpiry / (1000 * 60)
    
    // Trả về true nếu token hết hạn trong vòng 5 phút
    return minutesUntilExpiry <= 5
  })

  //----------------------------------
  // Hàm tự động refresh token
  //----------------------------------
  const autoRefreshToken = async () => {
    if (isTokenExpiringSoon.value && token.value && !isLoading.value) {
      try {
        await refresh()
      } catch (error) {
        console.error('Auto refresh failed:', error)
        // Nếu refresh thất bại, logout user
        await logout()
      }
    }
  }

  return {
    // State
    user,
    token,
    tokenExpiry,
    isAuthenticated,
    isLoading,
    
    // Getters
    currentUser,
    isLoggedIn,
    isTokenExpiringSoon,
    
    // Actions
    sendVerificationCode,
    verifyEmailWithRegistration,
    register,
    login,
    logout,
    checkAuth,
    refresh,
    updateProfile,
    changePassword,
    initAuth,
    checkRememberMe,
    clearRememberMe,
    autoRefreshToken,
    clearLocalStorageAuthData,
    clearSessionStorageAuthData
  }
})
