import apiClient from '@/config/apiConfig.js'

export const InventoryApi = {
    getInventory: async (params = {}) => {
        return apiClient.get('/v1/inventory', { params })
    },
    getInventoryById: async (id) => {
        return apiClient.get(`/v1/inventory/${id}`)
    },
    getByUrl: async (url) => apiClient.get(url)
}