import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore.js";
import { useTaskStore } from "@/stores/taskStore.js";
import { TaskApi } from "@/api/index.js";
import { message } from "ant-design-vue";

export function useTask() {
  const router = useRouter();
  const authStore = useAuthStore();
  const taskStore = useTaskStore();
  
  // State
  const perPage = taskStore.perPage;
  const isFetchingV2 = ref(false);
  const resultTasks = ref([]);
  const showDelete = ref(false);
  const taskSelected = ref(null);
  const checkCreateTask = ref(false);
    
  // Search state
  const isSearching = ref(false);
  const searchQuery = ref("");

  // Computed
  const filteredTasks = computed(() => {
    // Nếu đang tìm kiếm, trả về kết quả tìm kiếm
    if (isSearching.value && resultTasks.value.length > 0) {
      return resultTasks.value;
    }
    // Nếu không tìm kiếm, trả về danh sách gốc
    return taskStore.tasks;
  });

  // Methods
  const init = async () => {
    await authStore.initAuth();
    if (!Array.isArray(taskStore.tasks) || taskStore.tasks.length === 0) {
      await taskStore.fetchTasks(true);
    }
  };

  const onSearch = async (query) => {
    searchQuery.value = query;
    
    if (!query || query.trim() === "") {
      // Reset về danh sách gốc
      isSearching.value = false;
      resultTasks.value = [];
      await taskStore.fetchTasks(true);
      return;
    }
    
    try {
      isSearching.value = true;
      const { data } = await TaskApi.searchTasks(query);
      
      if (Array.isArray(data?.data)) {
        resultTasks.value = data.data;
        if (data.data.length === 0) {
          message.info("Không tìm thấy task phù hợp");
        } else {
          message.success(`Tìm thấy ${data.data.length} task phù hợp`);
        }
      } else {
        resultTasks.value = [];
        message.warning("Dữ liệu trả về không đúng định dạng");
      }
    } catch (e) {
      console.error("Error searching tasks:", e);
      message.error("Có lỗi xảy ra khi tìm kiếm");
      // Fallback: giữ nguyên danh sách gốc
      isSearching.value = false;
      resultTasks.value = [];
    }
  };

  const onStatusChange = (status) => {
    // Handle status change if needed
    console.log('Status changed:', status);
  };

  const applyFiltersSecondary = async (filters) => {
    try {
      isFetchingV2.value = true;
      resultTasks.value = [];
      
      let currentResults = [];
      
      // 1) tìm theo keyword nếu có
      if (filters.searchQuery) {
        const { data } = await TaskApi.searchTasks(filters.searchQuery);
        if (Array.isArray(data?.data)) {
          currentResults = data.data;
        }
      }
      
      // 2) sắp xếp theo ngày nếu chọn
      if (filters.dateType === 'start_date') {
        const { data } = await TaskApi.searchTasksByDate(filters.order);
        if (Array.isArray(data?.data)) {
          currentResults = data.data;
        }
      } else if (filters.dateType === 'end_date') {
        const { data } = await TaskApi.searchTasksByEndDate(filters.order);
        if (Array.isArray(data?.data)) {
          currentResults = data.data;
        }
      }
      
      // 3) lọc theo trạng thái nếu có
      if (filters.status) {
        if (filters.status === 'all') {
          const { data } = await TaskApi.searchTasksByAllStatus();
          if (Array.isArray(data?.data)) {
            currentResults = data.data;
          }
        } else {
          const { data } = await TaskApi.searchTasksByStatus(filters.status, filters.order);
          if (Array.isArray(data?.data)) {
            currentResults = data.data;
          }
        }
      }
      
      // 4) lọc theo user nếu có
      if (filters.userQuery) {
        const { data } = await TaskApi.searchTasksByUser(filters.userQuery);
        if (Array.isArray(data?.data)) {
          currentResults = data.data;
        }
      }
      
      // Cập nhật kết quả cuối cùng
      resultTasks.value = currentResults;
      
    } catch (e) {
      console.error('Error applying filters:', e);
      resultTasks.value = [];
    } finally {
      isFetchingV2.value = false;
    }
  };

  const clearFiltersSecondary = () => {
    resultTasks.value = [];
  };

  const clearSearch = () => {
    searchQuery.value = "";
    isSearching.value = false;
    resultTasks.value = [];
    // Reload danh sách gốc
    taskStore.fetchTasks(true);
  };

  const loadMore = async () => {
    // Chỉ load more khi không đang tìm kiếm
    if (!isSearching.value) {
      await taskStore.loadMore();
    }
  };

  const confirmDelete = (task) => {
    taskSelected.value = task;
    showDelete.value = true;
  };

  const doDelete = async () => {
    const id = taskSelected.value?.id;
    try {
      if (!canDelete(taskSelected.value)) {
        message.warning('Chỉ được xóa task khi trạng thái là pending, completed hoặc cancelled');
        return;
      }
      await taskStore.deleteTask(id);
      
      // Cập nhật cả danh sách gốc và kết quả tìm kiếm
      if (Array.isArray(resultTasks.value) && resultTasks.value.length > 0) {
        resultTasks.value = resultTasks.value.filter(t => t.id !== id);
      }
      
      message.success("Xóa task thành công");
    } catch (e) {
      console.error("Error deleting task:", e);
      message.error("Có lỗi xảy ra khi xóa task");
    } finally {
      showDelete.value = false;
      taskSelected.value = null;
    }
  };

  const confirmEdit = (task) => {
    router.push(`/tasks/${task.id}/edit`);
  };

  const canEdit = (task) => {
    if (authStore.user?.role === 'admin' || authStore.user?.role === 'super_admin') {
      return true;
    }
    return task.user_id === authStore.user?.id && ['pending', 'in_progress', 'cancelled'].includes(task.status) && task
  }
  
  const canDelete = (task) => {
    if (authStore.user?.role === 'admin' || authStore.user?.role === 'super_admin') {
      return true;
    }
    return task.user_id === authStore.user?.id && ['pending', 'completed', 'cancelled'].includes(task.status) && task
  }

  const closeDeleteModal = () => {
    showDelete.value = false;
    taskSelected.value = null;
  };

  const confirmCreateTask = () => {
    router.push('/tasks/create')
  }

  const canCreateTask = async () => {
    if (authStore.user.role === 'admin' || authStore.user.role === 'super_admin') {
      checkCreateTask.value = true;
    } else {
      checkCreateTask.value = false;
    }
  }

  return {
    // Stores
    taskStore,
    authStore,
    
    // State
    perPage,
    isFetchingV2,
    resultTasks,
    showDelete,
    taskSelected,
    checkCreateTask,
    
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
    canEdit,
    canDelete,
    closeDeleteModal,
    confirmCreateTask,
    canCreateTask,
  };
}
