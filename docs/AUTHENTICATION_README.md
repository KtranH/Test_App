# Hệ Thống Authentication

## Tổng Quan
Hệ thống authentication hoàn chỉnh với đăng nhập, đăng ký và quản lý phiên đăng nhập, sử dụng Pinia store và Vue Router với meta guards.

## Tính Năng Chính

### 1. **Đăng Nhập (Login)**
- **Form Fields**: Email, Password, Remember Me
- **Validation**: Email format, password length
- **Social Login**: Google, Facebook (placeholder)
- **Loading States**: Spinner và disabled states
- **Error Handling**: User-friendly error messages

### 2. **Đăng Ký (Register)**
- **Form Fields**: Full Name, Email, Phone, Password, Confirm Password
- **Validation**: 
  - Password strength (8+ chars, uppercase, lowercase, number, special char)
  - Password confirmation match
  - Phone number format
  - Terms & conditions agreement
- **Social Register**: Google, Facebook (placeholder)

### 3. **Authentication Store**
- **State Management**: User info, token, authentication status
- **Persistence**: localStorage cho token và user data
- **Actions**: Login, Register, Logout, Profile Update
- **Auto-init**: Tự động kiểm tra auth state khi khởi tạo

### 4. **Route Protection**
- **Auth Guards**: Bảo vệ routes yêu cầu đăng nhập
- **Guest Guards**: Chuyển hướng user đã đăng nhập khỏi login/register
- **Auto-redirect**: Tự động chuyển hướng dựa trên auth status

## Cấu Trúc Files

### Views
```
resources/js/views/
├── Login.vue          # Trang đăng nhập
├── Register.vue       # Trang đăng ký
└── Dashboard.vue      # Trang chính (yêu cầu auth)
```

### Stores
```
resources/js/stores/
└── authStore.js       # Quản lý authentication state
```

### Router
```
resources/js/router/
└── index.js           # Route configuration với meta guards
```

## Cách Sử Dụng

### 1. **Import Auth Store**
```javascript
import { useAuthStore } from '@/stores/authStore.js'

const authStore = useAuthStore()
```

### 2. **Login User**
```javascript
try {
  await authStore.login({
    email: 'user@example.com',
    password: 'password123'
  })
  // Redirect to dashboard
} catch (error) {
  // Handle error
}
```

### 3. **Register User**
```javascript
try {
  await authStore.register({
    fullName: 'Nguyễn Văn A',
    email: 'user@example.com',
    phone: '0123456789',
    password: 'Password123!',
    confirmPassword: 'Password123!'
  })
  // Redirect to login
} catch (error) {
  // Handle error
}
```

### 4. **Check Auth Status**
```javascript
const isLoggedIn = authStore.isLoggedIn
const currentUser = authStore.currentUser
```

### 5. **Logout**
```javascript
authStore.logout()
// Redirect to login
```

## Styling & Design

### Color Scheme
- **Primary**: Black (#111827) và Gray (#374151)
- **Background**: Gradient từ gray-900 đến black
- **Cards**: White với shadow và rounded corners
- **Accents**: Blue cho links, Green/Red cho status

### UI Components
- **Ant Design**: Form components, buttons, inputs
- **Custom Styling**: Deep selectors để override Ant Design themes
- **Responsive**: Mobile-first design với Tailwind CSS
- **Animations**: Smooth transitions và hover effects

### Visual Elements
- **Icons**: SVG icons cho form fields
- **Gradients**: Background gradients cho modern look
- **Shadows**: Layered shadows cho depth
- **Typography**: Clear hierarchy với font weights

## Security Features

### 1. **Password Requirements**
- Minimum 8 characters
- Uppercase letter
- Lowercase letter
- Number
- Special character

### 2. **Form Validation**
- Client-side validation với Ant Design rules
- Custom validators cho password confirmation
- Real-time validation feedback

### 3. **Token Management**
- JWT token storage trong localStorage
- Auto-refresh token (TODO)
- Secure logout với token cleanup

## API Integration

### 1. **Current Implementation**
- Mock API calls với setTimeout
- Simulated responses
- Error handling structure

### 2. **Future Implementation**
```javascript
// Replace mock calls with real API
const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials)
  const { token, user } = response.data
  
  // Update store state
  setAuthData(token, user)
}
```

### 3. **API Endpoints**
```
POST /api/auth/login      # Đăng nhập
POST /api/auth/register   # Đăng ký
POST /api/auth/logout     # Đăng xuất
GET  /api/auth/me         # Lấy thông tin user
PUT  /api/auth/profile    # Cập nhật profile
POST /api/auth/password   # Đổi mật khẩu
```

## Route Protection

### 1. **Meta Fields**
```javascript
{
  path: '/dashboard',
  meta: { requiresAuth: true }    // Yêu cầu đăng nhập
}

{
  path: '/login',
  meta: { requiresGuest: true }   // Chỉ cho guest
}
```

### 2. **Guard Implementation**
```javascript
// TODO: Implement route guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})
```

## Social Authentication

### 1. **Google OAuth**
- Placeholder implementation
- Future: Google OAuth 2.0 integration
- User profile sync

### 2. **Facebook OAuth**
- Placeholder implementation
- Future: Facebook Login integration
- Permission handling

## Error Handling

### 1. **Form Validation Errors**
- Field-specific error messages
- Real-time validation feedback
- User-friendly error descriptions

### 2. **API Errors**
- Network error handling
- Server error responses
- Fallback error messages

### 3. **User Feedback**
- Success messages
- Error notifications
- Loading states

## Future Enhancements

### 1. **Advanced Security**
- Two-factor authentication (2FA)
- Password reset functionality
- Account lockout after failed attempts
- Session management

### 2. **User Experience**
- Remember me functionality
- Auto-login với refresh tokens
- Profile picture upload
- Email verification

### 3. **Integration**
- Real OAuth providers
- SSO integration
- Role-based access control
- Audit logging

## Testing

### 1. **Unit Tests**
- Store actions testing
- Form validation testing
- Component rendering tests

### 2. **Integration Tests**
- Authentication flow testing
- Route protection testing
- API integration testing

### 3. **E2E Tests**
- Complete user journey testing
- Cross-browser compatibility
- Mobile responsiveness

## Deployment

### 1. **Environment Variables**
```env
VITE_API_BASE_URL=https://api.example.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

### 2. **Build Optimization**
- Code splitting cho auth routes
- Lazy loading components
- Bundle size optimization

### 3. **Security Headers**
- CSP headers
- HSTS implementation
- XSS protection
