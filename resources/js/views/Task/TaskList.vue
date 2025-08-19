<template>
  <PageTransition aos-animation="slide-in-right" aos-duration="800">
    <div class="min-h-screen bg-gray-50">
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Header -->
        <div
          class="px-4 py-6 sm:px-0"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Quản lý Tasks</h1>
              <p class="mt-2 text-gray-600">
                Danh sách tất cả task trong hệ thống
              </p>
            </div>
            <router-link
              to="/tasks/create"
              class="btn-primary flex items-center gap-2"
            >
              <Plus class="w-5 h-5" />
              Tạo Task
            </router-link>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="px-4 sm:px-0 mb-6" data-aos="fade-up" data-aos-delay="200">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="card" data-aos="fade-up" data-aos-delay="300">
              <div class="flex items-center">
                <div class="p-2 bg-gray-100 rounded-lg">
                  <CheckSquare class="w-6 h-6 text-gray-800" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Tổng Task</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ taskStore.total || taskStore.tasks.length }}
                  </p>
                </div>
              </div>
            </div>
            <div class="card" data-aos="fade-up" data-aos-delay="400">
              <div class="flex items-center">
                <div class="p-2 bg-gray-100 rounded-lg">
                  <div class="w-6 h-6 bg-green-600 rounded-full"></div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Hoàn thành</p>
                  <p class="text-2xl font-bold text-green-700">
                    {{ taskStore.completedCount }}
                  </p>
                </div>
              </div>
            </div>
            <div class="card" data-aos="fade-up" data-aos-delay="500">
              <div class="flex items-center">
                <div class="p-2 bg-gray-100 rounded-lg">
                  <div class="w-6 h-6 bg-yellow-600 rounded-full"></div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Chờ xử lý</p>
                  <p class="text-2xl font-bold text-yellow-700">
                    {{ taskStore.pendingCount }}
                  </p>
                </div>
              </div>
            </div>
            <div class="card" data-aos="fade-up" data-aos-delay="600">
              <div class="flex items-center">
                <div class="p-2 bg-gray-100 rounded-lg">
                  <div class="w-6 h-6 bg-gray-700 rounded-full"></div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Đã tải</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ taskStore.tasks.length }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search & Filters -->
        <div class="px-4 sm:px-0 mb-6" data-aos="fade-up" data-aos-delay="700">
          <div class="card">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1 relative">
                <Search
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                />
                <input
                  v-model="q"
                  type="text"
                  placeholder="Tìm theo tên task..."
                  class="input-field pl-10"
                  @keyup.enter="onSearch"
                />
              </div>
              <div class="flex gap-2">
                <select v-model="status" class="input-field w-auto">
                  <option value="">Tất cả trạng thái</option>
                  <option v-for="s in taskStore.statuses" :key="s" :value="s">
                    {{ s }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="px-4 sm:px-0" data-aos="fade-up" data-aos-delay="800">
          <div class="card">
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                    <th class="px-4 py-2 text-left text-gray-500 font-semibold w-16">ID</th>
                    <th class="px-4 py-2 text-left text-gray-500 font-semibold">Tên</th>
                    <th class="px-4 py-2 text-left text-gray-500 font-semibold w-32">Trạng thái</th>
                    <th class="px-4 py-2 text-left text-gray-500 font-semibold">User</th>
                    <th class="px-4 py-2 text-left text-gray-500 font-semibold w-40">Ngày bắt đầu</th>
                    <th class="px-4 py-2 text-left text-gray-500 font-semibold w-40">Ngày kết thúc</th>
                    <th class="px-4 py-2 text-right text-gray-500 font-semibold w-28">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="task in filteredTasks"
                    :key="task.id"
                    class="border-b last:border-0 hover:bg-gray-50 transition"
                  >
                    <td class="px-4 py-2 text-gray-900">{{ task.id }}</td>
                    <td class="px-4 py-2 text-gray-900">
                      <span class="inline-block max-w-[24rem] truncate align-middle" :title="task.name">{{ task.name }}</span>
                    </td>
                    <td class="px-4 py-2">
                      <span
                        class="inline-block px-2 py-0.5 rounded text-xs border capitalize"
                        :class="badgeClass(task.status)"
                      >
                        {{ task.status }}
                      </span>
                    </td>
                    <td class="px-4 py-2 text-gray-700">
                      <span class="inline-flex items-center gap-2 max-w-[20rem] truncate" :title="task.user?.email || ''">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>{{ task.user?.name || `#${task.user_id}` }}</span>
                      </span>
                    </td>
                    <td class="px-4 py-2 text-gray-700">{{ task.start_date ? (new Date(task.start_date).toLocaleDateString('vi-VN')) : '' }}</td>
                    <td class="px-4 py-2 text-gray-700">{{ task.end_date ? (new Date(task.end_date).toLocaleDateString('vi-VN')) : '' }}</td>
                    <td class="px-4 py-2 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <router-link
                          :to="`/tasks/${task.id}/edit`"
                          class="group"
                          title="Sửa"
                        >
                          <Edit class="w-5 h-5 text-gray-500 group-hover:text-black transition" />
                        </router-link>
                        <button
                          class="group disabled:opacity-40 disabled:cursor-not-allowed"
                          :disabled="!canDelete(task)"
                          @click="confirmDelete(task)"
                          title="Xóa"
                        >
                          <Trash2 class="w-5 h-5" :class="canDelete(task) ? 'text-red-500 group-hover:text-red-700 transition' : 'text-gray-300'" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!taskStore.isFetching && filteredTasks.length === 0">
                    <td colspan="7" class="py-8 text-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-2 h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
                        <path d="M9 10h.01M15 10h.01M9.5 15c1.5 1 3.5 1 5 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                      Không có task nào phù hợp
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Loading State -->
            <div
              v-if="taskStore.isFetching && taskStore.tasks.length === 0"
              class="p-6 text-center text-gray-500"
            >
              Đang tải...
            </div>

            <!-- Pagination Info -->
            <div
              v-if="filteredTasks.length > 0"
              class="px-6 py-4 border-t border-gray-200"
            >
              <div
                class="flex items-center justify-between text-sm text-gray-700"
              >
                <div class="flex items-center gap-4">
                  <span
                    >Hiển thị
                    <span class="font-semibold">{{
                      filteredTasks.length
                    }}</span>
                    task</span
                  >
                  <span
                    v-if="taskStore.tasks.length > perPage"
                    class="text-gray-500"
                    >(Đã tải
                    <span class="font-semibold">{{
                      taskStore.tasks.length
                    }}</span>
                    task)</span
                  >
                </div>
                <div v-if="taskStore.hasMore" class="text-gray-900 font-medium">
                  Còn
                  <span class="font-semibold">{{
                    (taskStore.total || 0) - taskStore.tasks.length
                  }}</span>
                  task chưa tải
                </div>
              </div>
            </div>

            <!-- Load More Button -->
            <div v-if="taskStore.hasMore" class="px-6 pb-6">
              <button
                type="button"
                class="btn-primary"
                :disabled="taskStore.isFetching"
                @click="loadMore"
              >
                <span v-if="!taskStore.isFetching">Tải thêm</span>
                <span v-else>Đang tải...</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Secondary search & filters -->
        <div class="mt-8">
          <h2 class="text-3xl font-bold text-gray-900 px-4">Tìm Task</h2>
          <p class="mt-2 text-gray-600 px-4">Kết quả trả về từ thanh lọc phụ</p>
        </div>

        <div class="px-4 sm:px-0 mt-6">
          <div class="card">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1 relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="searchQueryAll"
                  type="text"
                  placeholder="Tìm theo tên/mô tả task..."
                  class="input-field pl-10"
                  @keyup.enter="applyFiltersSecondary"
                />
              </div>
              <div class="flex gap-2">
                <select v-model="status2" class="input-field w-auto">
                  <option value="">Chọn trạng thái</option>
                  <option value="all">Tất cả trạng thái</option>
                  <option v-for="s in taskStore.statuses" :key="s" :value="s">{{ s }}</option>
                </select>
                <select v-model="dateType2" class="input-field w-auto">
                  <option value="">Không lọc ngày</option>
                  <option value="start_date">Ngày bắt đầu</option>
                  <option value="end_date">Ngày kết thúc</option>
                </select>
                <select v-if="status2 || dateType2" v-model="order2" class="input-field w-auto">
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
                <input
                  v-model="userQuery"
                  type="text"
                  placeholder="Tìm theo tên user..."
                  class="input-field w-auto"
                  @keyup.enter="applyFiltersSecondary"
                />
                <button type="button" class="btn-primary" :disabled="isFetchingV2" @click="applyFiltersSecondary">
                  <span v-if="!isFetchingV2">Lọc</span>
                  <span v-else>Đang lọc...</span>
                </button>
                <button type="button" class="btn-secondary" @click="clearFiltersSecondary">Xóa lọc</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Secondary loading state -->
        <div class="px-4 sm:px-0" v-if="isFetchingV2">
          <div class="card"><div class="py-6 text-center text-gray-500">Đang tải...</div></div>
        </div>

        <!-- Secondary results table -->
        <div class="px-4 sm:px-0" v-if="!isFetchingV2 && resultTasks.length > 0">
          <div class="card">
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="px-4 py-2 text-left text-gray-500 font-semibold">ID</th>
                    <th class="px-4 py-2 text-left text-gray-500 font-semibold">Tên</th>
                    <th class="px-4 py-2 text-left text-gray-500 font-semibold">Trạng thái</th>
                    <th class="px-4 py-2 text-left text-gray-500 font-semibold">User</th>
                    <th class="px-4 py-2 text-left text-gray-500 font-semibold">Ngày bắt đầu</th>
                    <th class="px-4 py-2 text-left text-gray-500 font-semibold">Ngày kết thúc</th>
                    <th class="px-4 py-2 text-right text-gray-500 font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="task in resultTasks" :key="task.id" class="border-b last:border-0 hover:bg-gray-50 transition">
                    <td class="px-4 py-2 text-gray-900">{{ task.id }}</td>
                    <td class="px-4 py-2 text-gray-900">{{ task.name }}</td>
                    <td class="px-4 py-2">
                      <span class="inline-block px-2 py-0.5 rounded text-xs border" :class="badgeClass(task.status)">{{ task.status }}</span>
                    </td>
                    <td class="px-4 py-2 text-gray-700">{{ task.user?.name || `#${task.user_id}` }}</td>
                    <td class="px-4 py-2 text-gray-700">{{ task.start_date ? (new Date(task.start_date).toLocaleDateString('vi-VN')) : '' }}</td>
                    <td class="px-4 py-2 text-gray-700">{{ task.end_date ? (new Date(task.end_date).toLocaleDateString('vi-VN')) : '' }}</td>
                    <td class="px-4 py-2 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <router-link :to="`/tasks/${task.id}/edit`" class="group" title="Sửa">
                          <Edit class="w-5 h-5 text-gray-500 group-hover:text-black transition" />
                        </router-link>
                        <button class="group disabled:opacity-40 disabled:cursor-not-allowed" :disabled="!canDelete(task)" @click="confirmDelete(task)" title="Xóa">
                          <Trash2 class="w-5 h-5" :class="canDelete(task) ? 'text-red-500 group-hover:text-red-700 transition' : 'text-gray-300'" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Secondary empty state -->
        <div class="px-4 sm:px-0" v-if="!isFetchingV2 && (searchQueryAll || status2 || dateType2) && resultTasks.length === 0">
          <div class="card">
            <div class="text-center py-8">
              <Search class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy kết quả</h3>
              <p class="mt-1 text-sm text-gray-500">Không có task nào phù hợp với điều kiện lọc hiện tại</p>
            </div>
          </div>
        </div>
        <!-- Footer -->
        <Footer />
      </main>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDelete"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <ConfirmShow
          title="Xác nhận xóa"
          description="Bạn có chắc chắn muốn xóa task này không?"
          buttonText="Xóa"
          @cancel="showDelete = false"
          @confirm="doDelete"
        />
      </div>
    </div>
  </PageTransition>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useTaskStore } from "@/stores/taskStore.js";
import { TaskApi } from "@/api/index.js";
import { message } from "ant-design-vue";
import PageTransition from "@/components/UI/PageTransition.vue";
import ConfirmShow from "@/components/UI/ConfirmShow.vue";
import Footer from "@/components/Layout/Footer.vue";
import DebugShow from "@/components/UI/DebugShow.vue";
import { Plus, Search, CheckSquare, Edit, Trash2 } from "lucide-vue-next";

const taskStore = useTaskStore();
const q = ref("");
const status = ref("");
const perPage = taskStore.perPage;

// Secondary bar state
const searchQueryAll = ref("")
const status2 = ref("")
const dateType2 = ref("")
const order2 = ref("asc")
const userQuery = ref("")
const isFetchingV2 = ref(false)
const resultTasks = ref([])

const showDelete = ref(false);
const taskSelected = ref(null);

onMounted(async () => {
  if (!Array.isArray(taskStore.tasks) || taskStore.tasks.length === 0) {
    await taskStore.fetchTasks(true);
  }
});

// Reset các trường phụ khi tìm theo keyword hoặc theo tên user
watch(searchQueryAll, (val) => {
  if (val && val.length > 0) {
    status2.value = ''
    dateType2.value = ''
    order2.value = 'asc'
    userQuery.value = ''
  }
})

watch(userQuery, (val) => {
  if (val && val.length > 0) {
    status2.value = ''
    dateType2.value = ''
    order2.value = 'asc'
    searchQueryAll.value = ''
  }
})

const filteredTasks = computed(() => {
  let list = taskStore.tasks;
  if (q.value) {
    const s = q.value.toLowerCase();
    list = list.filter((t) => t.name?.toLowerCase().includes(s));
  }
  if (status.value) {
    list = list.filter((t) => t.status === status.value);
  }
  return list;
});

const onSearch = async () => {
  if (!q.value) {
    await taskStore.fetchTasks(true);
    return;
  }
  try {
    const { data } = await TaskApi.searchTasks(q.value)
    taskStore.tasks = Array.isArray(data?.data) ? data.data : []
    if (taskStore.tasks.length === 0) {
      message.info("Không tìm thấy task phù hợp");
    }
  } catch (e) {
    // fallback: giữ nguyên danh sách
  }
};

// Secondary bar behavior
const applyFiltersSecondary = async () => {
  try {
    isFetchingV2.value = true
    resultTasks.value = []
    // 1) tìm theo keyword nếu có
    if (searchQueryAll.value) {
      const { data } = await TaskApi.searchTasks(searchQueryAll.value)
      resultTasks.value = Array.isArray(data?.data) ? data.data : []
    }
    // 2) sắp xếp theo ngày nếu chọn
    if (dateType2.value === 'start_date') {
      const { data } = await TaskApi.searchTasksByDate(order2.value)
      resultTasks.value = Array.isArray(data?.data) ? data.data : resultTasks.value
    } else if (dateType2.value === 'end_date') {
      const { data } = await TaskApi.searchTasksByEndDate(order2.value)
      resultTasks.value = Array.isArray(data?.data) ? data.data : resultTasks.value
    }
    // 3) lọc theo trạng thái nếu có
    if (status2.value) {
      if (status2.value === 'all') {
        const { data } = await TaskApi.searchTasksByAllStatus()
        resultTasks.value = Array.isArray(data?.data) ? data.data : resultTasks.value
      } else {
        const { data } = await TaskApi.searchTasksByStatus(status2.value, order2.value)
        resultTasks.value = Array.isArray(data?.data) ? data.data : resultTasks.value
      }
    }
    // 4) lọc theo user nếu có
    if (userQuery.value) {
      const { data } = await TaskApi.searchTasksByUser(userQuery.value)
      resultTasks.value = Array.isArray(data?.data) ? data.data : resultTasks.value
    }
  } catch (e) {
  } finally {
    isFetchingV2.value = false
  }
}

const clearFiltersSecondary = () => {
  searchQueryAll.value = ''
  status2.value = ''
  dateType2.value = ''
  order2.value = 'asc'
  userQuery.value = ''
  resultTasks.value = []
}

const loadMore = async () => {
  await taskStore.loadMore();
};

const confirmDelete = (task) => {
  taskSelected.value = task;
  showDelete.value = true;
};

const doDelete = async () => {
  const id = taskSelected.value?.id
  try {
    if (!canDelete(taskSelected.value)) {
      message.warning('Chỉ được xóa task khi trạng thái là pending, completed hoặc cancelled')
      return
    }
    await taskStore.deleteTask(id)
    if (Array.isArray(resultTasks.value) && resultTasks.value.length > 0) {
      resultTasks.value = resultTasks.value.filter(t => t.id !== id)
    }
    message.success("Xóa task thành công")
  } catch (e) {
    console.error("Error deleting task:", e)
    message.error("Có lỗi xảy ra khi xóa task")
  } finally {
    showDelete.value = false
    taskSelected.value = null
  }
}

const badgeClass = (s) => {
  if (s === "completed") return "bg-green-500 text-white font-bold";
  if (s === "in_progress") return "bg-blue-500 text-white font-bold";
  if (s === "cancelled") return "bg-red-500 text-white font-bold";
  return "bg-yellow-500 text-white font-bold";
};

const canDelete = (task) => {
  return task && ['pending', 'completed', 'cancelled'].includes(task.status)
}
</script>

<style scoped>
/* Giữ trắng đen, tối giản */
</style>


