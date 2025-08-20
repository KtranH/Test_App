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
            <button
              class="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="!checkCreateTask"
              @click="confirmCreateTask"
            >
              <Plus class="w-5 h-5" />
              Tạo Task
            </button>
          </div>
        </div>

        <!-- Statistics Cards -->
        <TaskStatistics
          :total="taskStore.total"
          :tasks="taskStore.tasks"
          :completed-count="taskStore.completedCount"
          :pending-count="taskStore.pendingCount"
        />

        <!-- Search & Filters -->
        <TaskFilters
          :statuses="taskStore.statuses"
          @search="onSearch"
          @status-change="onStatusChange"
          @clear-search="clearSearch"
        />

        <!-- Main Table -->
        <TaskTable
          :user="authStore.user"
          :tasks="filteredTasks"
          :is-fetching="taskStore.isFetching"
          :total="taskStore.total"
          :total-loaded="taskStore.tasks.length"
          :per-page="perPage"
          :has-more="taskStore.hasMore"
          :is-searching="isSearching"
          :can-edit="canEdit"
          :can-delete="canDelete"
          @delete="confirmDelete"
          @edit="confirmEdit"
          @load-more="loadMore"
        />

        <!-- Advanced Filters -->
        <AdvancedTaskFilters
          :statuses="taskStore.statuses"
          :result-tasks="resultTasks"
          :is-fetching="isFetchingV2"
          :can-edit="canEdit"
          :can-delete="canDelete"
          @apply-filters="applyFiltersSecondary"
          @clear-filters="clearFiltersSecondary"
          @delete="confirmDelete"
          @edit="confirmEdit"
        />

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
          @cancel="closeDeleteModal"
          @confirm="doDelete"
        />
      </div>
    </div>
  </PageTransition>
</template>

<script setup>
import { onMounted, toRaw } from "vue";
import { Plus } from "lucide-vue-next";
import { useTask } from "@/composable/useTask.js";
import PageTransition from "@/components/UI/PageTransition.vue";
import ConfirmShow from "@/components/UI/ConfirmShow.vue";
import Footer from "@/components/Layout/Footer.vue";
import TaskStatistics from "@/components/Task/TaskStatistics.vue";
import TaskFilters from "@/components/Task/TaskFilters.vue";
import TaskTable from "@/components/Task/TaskTable.vue";
import AdvancedTaskFilters from "@/components/Task/AdvancedTaskFilters.vue";

// Sử dụng composable
const {
  // Stores
  taskStore,
  authStore,
  
  // State
  perPage,
  isFetchingV2,
  resultTasks,
  showDelete,
  taskSelected,
  
  // Search state
  isSearching,
  searchQuery,
  
  // Computed
  filteredTasks,
  
  // Methods
  init,
  onSearch,
  onStatusChange,
  applyFiltersSecondary,
  clearFiltersSecondary,
  clearSearch,
  loadMore,
  confirmDelete,
  doDelete,
  confirmEdit,
  closeDeleteModal,
  confirmCreateTask,
  checkCreateTask,
  canEdit,
  canDelete
} = useTask();

onMounted(async () => {
  await authStore.initAuth();
  await init();
});
</script>

<style scoped>
/* Giữ trắng đen, tối giản */
</style>


