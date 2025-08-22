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
    getByUrl: async (url) => apiClient.get(url),
    createAttribute: async (data) => {
        return apiClient.post('/v1/attributes', data)
    },
    updateAttribute: async (id, data) => {
        return apiClient.put(`/v1/attributes/${id}`, data)
    },
    deleteAttribute: async (id) => {
        return apiClient.delete(`/v1/attributes/${id}`)
    },
    disableAttribute: async (id, data) => {
        return apiClient.put(`/v1/attributes/${id}`, data)
    }
}