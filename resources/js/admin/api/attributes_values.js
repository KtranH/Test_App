import apiClient from '@/config/apiConfig.js'

export const AttributesValuesApi = {
    getAttributesValues: async () => {
        return apiClient.get('/v1/attributes-values')
    },
    getAttributeValuesById: async (id) => {
        return apiClient.get(`/v1/attributes-values/${id}`)
    }
}