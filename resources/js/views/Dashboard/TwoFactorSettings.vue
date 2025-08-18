<template>
  <PageTransition>
    <div class="max-w-xl mx-auto p-6">
      <div class="flex flex-col items-center mb-6">
        <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <!-- SVG Shield Icon -->
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-gray-700">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 3l7 4v5c0 5.25-3.5 9.25-7 10-3.5-.75-7-4.75-7-10V7l7-4z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 11v3m0 0h.01" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 text-center">Bảo mật - Xác thực hai lớp (2FA)</h2>
        <p class="text-gray-500 text-center mt-1 text-sm max-w-md">
          Tăng cường bảo vệ tài khoản bằng xác thực hai lớp qua ứng dụng Authenticator.
        </p>
      </div>
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="flex items-center justify-between mb-6">
          <span class="text-gray-700 font-medium flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-gray-400">
              <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
              <path v-if="enabled" stroke="currentColor" stroke-width="2" d="M8 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
              <path v-else stroke="currentColor" stroke-width="2" d="M9.5 9.5l5 5m0-5l-5 5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Trạng thái:
          </span>
          <span :class="enabled ? 'text-green-600 font-semibold' : 'text-gray-500 font-medium'">
            {{ enabled ? 'Đang bật' : 'Đang tắt' }}
          </span>
        </div>

        <div v-if="!enabled">
          <div class="flex flex-col items-center">
            <a-button type="primary" :loading="loading" @click="startEnable" class="!w-full !h-11 !bg-black !rounded-lg !font-bold !tracking-wide hover:!bg-gray-800">
              <span class="flex items-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="inline-block">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Bật 2FA
              </span>
            </a-button>
          </div>
          <div v-if="secret && otpauthUrl" class="mt-8">
            <div class="flex flex-col items-center">
              <p class="text-gray-600 mb-2 text-center">
                Quét mã QR bằng ứng dụng Google Authenticator hoặc nhập thủ công, sau đó nhập mã OTP để xác nhận bật.
              </p>
              <div class="bg-gray-50 rounded-lg p-4 flex flex-col items-center mb-4">
                <qrcode-vue :value="otpauthUrl" :size="140" class="mb-2" />
                <span class="text-xs text-gray-400 break-all select-all">{{ otpauthUrl }}</span>
              </div>
            </div>
            <a-form class="mt-4" @finish="confirmEnable" :model="form">
              <a-form-item name="otp" :rules="[{ required: true, message: 'Vui lòng nhập OTP' }]">
                <a-input
                  v-model:value="form.otp"
                  placeholder="Nhập mã OTP"
                  maxlength="6"
                  class="!h-11 !rounded-lg text-center tracking-widest text-lg font-mono"
                  autocomplete="one-time-code"
                  inputmode="numeric"
                />
              </a-form-item>
              <a-button type="primary" html-type="submit" :loading="loading" class="!w-full !h-11 !rounded-lg !font-bold mt-2 !bg-black !tracking-wide hover:!bg-gray-800">
                Xác nhận bật
              </a-button>
            </a-form>
          </div>
        </div>

        <div v-else>
          <div class="mb-4 text-gray-500 text-sm text-center">
            Để tắt 2FA, vui lòng nhập mã OTP hiện tại từ ứng dụng Authenticator.
          </div>
          <a-form @finish="disable" :model="form">
            <a-form-item name="otp" :rules="[{ required: true, message: 'Vui lòng nhập OTP hiện tại để tắt' }]">
              <a-input
                v-model:value="form.otp"
                placeholder="Nhập OTP hiện tại"
                maxlength="6"
                class="!h-11 !rounded-lg text-center tracking-widest text-lg font-mono"
                autocomplete="one-time-code"
                inputmode="numeric"
              />
            </a-form-item>
            <a-popconfirm title="Bạn chắc chắn muốn tắt 2FA?" ok-text="Đồng ý" cancel-text="Hủy" @confirm="disable">
              <a-button danger :loading="loading" class="!w-full !h-11 !rounded-lg font-semibold">Tắt 2FA</a-button>
            </a-popconfirm>
          </a-form>
        </div>
      </div>
    </div>
  </PageTransition>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import PageTransition from '@/components/UI/PageTransition.vue'
import { AuthApi } from '@/api/index.js'
import QrcodeVue from 'qrcode.vue'

const enabled = ref(false)
const loading = ref(false)
const secret = ref('')
const otpauthUrl = ref('')
const form = reactive({ otp: '' })

const loadStatus = async () => {
  loading.value = true
  try {
    const res = await AuthApi.twoFAStatus()
    enabled.value = !!res.data?.data?.enabled
  } catch (e) {
    message.error('Không tải được trạng thái 2FA')
  } finally {
    loading.value = false
  }
}

const startEnable = async () => {
  loading.value = true
  try {
    const res = await AuthApi.twoFAInitEnable()
    secret.value = res.data?.data?.secret
    otpauthUrl.value = res.data?.data?.otpauth_url
  } catch (e) {
    message.error(e?.response?.data?.message || 'Không khởi tạo được 2FA')
  } finally {
    loading.value = false
  }
}

const confirmEnable = async () => {
  loading.value = true
  try {
    const res = await AuthApi.twoFAConfirmEnable({ otp: form.otp })
    if (res.data?.success) {
      message.success('Bật 2FA thành công')
      enabled.value = true
      secret.value = ''
      otpauthUrl.value = ''
      form.otp = ''
    } else {
      message.error(res.data?.message || 'OTP không hợp lệ')
    }
  } catch (e) {
    message.error(e?.response?.data?.message || 'OTP không hợp lệ')
  } finally {
    loading.value = false
  }
}

const disable = async () => {
  loading.value = true
  try {
    const res = await AuthApi.twoFADisable({ otp: form.otp })
    if (res.data?.success) {
      message.success('Tắt 2FA thành công')
      enabled.value = false
      form.otp = ''
    } else {
      message.error(res.data?.message || 'OTP không hợp lệ')
    }
  } catch (e) {
    message.error(e?.response?.data?.message || 'OTP không hợp lệ')
  } finally {
    loading.value = false
  }
}

onMounted(loadStatus)
</script>

<style scoped>
</style>


