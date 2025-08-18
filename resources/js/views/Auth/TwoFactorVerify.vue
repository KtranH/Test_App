<template>
  <PageTransition aos-animation="slide-in-left" aos-duration="800">
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div class="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
          <!-- SVG Shield Icon -->
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-gray-700">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 3l7 4v5c0 5.25-3.5 9.25-7 10-3.5-.75-7-4.75-7-10V7l7-4z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 11v3m0 0h.01" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold mb-2 text-gray-900 text-center">Xác thực hai lớp</h2>
        <p class="text-gray-500 mb-6 text-center text-sm">
          Vui lòng nhập mã OTP từ ứng dụng Authenticator để hoàn tất đăng nhập.
        </p>
        <a-form :model="form" layout="vertical" @finish="onSubmit" class="w-full">
          <a-form-item name="otp" label="Mã OTP" :rules="[{ required: true, message: 'Vui lòng nhập mã OTP' }]">
            <a-input
              v-model:value="form.otp"
              placeholder="Nhập mã 6 số"
              maxlength="6"
              class="!h-12 !rounded-lg text-center tracking-widest text-lg font-mono"
              autocomplete="one-time-code"
              inputmode="numeric"
            />
          </a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            class="!w-full !h-12 !rounded-lg mt-2 !bg-black !font-bold !tracking-wide hover:!bg-gray-800"
          >
            Xác nhận
          </a-button>
        </a-form>
        <div class="mt-6 text-xs text-gray-400 text-center w-full">
          <span>Không nhận được mã? </span>
          <router-link to="/login" class="text-gray-600 underline hover:text-gray-900 transition">Quay lại đăng nhập</router-link>
        </div>
      </div>
    </div>
  </PageTransition>
  </template>

<script setup>
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { AuthApi } from '@/api/index.js'
import PageTransition from '@/components/UI/PageTransition.vue'
import { useAuthStore } from '@/stores/authStore.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const loading = computed(() => authStore.isLoading)

const form = reactive({ otp: '' })

const onSubmit = async () => {
  const challengeId = route.query.challengeId
  if (!challengeId) {
    message.error('Thiếu challenge. Vui lòng đăng nhập lại')
    router.push('/login')
    return
  }
  try {
    authStore.isLoading = true
    const res = await AuthApi.twoFAVerifyLogin({ challenge_id: String(challengeId), otp: form.otp })
    if (res.data?.success) {
      const { token, user, expires_at } = res.data.data
      // Lưu token & user tương tự login thành công
      authStore.$patch({
        token,
        isAuthenticated: true,
        user,
        tokenExpiry: expires_at
      })
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      if (expires_at) localStorage.setItem('token_expiry', expires_at)
      message.success('Đăng nhập thành công!')
      router.push('/')
    } else {
      message.error(res.data?.message || 'Xác thực 2FA thất bại')
    }
  } catch (e) {
    message.error(e?.response?.data?.message || 'Xác thực 2FA thất bại')
  } finally {
    authStore.isLoading = false
  }
}
</script>

<style scoped>
</style>


