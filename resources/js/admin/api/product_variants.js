import apiClient from '@/config/apiConfig.js'

export const ProductVariantsApi = {
    getProductVariants: async () => {
        return apiClient.get('/v1/product-variants')
    },
    getProductVariantById: async (id) => {
        return apiClient.get(`/v1/product-variants/${id}`)
    }
}