import apiClient from '@/config/apiConfig.js'

// API: User
export const UserApi = {
    // Lấy toàn bộ user
    getAllUsers: async () => { return apiClient.get('/users-all') },
    // Lấy user phân trang
    getUsersPaginated: async (page = 1, perPage = 10) => {
        return apiClient.get('/users-paginated', { params: { page, per_page: perPage } })
    },
    // Lấy user theo id
    getUserById: async (id) => { return apiClient.get(`/users/${id}`) },
    // Tạo user
    createUser: async (user) => { return apiClient.post('/users', user) },
    // Cập nhật user
    updateUser: async (id, user) => { return apiClient.put(`/users/${id}`, user) },
    // Xóa user
    deleteUser: async (id) => { return apiClient.delete(`/users/${id}`) }
}