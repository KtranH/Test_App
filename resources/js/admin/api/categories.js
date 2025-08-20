import apiClient from '@/config/apiConfig.js'

export const CategoriesApi = {
    getCategories: async (params = {}) => {
        return apiClient.get('/v1/categories', { params })
    },
    getCategoryById: async (id) => {
        return apiClient.get(`/v1/categories/${id}`)
    },
    getByUrl: async (url) => apiClient.get(url)
}