<template>
  <PageTransition aos-animation="slide-in-left" aos-duration="800">
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Logo/Brand -->
        <div class="text-center mb-8" data-aos="fade-down" data-aos-delay="100">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <svg class="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">Chào mừng trở lại</h1>
          <p class="text-gray-400">Đăng nhập để tiếp tục</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <a-form
            :model="formState"
            :rules="rules"
            @finish="onFinish"
            layout="vertical"
            size="large"
          >
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
                placeholder="Nhập mật khẩu"
                :prefix="h(LockOutlined)"
                class="!h-12 !rounded-lg !border-gray-300 !focus:border-gray-900 !focus:ring-gray-900"
              />
            </a-form-item>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between mb-6">
              <a-checkbox v-model:checked="formState.remember">
                <span class="text-gray-700">Ghi nhớ đăng nhập</span>
              </a-checkbox>
              <a-button type="link" class="!text-gray-600 !hover:text-gray-900 !p-0">
                Quên mật khẩu?
              </a-button>
            </div>

            <!-- Login Button -->
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              class="!w-full !h-12 !bg-gray-900 !hover:bg-gray-800 !border-0 !rounded-lg !text-base !font-medium !shadow-lg !hover:shadow-xl !transition-all !duration-200"
            >
              {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
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

            <!-- Social Login -->
            <div class="space-y-3">
              <a-button
                class="!w-full !h-12 !border !border-gray-300 !rounded-lg !text-gray-700 !hover:border-gray-400 !hover:bg-gray-50 !transition-all !duration-200"
                @click="loginWithGoogle"
              >
                <GoogleOutlined class="mr-2" />
                Đăng nhập với Google
              </a-button>
              
              <a-button
                class="!w-full !h-12 !border !border-gray-300 !rounded-lg !text-gray-700 !hover:border-gray-400 !hover:bg-gray-50 !transition-all !duration-200"
                @click="loginWithFacebook"
              >
                <FacebookOutlined class="mr-2" />
                Đăng nhập với Facebook
              </a-button>
            </div>

            <!-- Register Link -->
            <div class="text-center mt-6">
              <span class="text-gray-600">Chưa có tài khoản? </span>
              <router-link
                to="/register"
                class="text-gray-900 font-medium hover:text-gray-700 transition-colors duration-200"
              >
                Đăng ký ngay
              </router-link>
            </div>
          </a-form>
        </div>
      </div>
    </div>
  </PageTransition>
</template>

<script setup>
import { reactive, ref, h, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/authStore.js'
import Footer from '@/components/Layout/Footer.vue'
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined
} from '@ant-design/icons-vue'
import PageTransition from '@/components/UI/PageTransition.vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = computed(() => authStore.isLoading)

// Form state
const formState = reactive({
  email: '',
  password: '',
  remember: false
})

// Validation rules
const rules = {
  email: [
    { required: true, message: 'Vui lòng nhập email!' },
    { type: 'email', message: 'Email không hợp lệ!' }
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu!' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
  ]
}

// Handle form submission
const onFinish = async (values) => {
  try {
    await authStore.login(values)
    router.push('/')
  } catch (error) {
    console.error('Login error:', error)
    message.error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập!')
  }
}

// Social login handlers
const loginWithGoogle = () => {
  message.info('Tính năng đăng nhập Google sẽ được phát triển sau')
}

const loginWithFacebook = () => {
  message.info('Tính năng đăng nhập Facebook sẽ được phát triển sau')
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

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #111827;
  border-color: #111827;
}

:deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner) {
  border-color: #111827;
}
</style>
