<template>
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
              v-for="task in tasks"
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
                  <button
                    class="group disabled:opacity-20 disabled:cursor-not-allowed"
                    :disabled="!canEdit(task)"
                    @click="$emit('edit', task)"
                    title="Sửa"
                  >
                    <Edit class="w-5 h-5 text-gray-500 group-hover:text-black transition" />
                  </button>
                  <button
                    class="group disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="!canDelete(task)"
                    @click="$emit('delete', task)"
                    title="Xóa"
                  >
                    <Trash2 class="w-5 h-5" :class="canDelete(task) ? 'text-red-500 group-hover:text-red-700 transition' : 'text-gray-300'" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!isFetching && tasks.length === 0">
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
        v-if="isFetching && tasks.length === 0"
        class="p-6 text-center text-gray-500"
      >
        Đang tải...
      </div>

      <!-- Pagination Info -->
      <div
        v-if="tasks.length > 0"
        class="px-6 py-4 border-t border-gray-200"
      >
        <div
          class="flex items-center justify-between text-sm text-gray-700"
        >
          <div class="flex items-center gap-4">
            <span
              >Hiển thị
              <span class="font-semibold">{{ tasks.length }}</span>
              task</span
            >
            <span
              v-if="!isSearching && totalLoaded > perPage"
              class="text-gray-500"
              >(Đã tải
              <span class="font-semibold">{{ totalLoaded }}</span>
              task)</span
            >
            <span
              v-if="isSearching"
              class="text-blue-600 font-medium"
              >Kết quả tìm kiếm</span
            >
          </div>
          <div v-if="!isSearching && hasMore" class="text-gray-900 font-medium">
            Còn
            <span class="font-semibold">{{ (total || 0) - totalLoaded }}</span>
            task chưa tải
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="!isSearching && hasMore" class="px-6 pb-6">
        <button
          type="button"
          class="btn-primary"
          :disabled="isFetching"
          @click="$emit('loadMore')"
        >
          <span v-if="!isFetching">Tải thêm</span>
          <span v-else>Đang tải...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Edit, Trash2 } from "lucide-vue-next";

const props = defineProps({
  user: {
    type: Object,
    default: () => null
  },
  tasks: {
    type: Array,
    default: () => []
  },
  isFetching: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  },
  totalLoaded: {
    type: Number,
    default: 0
  },
  perPage: {
    type: Number,
    default: 20
  },
  hasMore: {
    type: Boolean,
    default: false
  },
  isSearching: {
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

defineEmits(['delete', 'loadMore', 'edit']);

const badgeClass = (s) => {
  if (s === "completed") return "bg-green-500 text-white font-bold";
  if (s === "in_progress") return "bg-blue-500 text-white font-bold";
  if (s === "cancelled") return "bg-red-500 text-white font-bold";
  return "bg-yellow-500 text-white font-bold";
};

const canEdit = (task) => {
  if (props.user.role === 'admin' || props.user.role === 'super_admin') {
    return true;
  }
  return task.user_id === props.user.id && ['pending', 'in_progress', 'cancelled'].includes(task.status) && task
}

const canDelete = (task) => {
  if (props.user.role === 'admin' || props.user.role === 'super_admin') {
    return true;
  }
  return task.user_id === props.user.id && ['pending', 'completed', 'cancelled'].includes(task.status) && task
}
</script>
