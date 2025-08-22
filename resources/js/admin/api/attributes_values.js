import apiClient from '@/config/apiConfig.js'

export const AttributesValuesApi = {
    getAttributesValues: async () => {
        return apiClient.get('/v1/attributes-values')
    },
    getAttributeValuesById: async (id) => {
        return apiClient.get(`/v1/attributes-values/${id}`)
    },
    getAttributeValuesByAttributeId: async (attributeId) => {
        const query = encodeURIComponent(`attribute_id eq "${attributeId}"`)    
        return apiClient.get(`/v1/attributes-values?filters=${query}`)
    },
    getByUrl: async (url) => apiClient.get(url),
    createAttributeValues: async (data) => {
        return apiClient.post('/v1/attributes-values', data)
    },
    updateAttributeValues: async (id, data) => {
        return apiClient.put(`/v1/attributes-values/${id}`, data)
    },
    toggleAttributeValue: async (id, isActive) => {
        return apiClient.put(`/v1/attributes-values/${id}`, { is_active: isActive })
    },
    deleteAttributeValues: async (id) => {
        return apiClient.delete(`/v1/attributes-values/${id}`)
    }
}