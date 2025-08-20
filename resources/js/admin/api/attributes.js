import apiClient from '@/config/apiConfig.js'

export const AttributesApi = {
    getAttributes: async () => {
        return apiClient.get('/v1/attributes')
    },
    getAttributesValues: async (id) => {
        return apiClient.get(`/v1/attributes/${id}?fields=id,name,values{value}`)
    },
    getAttributeById: async (id) => {
        return apiClient.get(`/v1/attributes/${id}`)
    }
}