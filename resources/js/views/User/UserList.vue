<template>
  <PageTransition aos-animation="slide-in-right" aos-duration="800">
    <div class="min-h-screen bg-gray-50">
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="px-4 py-6 sm:px-0" data-aos="fade-down" data-aos-delay="100">
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

        <!-- Statistics Cards -->
        <div class="px-4 sm:px-0 mb-6" data-aos="fade-up" data-aos-delay="200">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Total Users -->
            <div class="card" data-aos="fade-up" data-aos-delay="300">
              <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <Users class="w-6 h-6 text-blue-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Tổng số User</p>
                  <p class="text-2xl font-bold text-gray-900">{{ userStore.totalUsers }}</p>
                </div>
              </div>
            </div>

            <!-- Active Users -->
            <div class="card" data-aos="fade-up" data-aos-delay="400">
              <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-lg">
                  <div class="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">User Active</p>
                  <p class="text-2xl font-bold text-green-600">{{ userStore.activeUsersCount }}</p>
                </div>
              </div>
            </div>

            <!-- Inactive Users -->
            <div class="card" data-aos="fade-up" data-aos-delay="500">
              <div class="flex items-center">
                <div class="p-2 bg-red-100 rounded-lg">
                  <div class="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">User Inactive</p>
                  <p class="text-2xl font-bold text-red-600">{{ userStore.inactiveUsersCount }}</p>
                </div>
              </div>
            </div>

            <!-- Loaded Users -->
            <div class="card" data-aos="fade-up" data-aos-delay="600">
              <div class="flex items-center">
                <div class="p-2 bg-gray-100 rounded-lg">
                  <div class="w-6 h-6 bg-gray-500 rounded-full"></div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Đã tải</p>
                  <p class="text-2xl font-bold text-gray-900">{{ userStore.users.length }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="px-4 sm:px-0 mb-6" data-aos="fade-up" data-aos-delay="700">
          <div class="card">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1 relative">
                <Search
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                />
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Tìm kiếm user trong table..."
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
        <div class="px-4 sm:px-0" data-aos="fade-up" data-aos-delay="800">
          <div class="card">
            <div class="overflow-x-auto">
              <TableUser :users="filteredUsers" @delete="confirmDelete" />
            </div>

            <!-- Empty State -->
            <AlertUser :filteredUsers="filteredUsers" :searchQuery="searchQuery" :statusFilter="statusFilter" :roleFilter="roleFilter" />

            <!-- Loading State -->
            <LoadingUser v-if="userStore.isFetching && userStore.users.length === 0" />

            <!-- Pagination Info -->
            <div
              v-if="filteredUsers.length > 0"
              class="px-6 py-4 border-t border-gray-200"
            >
              <div
                class="flex items-center justify-between text-sm text-gray-700"
              >
                <div class="flex items-center gap-4">
                  <span>
                    Hiển thị
                    <span class="font-semibold">{{ filteredUsers.length }}</span>
                    user
                  </span>
                  <span
                    v-if="userStore.users.length > perPage"
                    class="text-gray-500"
                  >
                    (Đã tải
                    <span class="font-semibold">{{
                      userStore.users.length
                    }}</span>
                    user)
                  </span>
                </div>
                <div v-if="userStore.hasMore" class="text-blue-600 font-medium">
                  Còn
                  <span class="font-semibold">{{
                    userStore.total - userStore.users.length
                  }}</span>
                  user chưa tải
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
                <Plus class="w-5 h-5 mx-auto" />
                Tải thêm
                {{ Math.min(perPage, userStore.total - userStore.users.length) }}
                user
              </span>
              <span v-else class="flex items-center gap-2">
                <div
                  class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"
                ></div>
                Đang tải...
              </span>
            </button>
          </div>

          <!-- Progress indicator -->
          <div class="mt-4 text-center">
            <div class="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{
                  width: `${Math.min(
                    (userStore.users.length / userStore.total) * 100,
                    100
                  )}%`,
                }"
              ></div>
            </div>
            <p class="text-sm text-gray-600 mt-2">
              {{
                Math.round(
                  Math.min((userStore.users.length / userStore.total) * 100, 100)
                )
              }}% hoàn thành
              <span class="text-blue-600 font-medium">
                ({{ userStore.users.length }}/{{ userStore.total }})
              </span>
            </p>
          </div>

          <!-- Debug info (chỉ hiển thị trong development) -->
          <DebugShow />
        </div>
        <div class="mt-8">
          <h1 class="text-3xl font-bold text-gray-900">Tìm User</h1>
          <p class="mt-2 text-gray-600">Kết quả trả về từ tìm kiếm</p>
        </div>
        <!-- Phần tìm kiếm user bằng tên hoặc email trong toàn bộ hệ thống -->
        <div class="px-4 sm:px-0 mt-6">
          <!-- Search -->
          <div class="px-4 sm:px-0 mb-6">
            <div class="card">
              <form @submit.prevent="onSearchUserAllDB">
                <div class="flex flex-col sm:flex-row gap-4">
                  <div class="flex-1 relative">
                    <Search
                      class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    />
                    <input
                      type="text"
                      v-model="searchQueryAllDB"
                      placeholder="Tìm kiếm user trong toàn bộ database..."
                      class="input-field pl-10 pr-10"
                      @keyup.enter="onSearchUserAllDB"
                    />
                    <!-- Clear button -->
                    <button
                      v-if="searchQueryAllDB"
                      @click="clearSearch"
                      type="button"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    class="btn-primary flex items-center gap-2 px-4 py-2"
                    :disabled="userStore.isFetchingV2"
                  >
                    <span v-if="userStore.isFetchingV2" class="animate-spin mr-2">
                      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    </span>
                    Tìm kiếm
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Loading state cho search -->
          <LoadingUser v-if="userStore.isFetchingV2" />

          <!-- Kết quả search -->
          <div class="card" v-if="resultUser.length > 0">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                Kết quả tìm kiếm: {{ resultUser.length }} user
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Từ khóa: "{{ searchQueryAllDB }}"
              </p>
            </div>
            <div class="overflow-x-auto">
              <TableUser :users="resultUser" @delete="confirmDelete" />
            </div>
          </div>

          <!-- Empty state cho search -->
          <div v-if="!userStore.isFetchingV2 && searchQueryAllDB && resultUser.length === 0" class="card">
            <div class="text-center py-8">
              <Search class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                Không tìm thấy kết quả
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Không có user nào phù hợp với từ khóa "{{ searchQueryAllDB }}"
              </p>
            </div>
          </div>
        </div>
        <!-- Footer -->
        <Footer />
      </main>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <ConfirmShow
          title="Xác nhận xóa"
          description="Bạn có chắc chắn muốn xóa user này không?"
          buttonText="Xóa"
          @cancel="showDeleteModal = false"
          @confirm="deleteUser"
        />
      </div>
    </div>
  </PageTransition>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/userStore.js";
import { message } from "ant-design-vue";
import TableUser from "@/components/User/tableUser.vue";
import LoadingUser from "@/components/User/loadingUser.vue";
import DebugShow from "@/components/UI/DebugShow.vue";
import AlertUser from "@/components/User/alertUser.vue";
import Footer from "@/components/Layout/Footer.vue";
import ConfirmShow from "@/components/UI/ConfirmShow.vue";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  AlertTriangle,
  X,
} from "lucide-vue-next";
import PageTransition from "@/components/UI/PageTransition.vue";

const userStore = useUserStore();
const searchQuery = ref("");
const searchQueryAllDB = ref("")
const statusFilter = ref("");
const roleFilter = ref("");
const showDeleteModal = ref(false);
const userToDelete = ref(null);
const perPage = userStore.perPage;
const resultUser = computed(() => {
  return userStore.userQuery
})
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
watch(
  [searchQuery, statusFilter, roleFilter],
  async (newValues, oldValues) => {
    // Chỉ reset khi thực sự thay đổi giá trị
    if (JSON.stringify(newValues) !== JSON.stringify(oldValues)) {
      console.log("Search/Filter changed, resetting pagination...");
      await userStore.fetchUsers(true);
    }
  },
  { deep: true }
);

// Watch thay đổi trong users để cập nhật statistics
watch(
  () => userStore.users,
  () => {
    console.log("Users changed, statistics will auto-update");
  },
  { deep: true }
);

const confirmDelete = async (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;

  // Focus vào modal
  await nextTick();
  if (confirmModalRef.value) {
    confirmModalRef.value.focusModal();
  }
};

const deleteUser = async () => {
  try {
    if (userToDelete.value) {
      await userStore.deleteUser(userToDelete.value.id);
      showDeleteModal.value = false;
      userToDelete.value = null;
      message.success("Xóa user thành công");
      
      // Refresh statistics sau khi xóa
      userStore.refreshStatistics();
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    message.error("Có lỗi xảy ra khi xóa user");
  }
};

onMounted(async () => {
  // Chỉ nạp dữ liệu nếu store đang trống
  if (!Array.isArray(userStore.users) || userStore.users.length === 0) {
    await userStore.fetchUsers(true);
  }
  // Nếu đã có dữ liệu, không gọi API - giữ nguyên trạng thái store
});

const loadMore = async () => {
  try {
    await userStore.loadMore();
  } catch (error) {
    console.error("Error loading more users:", error);
    // Có thể hiển thị thông báo lỗi cho user
  }
};

// Function search user trong toàn bộ database
const onSearchUserAllDB = async () => {
  try {
    if (!searchQueryAllDB.value || searchQueryAllDB.value.trim() === '') {
      userStore.userQuery = []
      return
    }
    
    await userStore.searchUserInAllDB(searchQueryAllDB.value.trim())
    
    if (userStore.userQuery.length === 0) {
      message.info('Không tìm thấy user nào phù hợp với từ khóa tìm kiếm')
    } else {
      message.success(`Tìm thấy ${userStore.userQuery.length} user phù hợp`)      
    }
    
  } catch (error) {
    console.error('Error searching users:', error)
    message.error('Có lỗi xảy ra khi tìm kiếm user')
  }
}

// Function clear search
const clearSearch = () => {
  searchQueryAllDB.value = ''
  userStore.userQuery = []
}
</script>
