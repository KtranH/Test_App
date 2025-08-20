import apiClient from '@/config/apiConfig.js'

export const InventoryApi = {
    getInventory: async () => {
        return apiClient.get('/v1/inventory')
    },
    getInventoryById: async (id) => {
        return apiClient.get(`/v1/inventory/${id}`)
    }
}