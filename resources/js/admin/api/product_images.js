import apiClient from '@/config/apiConfig.js'

export const ProductImagesApi = {
    getProductImages: async () => {
        return apiClient.get('/v1/product-images')
    },
    getProductImageById: async (id) => {
        return apiClient.get(`/v1/product-images/${id}`)
    }
}