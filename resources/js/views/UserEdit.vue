<template>
  <div class="min-h-screen bg-gray-50">
    
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Chỉnh sửa User</h1>
            <p class="mt-2 text-gray-600">Cập nhật thông tin user</p>
          </div>
          <router-link to="/users" class="btn-secondary flex items-center gap-2">
            <ArrowLeft class="w-5 h-5" />
            Quay lại
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="px-4 sm:px-0">
        <div class="card text-center py-12">
          <Loader2 class="animate-spin h-12 w-12 text-gray-400 mx-auto" />
          <p class="mt-4 text-gray-600">Đang tải thông tin user...</p>
        </div>
      </div>

      <!-- Form -->
      <div v-else-if="user" class="px-4 sm:px-0">
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
                disabled
                class="input-field"
                placeholder="Nhập email"
              />
            </div>

            <!-- Role Field -->
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Shield class="w-4 h-4" />
                Vai trò hiện tại: <span>{{ user.role }}</span><span class="text-red-500">*</span>
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
                Trạng thái hiện tại: <span>{{ user.status }}</span><span class="text-red-500">*</span>
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

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <router-link to="/users" class="btn-secondary flex items-center gap-2">
                <X class="w-4 h-4" />
                Hủy
              </router-link>
              
              <!-- Sử dụng Popconfirm để xác nhận cập nhật -->
              <a-popconfirm
                title="Xác nhận cập nhật"
                description="Bạn có chắc chắn muốn cập nhật thông tin user này?"
                ok-text="Có, cập nhật"
                cancel-text="Không, hủy bỏ"
                @confirm="confirmUpdate"
                @cancel="cancelUpdate"
              >
                <a-button 
                  type="primary"
                  :disabled="isSubmitting"
                  class="!rounded-xl !border-0 !shadow-md hover:!shadow-lg !transition-all !duration-300 !bg-black hover:!bg-blue-700 !text-white !font-medium !px-8 !py-3 !h-auto !min-h-[44px] !flex !items-center !gap-2"
                >
                  <Loader2 v-if="isSubmitting" class="animate-spin w-4 h-4" />
                  <Save v-else class="w-4 h-4" />
                  {{ isSubmitting ? 'Đang cập nhật...' : 'Cập nhật User' }}
                </a-button>
              </a-popconfirm>
            </div>
          </form>
        </div>
      </div>

      <!-- User Not Found -->
      <div v-else class="px-4 sm:px-0">
        <div class="card text-center py-12">
          <AlertTriangle class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy user</h3>
          <p class="mt-1 text-sm text-gray-500">User với ID này không tồn tại trong hệ thống.</p>
          <div class="mt-6">
            <router-link to="/users" class="btn-primary flex items-center gap-2 mx-auto w-fit">
              <ArrowLeft class="w-4 h-4" />
              Quay lại danh sách
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Shield, 
  Activity, 
  X, 
  Loader2, 
  Save, 
  AlertTriangle 
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const user = ref(null)
const isLoading = ref(true)
const isSubmitting = ref(false)

const form = ref({
  name: '',
  email: '',
  role: '',
  status: ''
})

onMounted(() => {
  const userId = parseInt(route.params.id)
  user.value = userStore.getUserById(userId)
  
  if (user.value) {
    form.value = {
      name: user.value.name,
      email: user.value.email,
      role: user.value.role,
      status: user.value.status
    }
  }
  
  isLoading.value = false
})

// Xử lý khi user xác nhận cập nhật
const confirmUpdate = async () => {
  if (!user.value) return
  
  isSubmitting.value = true
  
  try {
    await userStore.updateUser(user.value.id, form.value)
    message.success('Cập nhật user thành công!')
    
    // Chuyển hướng về trang danh sách
    router.push('/users')
  } catch (error) {
    console.error('Lỗi khi cập nhật user:', error)
    message.error('Cập nhật user thất bại')
  } finally {
    isSubmitting.value = false
  }
}

// Xử lý khi user hủy bỏ
const cancelUpdate = () => {
  message.info('Đã hủy bỏ việc cập nhật')
}

const handleSubmit = () => {
  // Form validation sẽ được xử lý tự động
  // Popconfirm sẽ hiển thị để xác nhận
}
</script>