import apiClient from '@/config/apiConfig.js'

// API: User
export const UserApi = {
    // Lấy user phân trang
    getUsersPaginated: async (offset = 0, limit = 10) => {
        return apiClient.get('/v1/users', { params: { limit, offset } })
    },
    // Tìm user theo tên hoặc email
    searchUser: async (query) => { 
        const encodedQuery = encodeURIComponent(query)
        return apiClient.get(`/v1/users?filters=name lk "${encodedQuery}%" or email lk "${encodedQuery}%"`)
    },
    // Lấy user theo id
    getUserById: async (id) => { return apiClient.get(`/v1/users/${id}`) },
    // Tạo user
    createUser: async (user) => { return apiClient.post('/v1/users', user) },
    // Cập nhật user
    updateUser: async (id, user) => { return apiClient.put(`/v1/users/${id}`, user) },
    // Xóa user
    deleteUser: async (id) => { return apiClient.delete(`/v1/users/${id}`) }
}