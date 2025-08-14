<template>
  <div class="min-h-screen bg-gray-50">
    
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Tạo User mới</h1>
            <p class="mt-2 text-gray-600">Thêm user mới vào hệ thống</p>
          </div>
          <router-link to="/users" class="btn-secondary flex items-center gap-2">
            <ArrowLeft class="w-5 h-5" />
            Quay lại
          </router-link>
        </div>
      </div>

      <!-- Form -->
      <div class="px-4 sm:px-0">
        <div class="card">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name Field -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User class="w-4 h-4" />
                Họ và tên <span class="text-red-500">*</span>
              </label>
              <input 
                id="name"
                type="text" 
                v-model="form.name"
                required
                class="input-field"
                placeholder="Nhập họ và tên"
              />
            </div>

            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail class="w-4 h-4" />
                Email <span class="text-red-500">*</span>
              </label>
              <input 
                id="email"
                type="email" 
                v-model="form.email"
                required
                class="input-field"
                placeholder="Nhập email"
              />
            </div>

            <!-- Role Field -->
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Shield class="w-4 h-4" />
                Vai trò <span class="text-red-500">*</span>
              </label>
              <select 
                id="role"
                v-model="form.role"
                required
                class="input-field"
              >
                <option value="">Chọn vai trò</option>
                <option value="user">User</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <!-- Status Field -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Activity class="w-4 h-4" />
                Trạng thái <span class="text-red-500">*</span>
              </label>
              <select 
                id="status"
                v-model="form.status"
                required
                class="input-field"
              >
                <option value="">Chọn trạng thái</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Lock class="w-4 h-4" />
                Mật khẩu <span class="text-red-500">*</span>
              </label>
              <input 
                id="password"
                type="password" 
                v-model="form.password"
                required
                class="input-field"
                placeholder="Nhập mật khẩu"
                minlength="6"
              />
              <p class="mt-1 text-sm text-gray-500">Mật khẩu phải có ít nhất 6 ký tự</p>
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Lock class="w-4 h-4" />
                Xác nhận mật khẩu <span class="text-red-500">*</span>
              </label>
              <input 
                id="confirmPassword"
                type="password" 
                v-model="form.confirmPassword"
                required
                class="input-field"
                placeholder="Nhập lại mật khẩu"
              />
              <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <router-link to="/users" class="btn-secondary flex items-center gap-2">
                <X class="w-4 h-4" />
                Hủy
              </router-link>
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Loader2 v-if="isSubmitting" class="animate-spin w-4 h-4" />
                <UserPlus v-else class="w-4 h-4" />
                {{ isSubmitting ? 'Đang tạo...' : 'Tạo User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { message } from 'ant-design-vue'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Shield, 
  Activity, 
  Lock, 
  X, 
  Loader2, 
  UserPlus 
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  name: '',
  email: '',
  role: '',
  status: '',
  password: '',
  confirmPassword: ''
})

const isSubmitting = ref(false)

const passwordError = computed(() => {
  if (form.value.confirmPassword && form.value.password !== form.value.confirmPassword) {
    return 'Mật khẩu xác nhận không khớp'
  }
  return ''
})

const handleSubmit = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    return
  }

  isSubmitting.value = true
  
  try {
    const newUser = {
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
      status: form.value.status
    }
    
    userStore.addUser(newUser)
    
    // Chuyển hướng về trang danh sách
    router.push('/users')
  } catch (error) {
    console.error('Lỗi khi tạo user:', error)
    message.error('Lỗi khi tạo user')
  } finally {
    isSubmitting.value = false
    message.success('Tạo user thành công')
    router.push('/users')
  }
}
</script>
