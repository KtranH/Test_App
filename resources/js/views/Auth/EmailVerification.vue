<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-2">
            Xác thực Email
          </h2>
          <p class="text-sm text-gray-600">
            Nhập mã xác thực 6 chữ số đã được gửi đến email của bạn
          </p>
        </div>

        <!-- Email Input Form -->
        <div v-if="!emailSent" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300': emailError }"
                placeholder="Nhập email của bạn"
              />
            </div>
            <p v-if="emailError" class="mt-2 text-sm text-red-600">
              {{ emailError }}
            </p>
          </div>

          <div>
            <button
              @click="sendVerificationCode"
              :disabled="isLoading || !email"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang gửi...
              </span>
              <span v-else>Gửi mã xác thực</span>
            </button>
              <div class="mt-6 flex items-center justify-between">
                <router-link
                  to="/register"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white transition-colors duration-150"
                >
                  <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Quay lại trang đăng ký
                </router-link>
              </div>
          </div>
        </div>

        <!-- Verification Code Form -->
        <div v-if="emailSent && !verificationSuccess" class="space-y-6">
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-4">
              Mã xác thực đã được gửi đến <span class="font-medium text-gray-900">{{ email }}</span>
            </p>
            <p class="text-xs text-gray-500">
              Mã có hiệu lực trong {{ expiresIn }} phút
            </p>
          </div>

          <div>
            <label for="verificationCode" class="block text-sm font-medium text-gray-700">
              Mã xác thực
            </label>
            <div class="mt-1">
              <input
                id="verificationCode"
                v-model="verificationCode"
                name="verificationCode"
                type="text"
                maxlength="6"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center text-2xl font-mono tracking-widest"
                :class="{ 'border-red-300': codeError }"
                placeholder="000000"
                @input="formatVerificationCode"
              />
            </div>
            <p v-if="codeError" class="mt-2 text-sm text-red-600">
              {{ codeError }}
            </p>
          </div>

          <div class="flex space-x-3">
            <button
              @click="verifyCode"
              :disabled="isLoading || verificationCode.length !== 6"
              class="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xác thực...
              </span>
              <span v-else>Xác thực</span>
            </button>

            <button
              @click="resendCode"
              :disabled="isLoading || resendDisabled"
              class="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="resendDisabled">
                Gửi lại ({{ resendCountdown }}s)
              </span>
              <span v-else>Gửi lại</span>
            </button>
          </div>

          <div class="text-center">
            <button
              @click="backToEmailInput"
              class="text-sm text-blue-600 hover:text-blue-500"
            >
              ← Quay lại nhập email
            </button>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="verificationSuccess" class="text-center space-y-4">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Xác thực thành công!</h3>
          <p class="text-sm text-gray-600">
            <span v-if="autoRegistered">Tài khoản đã được tạo thành công và bạn đã được đăng nhập!</span>
            <span v-else>Email của bạn đã được xác thực. Bây giờ bạn có thể tiếp tục đăng ký tài khoản.</span>
          </p>
          <div class="pt-4">
            <button
              v-if="!autoRegistered"
              @click="goToLogin"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tiếp tục đăng nhập bằng tài khoản đã tạo
            </button>
            <button
              v-else
              @click="goToDashboard"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Đi đến Dashboard
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { message } from 'ant-design-vue'

const router = useRouter()
const authStore = useAuthStore()

// Reactive state
const email = ref('')
const verificationCode = ref('')
const emailSent = ref(false)
const verificationSuccess = ref(false)
const errorMessage = ref('')
const emailError = ref('')
const codeError = ref('')
const expiresIn = ref(15)
const resendCountdown = ref(0)
const resendDisabled = ref(false)
const autoRegistered = ref(false)

// Computed
const canVerify = computed(() => verificationCode.value.length === 6)
const isLoading = computed(() => authStore.isLoading)

// Check for pending registration data on mount
onMounted(() => {
  const pendingData = localStorage.getItem('pendingRegistrationData')
  if (pendingData) {
    try {
      const data = JSON.parse(pendingData)
      email.value = data.email
    } catch (error) {
      console.error('Error parsing pending registration data:', error)
    }
  }
})

// Methods
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = 'Email là bắt buộc'
    return false
  }
  if (!emailRegex.test(email.value)) {
    emailError.value = 'Email không đúng định dạng'
    return false
  }
  emailError.value = ''
  return true
}

const sendVerificationCode = async () => {
  if (!validateEmail()) return
  
  errorMessage.value = ''
  
  try {
    const result = await authStore.sendVerificationCode(email.value)
    
    if (result.success) {
      emailSent.value = true
      expiresIn.value = result.data?.expires_in || 15
      startResendCountdown()
    } else {
      errorMessage.value = result.message || 'Không thể gửi mã xác thực'
    }
  } catch (error) {
    console.error('Error sending verification code:', error)
    errorMessage.value = 'Có lỗi xảy ra khi gửi mã xác thực'
  }
}

const verifyCode = async () => {
  if (!canVerify.value) return
  
  errorMessage.value = ''
  codeError.value = ''
  
  try {
    // Lấy thông tin đăng ký từ localStorage
    const pendingData = localStorage.getItem('pendingRegistrationData')
    let registrationData = null
    
    if (pendingData) {
      try {
        registrationData = JSON.parse(pendingData)
      } catch (error) {
        console.error('Error parsing pending registration data:', error)
      }
    }
    
    // Gọi API xác thực với thông tin đăng ký kèm theo
    const result = await authStore.verifyEmailWithRegistration({
      email: email.value,
      verification_code: verificationCode.value,
      registration_data: registrationData
    })
    
    if (result.success) {
      verificationSuccess.value = true
      autoRegistered.value = result.autoRegistered || false
      
      if (result.autoRegistered) {
        // Tài khoản đã được tạo tự động
        message.success('Tài khoản đã được tạo thành công! Bạn đã được đăng nhập.')
        // Xóa dữ liệu đăng ký tạm thời
        localStorage.removeItem('pendingRegistrationData')
      } else {
        // Chỉ xác thực email
        message.success('Email đã được xác thực thành công!')
      }
    } else {
      codeError.value = result.message || 'Mã xác thực không chính xác'
    }
  } catch (error) {
    console.error('Error verifying code:', error)
    codeError.value = 'Có lỗi xảy ra khi xác thực'
  }
}

const resendCode = async () => {
  if (resendDisabled.value) return
  
  errorMessage.value = ''
  
  try {
    const result = await authStore.sendVerificationCode(email.value)
    
    if (result.success) {
      startResendCountdown()
    } else {
      if (result.data?.remaining_time) {
        resendCountdown.value = result.data.remaining_time * 60
        startResendCountdown()
      }
      errorMessage.value = result.message || 'Không thể gửi lại mã xác thực'
    }
  } catch (error) {
    console.error('Error resending code:', error)
    errorMessage.value = 'Có lỗi xảy ra khi gửi lại mã'
  }
}

const startResendCountdown = () => {
  resendCountdown.value = 600 // 10 phút
  resendDisabled.value = true
  
  const timer = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      resendDisabled.value = false
      clearInterval(timer)
    }
  }, 1000)
}

const formatVerificationCode = () => {
  // Chỉ cho phép nhập số
  verificationCode.value = verificationCode.value.replace(/\D/g, '')
  // Giới hạn 6 chữ số
  if (verificationCode.value.length > 6) {
    verificationCode.value = verificationCode.value.slice(0, 6)
  }
}

const backToEmailInput = () => {
  emailSent.value = false
  verificationCode.value = ''
  errorMessage.value = ''
  codeError.value = ''
  resendDisabled.value = false
  resendCountdown.value = 0
  autoRegistered.value = false
}

const goToLogin = () => {
  router.push('/login')
}

const goToDashboard = () => {
  router.push('/dashboard')
}

// Cleanup timer khi component unmount
onUnmounted(() => {
  resendDisabled.value = false
  resendCountdown.value = 0
})
</script>
