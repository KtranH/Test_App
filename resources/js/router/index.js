import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import UserList from '@/views/User/UserList.vue'
import UserCreate from '@/views/User/UserCreate.vue'
import UserEdit from '@/views/User/UserEdit.vue'
import TaskList from '@/views/Task/TaskList.vue'
import TaskCreate from '@/views/Task/TaskCreate.vue'
import TaskEdit from '@/views/Task/TaskEdit.vue'
import ProductList from '@/views/Product/ProductList.vue'
import ProductDetail from '@/views/Product/ProductDetail.vue'
import IconShowcase from '@/components/UI/IconShowcase.vue'
import Login from '@/views/Auth/Login.vue'
import Register from '@/views/Auth/Register.vue'
import EmailVerification from '@/views/Auth/EmailVerification.vue'
import TwoFactorVerify from '@/views/Auth/TwoFactorVerify.vue'
import TwoFactorSettings from '@/views/Dashboard/TwoFactorSettings.vue'
import NotFound from '@/views/Errors/404Error.vue'
import ServerError from '@/views/Errors/500Error.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/tasks',
    name: 'TaskList',
    component: TaskList,
    meta: { requiresAuth: true, transition: 'slide-right' }
  },
  {
    path: '/tasks/create',
    name: 'TaskCreate',
    component: TaskCreate,
    meta: { requiresAuth: true, transition: 'slide-right' }
  },
  {
    path: '/tasks/:id/edit',
    name: 'TaskEdit',
    component: TaskEdit,
    props: true,
    meta: { requiresAuth: true, transition: 'slide-right' }
  },
  {
    path: '/2fa/verify',
    name: 'TwoFactorVerify',
    component: TwoFactorVerify,
    meta: { requiresGuest: true, transition: 'slide-left' }
  },
  {
    path: '/settings/2fa',
    name: 'TwoFactorSettings',
    component: TwoFactorSettings,
    meta: { requiresAuth: true, transition: 'slide-right' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true, transition: 'slide-left' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true, transition: 'slide-left' }
  },
  {
    path: '/email-verification',
    name: 'EmailVerification',
    component: EmailVerification,
    meta: { requiresGuest: true, transition: 'slide-left' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, transition: 'slide-right' }
  },
  {
    path: '/users',
    name: 'UserList',
    component: UserList,
    meta: { requiresAuth: true, transition: 'slide-right' }
  },
  {
    path: '/users/create',
    name: 'UserCreate',
    component: UserCreate,
    meta: { requiresAuth: true, transition: 'slide-right' }
  },
  {
    path: '/users/:id/edit',
    name: 'UserEdit',
    component: UserEdit,
    props: true,
    meta: { requiresAuth: true, transition: 'slide-right' }
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList,
    meta: { requiresAuth: true, transition: 'slide-right' }
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
    meta: { requiresAuth: true, transition: 'slide-right' }
  },
  {
    path: '/icons',
    name: 'IconShowcase',
    component: IconShowcase,
    meta: { requiresAuth: true, transition: 'slide-right' }
  },
  // Route 500 Error - Server Error
  {
    path: '/server-error',
    name: 'ServerError',
    component: ServerError,
    meta: { 
      requiresAuth: false,
      requiresGuest: false,
      transition: 'fade'
    }
  },
  // Route 404 - phải đặt cuối cùng để catch tất cả routes không tồn tại
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { 
      requiresAuth: false, // Không yêu cầu auth
      requiresGuest: false, // Không yêu cầu guest
      transition: 'fade' // Hiệu ứng fade cho 404
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Thêm hiệu ứng chuyển trang mượt mà
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') || sessionStorage.getItem('token')
  
  // Thêm class transition cho body
  document.body.classList.add('page-transitioning')
  
  // Xử lý error routes - luôn cho phép truy cập
  if (to.name === 'NotFound' || to.name === 'ServerError') {
    next()
    return
  }
  
  // Xử lý các routes yêu cầu authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  // Xóa class transition sau khi chuyển trang xong
  setTimeout(() => {
    document.body.classList.remove('page-transitioning')
  }, 300)
})

export default router
