import apiClient from '@/config/apiConfig.js'

export const CategoriesApi = {
    getCategories: async (params = {}) => {
        return apiClient.get('/v1/categories', { params })
    },
    getCategoryById: async (id) => {
        return apiClient.get(`/v1/categories/${id}`)
    },
    createCategory: async (data) => {
        return apiClient.post('/v1/categories', data)
    },
    updateCategory: async (id, data) => {
        return apiClient.put(`/v1/categories/${id}`, data)
    },
    deleteCategory: async (id) => {
        return apiClient.delete(`/v1/categories/${id}`)
    },
    getByUrl: async (url) => apiClient.get(url)
}