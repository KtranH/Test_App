import apiClient from '@/config/apiConfig.js'

export const ProductsApi = {
    getProducts: async (params = {}) => {
        return apiClient.get('/v1/products', { params })
    },
    getProductById: async (id) => {
        return apiClient.get(`/v1/products/${id}`)
    },
    getByUrl: async (url) => {
        // Cho phép truyền absolute URL từ meta.paging.links.next
        return apiClient.get(url)
    }
}