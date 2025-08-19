import apiClient from '@/config/apiConfig.js'

// API: Task
export const TaskApi = {
  // Lấy tasks phân trang (Froiden Rest API dùng limit/offset)
  getTasksPaginated: async (offset = 0, limit = 10) => {
    return apiClient.get('/v1/tasks', { params: { limit, offset } })
  },

  // Tìm task theo tên (tùy chọn)
  // Tìm theo name hoặc description
  searchTasks: async (query) => {
    const encoded = encodeURIComponent(query)
    return apiClient.get(`/v1/tasks?filters=name lk "%${encoded}%"`)
  },
  //Tìm kiếm theo trạng thái task
  searchTasksByStatus: async (query) => {
    const encoded = encodeURIComponent(`status lk "${query}%"`)
    return apiClient.get(`/v1/tasks?filters=${encoded}`)
  },
  // Tìm kiếm tất cả trạng thái
  searchTasksByAllStatus: async () => {
    return apiClient.get('/v1/tasks')
  },
  // Tìm theo ngày start_date tăng dần, giảm dần
  searchTasksByDate: async (typeOrder) => {
    const encoded = encodeURIComponent(`order=start_date ${typeOrder}`)
    return apiClient.get(`/v1/tasks?${encoded}`)
  },
  // Tìm theo ngày end_date tăng dần, giảm dần
  searchTasksByEndDate: async (typeOrder) => {
    const encoded = encodeURIComponent(`order=end_date ${typeOrder}`)
    return apiClient.get(`/v1/tasks?${encoded}`)
  },
  // Tìm task theo tên của user
  searchTasksByUser: async (query) => {
    return apiClient.get('/v1/tasks', { params: { name: query } })
  },

  // Lấy task theo id
  getTaskById: async (id) => {
    return apiClient.get(`/v1/tasks/${id}`)
  },

  // Tạo task
  createTask: async (payload) => {
    return apiClient.post('/v1/tasks', payload)
  },

  // Cập nhật task
  updateTask: async (id, payload) => {
    return apiClient.put(`/v1/tasks/${id}`, payload)
  },
  // Xóa task
  deleteTask: async (id) => {
    return apiClient.delete(`/v1/tasks/${id}`)
  }
}


