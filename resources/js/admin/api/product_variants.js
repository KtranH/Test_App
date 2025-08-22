import apiClient from '@/config/apiConfig.js'

export const ProductVariantsApi = {
    getProductVariants: async () => {
        return apiClient.get('/v1/product-variants')
    },
    getProductVariantById: async (id) => {
        return apiClient.get(`/v1/product-variants/${id}`)
    },
    createProductVariant: async (data) => {
        return apiClient.post('/v1/product-variants', data)
    },
    updateProductVariant: async (id, data) => {
        return apiClient.put(`/v1/product-variants/${id}`, data)
    },
    deleteProductVariant: async (id) => {
        return apiClient.delete(`/v1/product-variants/${id}`)
    }
}