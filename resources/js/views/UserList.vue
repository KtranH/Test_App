<template>
  <div class="min-h-screen bg-gray-50">

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Quản lý User</h1>
            <p class="mt-2 text-gray-600">
              Danh sách tất cả user trong hệ thống
            </p>
          </div>
          <router-link
            to="/users/create"
            class="btn-primary flex items-center gap-2"
          >
            <Plus class="w-5 h-5" />
            Thêm User
          </router-link>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="px-4 sm:px-0 mb-6">
        <div class="card">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 relative">
              <Search
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              />
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Tìm kiếm user..."
                class="input-field pl-10"
              />
            </div>
            <div class="flex gap-2">
              <select v-model="statusFilter" class="input-field w-auto">
                <option value="">Tất cả status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select v-model="roleFilter" class="input-field w-auto">
                <option value="">Tất cả role</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="px-4 sm:px-0">
        <div class="card">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="user in filteredUsers"
                  :key="user.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getRoleBadgeClass(user.role)"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusBadgeClass(user.status)"
                    >
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.created_at }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <router-link
                        :to="`/users/${user.id}/edit`"
                        class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 p-1 rounded hover:bg-indigo-50"
                        title="Chỉnh sửa"
                      >
                        <Edit class="w-4 h-4" />
                      </router-link>
                      <button
                        @click="confirmDelete(user)"
                        class="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                        title="Xóa"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="filteredUsers.length === 0 && !userStore.isFetching" class="text-center py-12">
            <Users class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              Không có user nào
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ searchQuery || statusFilter || roleFilter ? 'Không tìm thấy user nào phù hợp với bộ lọc.' : 'Bắt đầu bằng cách tạo user đầu tiên.' }}
            </p>
            <div class="mt-6">
              <router-link
                to="/users/create"
                class="btn-primary flex items-center gap-2 mx-auto w-fit"
              >
                <Plus class="w-4 h-4" />
                Thêm User
              </router-link>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="userStore.isFetching && userStore.users.length === 0" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              Đang tải dữ liệu...
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Vui lòng chờ trong giây lát
            </p>
          </div>

          <!-- Pagination Info -->
          <div v-if="filteredUsers.length > 0" class="px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between text-sm text-gray-700">
              <div class="flex items-center gap-4">
                <span>
                  Hiển thị <span class="font-semibold">{{ filteredUsers.length }}</span> user
                </span>
                <span v-if="userStore.users.length > perPage" class="text-gray-500">
                  (Đã tải <span class="font-semibold">{{ userStore.users.length }}</span> user)
                </span>
              </div>
              <div v-if="userStore.hasMore" class="text-blue-600 font-medium">
                Còn <span class="font-semibold">{{ userStore.total - userStore.users.length }}</span> user chưa tải
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div class="px-4 sm:px-0 mt-6" v-if="userStore.hasMore">
        <div class="flex justify-center">
          <button
            class="btn-secondary flex items-center gap-2 px-8 py-3 text-base font-medium hover:bg-blue-600 hover:text-white transition-all duration-200"
            :disabled="userStore.isFetching"
            @click="loadMore"
          >
            <span v-if="!userStore.isFetching">
              <Plus class="w-5 h-5" />
              Tải thêm {{ Math.min(perPage, userStore.total - userStore.users.length) }} user
            </span>
            <span v-else class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              Đang tải...
            </span>
          </button>
        </div>
        
        <!-- Progress indicator -->
        <div class="mt-4 text-center">
          <div class="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${Math.min((userStore.users.length / userStore.total) * 100, 100)}%` }"
            ></div>
          </div>
          <p class="text-sm text-gray-600 mt-2">
            {{ Math.round(Math.min((userStore.users.length / userStore.total) * 100, 100)) }}% hoàn thành
            <span class="text-blue-600 font-medium">
              ({{ userStore.users.length }}/{{ userStore.total }})
            </span>
          </p>
        </div>
        
        <!-- Debug info (chỉ hiển thị trong development) -->
        <div v-if="isDevelopment" class="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Debug Info:</h4>
          <div class="text-xs text-gray-600 space-y-1">
            <p>Offset: {{ userStore.offset }}</p>
            <p>Total: {{ userStore.total }}</p>
            <p>Has More: {{ userStore.hasMore }}</p>
            <p>Next URL: {{ userStore.nextUrl || 'None' }}</p>
            <p>Users loaded: {{ userStore.users.length }}</p>
            <p>Per Page: {{ perPage }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
      >
        <div class="mt-3 text-center">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
          >
            <AlertTriangle class="h-6 w-6 text-red-600" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Xác nhận xóa</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa user "{{ userToDelete?.name }}" không?
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div class="flex justify-center space-x-3 mt-4">
            <button
              @click="showDeleteModal = false"
              class="btn-secondary flex items-center gap-2"
            >
              <X class="w-4 h-4" />
              Hủy
            </button>
            <button
              @click="deleteUser"
              class="btn-danger flex items-center gap-2"
            >
              <Trash2 class="w-4 h-4" />
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/userStore.js";
import { message } from "ant-design-vue";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  AlertTriangle,
  X,
} from "lucide-vue-next";
const userStore = useUserStore();
const searchQuery = ref("");
const statusFilter = ref("");
const roleFilter = ref("");
const showDeleteModal = ref(false);
const userToDelete = ref(null);
const perPage = userStore.perPage;

const filteredUsers = computed(() => {
  let users = userStore.users;

  if (searchQuery.value) {
    users = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (statusFilter.value) {
    users = users.filter((user) => user.status === statusFilter.value);
  }

  if (roleFilter.value) {
    users = users.filter((user) => user.role === roleFilter.value);
  }

  return users;
});

// Watch search và filter để reset phân trang
watch([searchQuery, statusFilter, roleFilter], async (newValues, oldValues) => {
  // Chỉ reset khi thực sự thay đổi giá trị
  if (JSON.stringify(newValues) !== JSON.stringify(oldValues)) {
    console.log('Search/Filter changed, resetting pagination...')
    await userStore.fetchUsers(true);
  }
}, { deep: true });

const getRoleBadgeClass = (role) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "super_admin":
      return "bg-yellow-100 text-yellow-800";
    case "user":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusBadgeClass = (status) => {
  return status === "active"
    ? "bg-green-100 text-green-800"
    : "bg-gray-100 text-gray-800";
};

const confirmDelete = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const deleteUser = () => {
  if (userToDelete.value) {
    userStore.deleteUser(userToDelete.value.id);
    showDeleteModal.value = false;
    userToDelete.value = null;
  }
};

onMounted(async () => {
  // Chỉ nạp dữ liệu nếu store đang trống
  if (!Array.isArray(userStore.users) || userStore.users.length === 0) {
    await userStore.fetchUsers(true)
  }
  // Nếu đã có dữ liệu, không gọi API - giữ nguyên trạng thái store
})

const loadMore = async () => {
  try {
    await userStore.loadMore()
  } catch (error) {
    console.error('Error loading more users:', error)
    // Có thể hiển thị thông báo lỗi cho user
  }
}

const isDevelopment = import.meta.env.DEV;
</script>
