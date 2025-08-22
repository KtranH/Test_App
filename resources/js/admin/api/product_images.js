import apiClient from '@/config/apiConfig.js'

export const ProductImagesApi = {
    getProductImages: async () => {
        return apiClient.get('/v1/product-images')
    },
    getProductImageById: async (id) => {
        return apiClient.get(`/v1/product-images/${id}`)
    },
    createProductImage: async (data) => {
        return apiClient.post('/v1/product-images', data)
    },
    updateProductImage: async (id, data) => {
        return apiClient.put(`/v1/product-images/${id}`, data)
    },
    deleteProductImage: async (id) => {
        return apiClient.delete(`/v1/product-images/${id}`)
    }
}