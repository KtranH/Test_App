import apiClient from '@/config/apiConfig.js'

export const ProductsApi = {
    getProducts: async () => {
        return apiClient.get('/v1/products')
    },
    getProductById: async (id) => {
        return apiClient.get(`/v1/products/${id}`)
    }
}