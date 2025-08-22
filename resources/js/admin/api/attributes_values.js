import apiClient from '@/config/apiConfig.js'

export const AttributesValuesApi = {
    getAttributesValues: async () => {
        return apiClient.get('/v1/attributes-values')
    },
    getAttributeValuesById: async (id) => {
        return apiClient.get(`/v1/attributes-values/${id}`)
    },
    getAttributeValuesByAttributeId: async (attributeId) => {
        return apiClient.get(`/v1/attributes/${attributeId}`)
    },
    createAttributeValues: async (data) => {
        return apiClient.post('/v1/attributes-values', data)
    },
    updateAttributeValues: async (id, data) => {
        return apiClient.put(`/v1/attributes-values/${id}`, data)
    },
    deleteAttributeValues: async (id) => {
        return apiClient.delete(`/v1/attributes-values/${id}`)
    }
}