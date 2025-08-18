import apiClient from '@/config/apiConfig.js'

export const AuthApi = {
    // API gửi mã xác thực email
    sendVerificationCode: async (data) => {
        return apiClient.post('/send-verification-code', data)
    },
    // API xác thực mã email và tự động tạo tài khoản
    verifyEmailWithRegistration: async (data) => {
        return apiClient.post('/verify-email-with-registration', data)
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
    },
    // 2FA APIs
    twoFAStatus: async () => apiClient.get('/2fa/status'),
    twoFAInitEnable: async () => apiClient.post('/2fa/init-enable'),
    twoFAConfirmEnable: async (data) => apiClient.post('/2fa/confirm-enable', data),
    twoFADisable: async (data) => apiClient.post('/2fa/disable', data),
    twoFAVerifyLogin: async (data) => apiClient.post('/2fa/verify-login', data)
}