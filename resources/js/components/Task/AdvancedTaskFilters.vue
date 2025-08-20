<template>
  <div>
    <div class="mt-8">
      <h2 class="text-3xl font-bold text-gray-900 px-4">Tìm Task</h2>
      <p class="mt-2 text-gray-600 px-4">Kết quả trả về từ thanh lọc phụ</p>
    </div>

    <div class="px-4 sm:px-0 mt-6">
      <div class="card">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm theo tên/mô tả task..."
              class="input-field pl-10"
              @keyup.enter="applyFilters"
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <select v-model="selectedStatus" class="input-field w-full sm:w-auto">
              <option value="">Chọn trạng thái</option>
              <option value="all">Tất cả trạng thái</option>
              <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
            </select>
            <select v-model="selectedDateType" class="input-field w-full sm:w-auto">
              <option value="">Không lọc ngày</option>
              <option value="start_date">Ngày bắt đầu</option>
              <option value="end_date">Ngày kết thúc</option>
            </select>
            <select v-if="selectedStatus || selectedDateType" v-model="selectedOrder" class="input-field w-full sm:w-auto">
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
            <input
              v-model="userQuery"
              type="text"
              placeholder="Tìm theo tên user..."
              class="input-field w-full sm:w-auto"
              @keyup.enter="applyFilters"
            />
            <button type="button" class="btn-primary w-full sm:w-auto" :disabled="isFetching" @click="applyFilters">
              <span v-if="!isFetching">Lọc</span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang lọc...
              </span>
            </button>
            <button type="button" class="btn-secondary w-full sm:w-auto" @click="clearFilters">Xóa lọc</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div class="px-4 sm:px-0" v-if="isFetching">
      <div class="card"><div class="py-6 text-center text-gray-500">Đang tải...</div></div>
    </div>

    <!-- Results table -->
    <div class="px-4 sm:px-0" v-if="!isFetching && resultTasks.length > 0">
      <div class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-xs sm:text-sm">
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
                <td class="px-2 sm:px-4 py-2 text-gray-900">{{ task.id }}</td>
                <td class="px-2 sm:px-4 py-2 text-gray-900">{{ task.name }}</td>
                <td class="px-2 sm:px-4 py-2">
                  <span class="inline-block px-2 py-0.5 rounded text-xs border" :class="badgeClass(task.status)">{{ task.status }}</span>
                </td>
                <td class="px-2 sm:px-4 py-2 text-gray-700">{{ task.user?.name || `#${task.user_id}` }}</td>
                <td class="px-2 sm:px-4 py-2 text-gray-700">{{ task.start_date ? (new Date(task.start_date).toLocaleDateString('vi-VN')) : '' }}</td>
                <td class="px-2 sm:px-4 py-2 text-gray-700">{{ task.end_date ? (new Date(task.end_date).toLocaleDateString('vi-VN')) : '' }}</td>
                <td class="px-2 sm:px-4 py-2 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      class="group disabled:opacity-80 disabled:cursor-not-allowed"
                      :disabled="!canEdit(task)"
                      @click="$emit('edit', task)"
                      title="Sửa">
                      <Edit :class="canEdit(task) ? 'text-gray-500 group-hover:text-black transition' : 'text-gray-300'" class="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button class="group disabled:opacity-80 disabled:cursor-not-allowed" :disabled="!canDelete(task)" @click="$emit('delete', task)" title="Xóa">
                      <Trash2 class="w-4 h-4 sm:w-5 sm:h-5" :class="canDelete(task) ? 'text-red-500 group-hover:text-red-700 transition' : 'text-gray-300'" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div class="px-4 sm:px-0" v-if="!isFetching && (searchQuery || selectedStatus || selectedDateType || userQuery) && resultTasks.length === 0">
      <div class="card">
        <div class="text-center py-8">
          <Search class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy kết quả</h3>
          <p class="mt-1 text-sm text-gray-500">Không có task nào phù hợp với điều kiện lọc hiện tại</p>
        </div>
      </div>
    </div>

    <!-- Initial state - khi chưa có filter nào được áp dụng -->
    <div class="px-4 sm:px-0" v-if="!isFetching && !searchQuery && !selectedStatus && !selectedDateType && !userQuery && resultTasks.length === 0">
      <div class="card">
        <div class="text-center py-8">
          <Search class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Chưa có kết quả tìm kiếm</h3>
          <p class="mt-1 text-sm text-gray-500">Hãy sử dụng các bộ lọc bên trên để tìm kiếm task</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Search, Edit, Trash2 } from "lucide-vue-next";

const props = defineProps({
  statuses: {
    type: Array,
    default: () => []
  },
  // Nhận kết quả từ parent component
  resultTasks: {
    type: Array,
    default: () => []
  },
  // Nhận trạng thái loading từ parent component
  isFetching: {
    type: Boolean,
    default: false
  },
  canEdit: {
    type: Function,
    default: () => false
  },
  canDelete: {
    type: Function,
    default: () => false
  }
});

const emit = defineEmits(['applyFilters', 'clearFilters', 'delete', 'edit']);

// Local state cho form inputs
const searchQuery = ref("");
const selectedStatus = ref("");
const selectedDateType = ref("");
const selectedOrder = ref("asc");
const userQuery = ref("");

// Reset các trường phụ khi tìm theo keyword hoặc theo tên user
watch(searchQuery, (val) => {
  if (val && val.length > 0) {
    selectedStatus.value = '';
    selectedDateType.value = '';
    selectedOrder.value = 'asc';
    userQuery.value = '';
  }
});

watch(userQuery, (val) => {
  if (val && val.length > 0) {
    selectedStatus.value = '';
    selectedDateType.value = '';
    selectedOrder.value = 'asc';
    searchQuery.value = '';
  }
});

const applyFilters = async () => {
  // Validation: ít nhất phải có một filter được chọn
  if (!searchQuery.value && !selectedStatus.value && !selectedDateType.value && !userQuery.value) {
    alert('Vui lòng chọn ít nhất một điều kiện lọc');
    return;
  }

  try {
    const filters = {
      searchQuery: searchQuery.value,
      status: selectedStatus.value,
      dateType: selectedDateType.value,
      order: selectedOrder.value,
      userQuery: userQuery.value
    };
    
    emit('applyFilters', filters);
  } catch (e) {
    console.error('Error applying filters:', e);
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  selectedDateType.value = '';
  selectedOrder.value = 'asc';
  userQuery.value = '';
  emit('clearFilters');
};

const badgeClass = (s) => {
  if (s === "completed") return "bg-green-500 text-white font-bold";
  if (s === "in_progress") return "bg-blue-500 text-white font-bold";
  if (s === "cancelled") return "bg-red-500 text-white font-bold";
  return "bg-yellow-500 text-white font-bold";
};
</script>
