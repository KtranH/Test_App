import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

// === CSRF TOKEN MANAGEMENT ===
// COMMENT: Tạm thời comment lại để test SPA không cần CSRF
// Bật lại để xử lý CSRF token mismatch

// COMMENT: Hàm lấy CSRF token mới từ server
// export const refreshCsrfToken = async () => {
//   try {
//     // Gọi đến route csrf của Laravel để lấy token mới
//     const response = await axios.get('/sanctum/csrf-cookie', {
//       withCredentials: true // Quan trọng để cookies được lưu
//     })
    
//     // Lấy token từ cookie để cập nhật header
//     const cookies = document.cookie.split(';')
//     const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
    
//     if (xsrfCookie) {
//       const token = decodeURIComponent(xsrfCookie.trim().substring('XSRF-TOKEN='.length))
//       axios.defaults.headers.common['X-XSRF-TOKEN'] = token
//       apiClient.defaults.headers.common['X-XSRF-TOKEN'] = token
//       return token
//     } else {
//       return null
//     }
//   } catch (error) {
//     return null
//   }
// }

// COMMENT: Hàm để lấy CSRF token từ cookie
// export const getCsrfTokenFromCookie = () => {
//   const cookies = document.cookie.split(';')
//   const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
  
//   if (xsrfCookie) {
//     return decodeURIComponent(xsrfCookie.trim().substring('XSRF-TOKEN='.length))
//   }
  
//   return null
// }

// === API CLIENT CONFIGURATION ===

// Tạo instance axios với cấu hình cho SANCTUM ONLY
// COMMENT: Tạm thời comment lại withCredentials để test SPA không cần CSRF
const apiClient = axios.create({
  baseURL: '/api', // Base URL của API
  timeout: 30000, // Timeout mặc định là 30 giây
  // COMMENT: Tạm thời comment lại để test SPA không cần CSRF
  // withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// === REQUEST INTERCEPTOR - SANCTUM ONLY ===
// COMMENT: Tạm thời comment lại để test SPA không cần CSRF
apiClient.interceptors.request.use(
    config => {
    let token = null;
    
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      token = storedToken;
    }
    
    if (!token) {
      const sessionToken = sessionStorage.getItem('token');
      if (sessionToken) {
        token = sessionToken;
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // COMMENT: Tạm thời comment lại CSRF token để test SPA không cần CSRF
    // const csrfToken = getCsrfTokenFromCookie();
    // if (csrfToken) {
    //   config.headers['X-XSRF-TOKEN'] = csrfToken;
    // }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
)

// === RESPONSE INTERCEPTOR - ERROR HANDLING ===
// Bật lại để xử lý lỗi xác thực và chuyển hướng
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const status = error.response?.status
    const url = error.config?.url
    
    // === 1. XỬ LÝ LỖI CSRF TOKEN MISMATCH (419) ===
    // COMMENT: Tạm thời comment lại để test SPA không cần CSRF
    // if (status === 419) {
    //   // Lưu lại request gốc
    //   const originalRequest = error.config;
      
    //   // Đảm bảo không lặp vô hạn
    //   if (!originalRequest._retry) {
    //     originalRequest._retry = true;
        
    //     try {
    //       // Lấy CSRF token mới
    //       const newToken = await refreshCsrfToken();
          
    //       if (newToken) {
    //         // Cập nhật header với token mới
    //         originalRequest.headers['X-XSRF-TOKEN'] = newToken;
            
    //         // Thử lại request ban đầu với token mới
    //         return apiClient(originalRequest);
    //       }
    //     } catch (refreshError) {
    //       // Silent fail
    //     }
    //   }
    // }
    
    // === 2. XỬ LÝ LỖI VALIDATION (422) ===
    if (status === 422) {
      // Xử lý đặc biệt cho API check khi đã đăng nhập qua Google
      if (url === '/check' && (localStorage.getItem('token') || sessionStorage.getItem('token'))) {
        return Promise.resolve({
          data: {
            authenticated: true,
            user: JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')
          }
        });
      }
    }
    
    // === 3. XỬ LÝ LỖI SANCTUM AUTHENTICATION (401/403) ===
    if (status === 401 || status === 403) {
      // Xử lý đăng xuất bằng cách xóa dữ liệu người dùng
      try {
        // Fallback nếu không thể sử dụng authStore
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        
        // Chỉ thử dùng authStore nếu gọi api bắt buộc đăng nhập
        if (!url?.includes('notifications') && !url?.includes('/user')) {
          try {
            const auth = useAuthStore();
            if (auth && typeof auth.clearAuthData === 'function') {
              auth.clearAuthData();
          }
          } catch (authError) {
            // Silent fail
          }
        }
        
        // Chuyển hướng về trang login nếu đang ở trang yêu cầu xác thực
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      } catch (e) {
        // Silent fail
      }
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient
