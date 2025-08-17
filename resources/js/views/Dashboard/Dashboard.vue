<template>
  <PageTransition aos-animation="slide-in-right" aos-duration="800">
    <div class="min-h-screen bg-gray-50">    
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="px-4 py-6 sm:px-0" data-aos="fade-down" data-aos-delay="100">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="mt-2 text-gray-600">Tổng quan về hệ thống quản lý user</p>
        </div>
        
        <!-- Current User Info -->
        <div class="px-4 sm:px-0 mb-8" data-aos="fade-up" data-aos-delay="150">
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Thông tin tài khoản hiện tại</h2>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">Cập nhật lần cuối:</span>
                <span class="text-sm font-medium text-gray-700">{{ lastUpdated }}</span>
              </div>
            </div>
            
            <div v-if="authStore.isLoading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p class="mt-2 text-gray-500">Đang tải thông tin...</p>
            </div>
            
            <div v-else-if="!currentUser" class="text-center py-8">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p class="text-gray-500 mb-4">Không thể tải thông tin tài khoản</p>
              <button @click="refreshUserInfo" class="btn-primary">
                Thử lại
              </button>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- User Name -->
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-blue-600">Tên</p>
                    <p class="text-lg font-semibold text-blue-900">{{ currentUser.name || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <!-- User Email -->
              <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-green-600">Email</p>
                    <p
                      class="text-lg font-semibold text-green-900 break-words max-w-xs"
                      style="word-break: break-all;"
                    >
                      {{ currentUser.email || 'N/A' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- User Role -->
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-purple-600">Vai trò</p>
                    <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-1" 
                          :class="getRoleBadgeClass(currentUser.role)">
                      {{ formatRole(currentUser.role) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- User Status -->
              <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-orange-600">Trạng thái</p>
                    <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-1" 
                          :class="getStatusBadgeClass(currentUser.status)">
                      {{ formatStatus(currentUser.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Info -->
            <div v-if="currentUser" class="mt-6 pt-6 border-t border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Tạo lúc: {{ formatDate(currentUser.created_at) }}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Cập nhật: {{ formatDate(currentUser.updated_at) }}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Email xác thực: {{ currentUser.email_verified_at ? 'Đã xác thực' : 'Chưa xác thực' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tài liệu toàn bộ API gọi user -->
        <div class="px-4 sm:px-0 mb-8" data-aos="fade-up" data-aos-delay="200">
          <div class="card">
            <ApiUser />
          </div>
        </div>
        
        <!-- Recent Users -->
        <div class="px-4 sm:px-0" data-aos="fade-up" data-aos-delay="300">
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">User gần đây</h2>
              <router-link to="/users" class="btn-primary flex items-center gap-2">
                <Eye class="w-4 h-4" />
                Xem tất cả
              </router-link>
            </div>
            
            <div v-if="userStore.isLoading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p class="mt-2 text-gray-500">Đang tải dữ liệu...</p>
            </div>
            
            <div v-else-if="recentUsers.length === 0" class="text-center py-8">
              <p class="text-gray-500">Không có user nào</p>
            </div>
            
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(user, index) in recentUsers" :key="user.id" class="hover:bg-gray-50"
                      :data-aos="'fade-up'" :data-aos-delay="400 + (index * 100)">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                            :class="getRoleBadgeClass(user.role)">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                            :class="getStatusBadgeClass(user.status)">
                        {{ user.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ user.created_at }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Logout -->
        <div class="px-4 sm:px-0" data-aos="fade-up" data-aos-delay="500">
          <div class="card">
            <button @click="logout" class="btn-danger flex items-center gap-2">
              <LogOut class="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </main>
    </div>
  </PageTransition>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import { Users, CheckCircle, Clock, Eye, LogOut } from 'lucide-vue-next'
import ApiUser from '@/components/User/apiUser.vue'
import PageTransition from '@/components/UI/PageTransition.vue'

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()
const totalUsers = computed(() => userStore.totalUsers || 0)
const activeUsers = computed(() => userStore.activeUsers || [])
const recentUsers = computed(() => {
  if (!Array.isArray(userStore.users)) return []
  return userStore.users.slice(0, 5)
})
const currentUser = computed(() => authStore.currentUser)
const lastUpdated = computed(() => {
  if (!authStore.user?.updated_at) return 'Chưa có dữ liệu'
  return new Date(authStore.user.updated_at).toLocaleString('vi-VN')
})

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800'
    case 'super_admin':
      return 'bg-yellow-100 text-yellow-800'
    case 'user':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusBadgeClass = (status) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-gray-100 text-gray-800'
}

const formatRole = (role) => {
  switch (role) {
    case 'admin':
      return 'Quản trị viên'
    case 'super_admin':
      return 'Quản trị viên cao cấp'
    case 'user':
      return 'Người dùng'
    default:
      return role
  }
}

const formatStatus = (status) => {
  return status === 'active' ? 'Hoạt động' : 'Không hoạt động'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const refreshUserInfo = async () => {
  await authStore.initAuth()
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
  router.push('/login')
}

onMounted(async () => {
  // Khởi tạo auth state và lấy thông tin user hiện tại
  await authStore.initAuth()
  
  // Chỉ nạp dữ liệu nếu store đang trống
  if (!Array.isArray(userStore.users) || userStore.users.length === 0) {
    await userStore.fetchUsers(true)
  }
})
</script>
