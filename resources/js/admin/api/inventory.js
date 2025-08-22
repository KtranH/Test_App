import apiClient from '@/config/apiConfig.js'

export const InventoryApi = {
    getInventory: async (params = {}) => {
        return apiClient.get('/v1/inventory', { params })
    },
    getInventoryById: async (id) => {
        return apiClient.get(`/v1/inventory/${id}`)
    },
    getByUrl: async (url) => apiClient.get(url),
    createInventory: async (data) => {
        return apiClient.post('/v1/inventory', data)
    },
    updateInventory: async (id, data) => {
        return apiClient.put(`/v1/inventory/${id}`, data)
    },
    deleteInventory: async (id) => {
        return apiClient.delete(`/v1/inventory/${id}`)
    }
}