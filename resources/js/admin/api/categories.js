import apiClient from '@/config/apiConfig.js'

export const CategoriesApi = {
    getCategories: async () => {
        return apiClient.get('/v1/categories')
    },
    getCategoryById: async (id) => {
        return apiClient.get(`/v1/categories/${id}`)
    }
}