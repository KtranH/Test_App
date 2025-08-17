<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8" data-aos="fade-up" data-aos-delay="100">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
          <svg class="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Tạo tài khoản mới</h1>
        <p class="text-gray-400">Tham gia cùng chúng tôi ngay hôm nay</p>
      </div>

      <!-- Register Form -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <a-form
          :model="formState"
          :rules="rules"
          @finish="onFinish"
          layout="vertical"
          size="large"
        >
          <!-- Full Name Field -->
          <a-form-item name="fullName" label="Họ và tên">
            <a-input
              v-model:value="formState.fullName"
              placeholder="Nhập họ và tên đầy đủ"
              :prefix="h(UserOutlined)"
              class="!h-12 !rounded-lg !border-gray-300 !focus:border-gray-900 !focus:ring-gray-900"
            />
          </a-form-item>

          <!-- Email Field -->
          <a-form-item name="email" label="Email">
            <a-input
              v-model:value="formState.email"
              placeholder="Nhập email của bạn"
              :prefix="h(MailOutlined)"
              class="!h-12 !rounded-lg !border-gray-300 !focus:border-gray-900 !focus:ring-gray-900"
            />
          </a-form-item>

          <!-- Password Field -->
          <a-form-item name="password" label="Mật khẩu">
            <a-input-password
              v-model:value="formState.password"
              placeholder="Tạo mật khẩu mạnh"
              :prefix="h(LockOutlined)"
              class="!h-12 !rounded-lg !border-gray-300 !focus:border-gray-900 !focus:ring-gray-900"
            />
          </a-form-item>

          <!-- Confirm Password Field -->
          <a-form-item name="confirmPassword" label="Xác nhận mật khẩu">
            <a-input-password
              v-model:value="formState.confirmPassword"
              placeholder="Nhập lại mật khẩu"
              :prefix="h(LockOutlined)"
              class="!h-12 !rounded-lg !border-gray-300 !focus:border-gray-900 !focus:ring-gray-900"
            />
          </a-form-item>

          <!-- Terms & Conditions -->
          <div class="mb-6">
            <a-checkbox v-model:checked="formState.agreeTerms">
              <span class="text-gray-700">
                Tôi đồng ý với 
                <a-button type="link" class="!text-gray-900 !hover:text-gray-700 !p-0 !h-auto">
                  Điều khoản sử dụng
                </a-button>
                và
                <a-button type="link" class="!text-gray-900 !hover:text-gray-700 !p-0 !h-auto">
                  Chính sách bảo mật
                </a-button>
              </span>
            </a-checkbox>
          </div>

          <!-- Register Button -->
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            :disabled="!formState.agreeTerms"
            class="!w-full !h-12 !bg-gray-900 !hover:bg-gray-800 !border-0 !rounded-lg !text-base !font-medium !shadow-lg !hover:shadow-xl !transition-all !duration-200 !disabled:bg-gray-400 !disabled:cursor-not-allowed"
          >
            {{ loading ? 'Đang xử lý...' : 'Đăng ký tài khoản' }}
          </a-button>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          <!-- Social Register -->
          <div class="space-y-3">
            <a-button
              class="!w-full !h-12 !border !border-gray-300 !rounded-lg !text-gray-700 !hover:border-gray-400 !hover:bg-gray-50 !transition-all !duration-200"
              @click="registerWithGoogle"
            >
              <GoogleOutlined class="mr-2" />
              Đăng ký với Google
            </a-button>
            
            <a-button
              class="!w-full !h-12 !border !border-gray-300 !rounded-lg !text-gray-700 !hover:border-gray-400 !hover:bg-gray-50 !transition-all !duration-200"
              @click="registerWithFacebook"
            >
              <FacebookOutlined class="mr-2" />
              Đăng ký với Facebook
            </a-button>
          </div>

          <!-- Login Link -->
          <div class="text-center mt-6">
            <span class="text-gray-600">Đã có tài khoản? </span>
            <router-link
              to="/login"
              class="text-gray-900 font-medium hover:text-gray-700 transition-colors duration-200"
            >
              Đăng nhập ngay
            </router-link>
          </div>
        </a-form>
      </div>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, h, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/authStore.js'
import Footer from '@/components/Layout/Footer.vue'
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = computed(() => authStore.isLoading)

// Form state
const formState = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

// Custom validation for confirm password
const validateConfirmPassword = async (rule, value) => {
  if (value && value !== formState.password) {
    throw new Error('Mật khẩu xác nhận không khớp!')
  }
}

// Validation rules
const rules = {
  fullName: [
    { required: true, message: 'Vui lòng nhập họ và tên!' },
    { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
  ],
  email: [
    { required: true, message: 'Vui lòng nhập email!' },
    { type: 'email', message: 'Email không hợp lệ!' }
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu!' },
    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt!'
    }
  ],
  confirmPassword: [
    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
    { validator: validateConfirmPassword }
  ]
}

// Handle form submission
const onFinish = async (values) => {
  try {
    await authStore.register(values)
    router.push('/email-verification')
  } catch (error) {
    console.error('Registration error:', error)
  } finally {
    // isLoading.value = false // This line was removed from the new_code, so it's removed here.
  }
}

// Social register handlers
const registerWithGoogle = () => {
  message.info('Tính năng đăng ký Google sẽ được phát triển sau')
}

const registerWithFacebook = () => {
  message.info('Tính năng đăng ký Facebook sẽ được phát triển sau')
}
</script>

<style scoped>
/* Custom styles for Ant Design components */
:deep(.ant-form-item-label > label) {
  color: #374151 !important;
  font-weight: 500;
}

:deep(.ant-input),
:deep(.ant-input-password) {
  border-radius: 8px;
  border-color: #d1d5db;
}

:deep(.ant-input:focus),
:deep(.ant-input-password:focus),
:deep(.ant-input-focused),
:deep(.ant-input-password-focused) {
  border-color: #111827 !important;
  box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.1) !important;
}

:deep(.ant-btn-primary) {
  background: #111827;
  border-color: #111827;
}

:deep(.ant-btn-primary:hover) {
  background: #1f2937 !important;
  border-color: #1f2937 !important;
}

:deep(.ant-btn-primary:disabled) {
  background: #9ca3af !important;
  border-color: #9ca3af !important;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #111827;
  border-color: #111827;
}

:deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner) {
  border-color: #111827;
}

:deep(.ant-form-item-explain-error) {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
}
</style>
