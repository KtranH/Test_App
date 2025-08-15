import apiClient from '@/config/apiConfig.js'

export const AuthApi = {
    // API register
    register: async (data) => {
        return apiClient.post('/register', data)
    },
    // API login
    login: async (data) => {
        return apiClient.post('/login', data)
    },
    // API logout
    logout: async () => {
        return apiClient.post('/logout')
    },
    // API me
    me: async () => {
        return apiClient.get('/me')
    },
    // API refresh
    refresh: async () => {
        return apiClient.post('/refresh')
    },
    // API update profile
    updateProfile: async (data) => {
        return apiClient.put('/profile', data)
    },
    // API change password
    changePassword: async (data) => {
        return apiClient.post('/change-password', data)
    }
}