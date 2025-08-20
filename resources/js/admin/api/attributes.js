import apiClient from '@/config/apiConfig.js'

export const AttributesApi = {
    getAttributes: async (params = {}) => {
        return apiClient.get('/v1/attributes', { params })
    },
    getAttributesValues: async (id) => {
        return apiClient.get(`/v1/attributes/${id}?fields=id,name,values{value}`)
    },
    getAttributeById: async (id) => {
        return apiClient.get(`/v1/attributes/${id}`)
    },
    getByUrl: async (url) => apiClient.get(url)
}