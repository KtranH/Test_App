# Hướng Dẫn Sử Dụng Hiệu Ứng Chuyển Trang và AOS

## Tổng Quan

Dự án đã được tích hợp với AOS (Animate On Scroll) và hiệu ứng chuyển trang mượt mà để tạo trải nghiệm người dùng tốt hơn.

## Các Hiệu Ứng Đã Tích Hợp

### 1. Hiệu Ứng Chuyển Trang (Page Transitions)

#### Các Loại Transition:
- **slide-right**: Kéo từ trái qua phải (mặc định cho các trang chính)
- **slide-left**: Kéo từ phải qua trái (cho trang đăng nhập/đăng ký)

#### Cách Sử Dụng:
```vue
<template>
  <PageTransition aos-animation="slide-in-right" aos-duration="800">
    <!-- Nội dung trang -->
  </PageTransition>
</template>

<script setup>
import PageTransition from '@/components/UI/PageTransition.vue'
</script>
```

### 2. Hiệu Ứng AOS (Animate On Scroll)

#### Các Animation Có Sẵn:
- `fade-up`: Hiệu ứng mờ dần từ dưới lên
- `fade-down`: Hiệu ứng mờ dần từ trên xuống
- `fade-left`: Hiệu ứng mờ dần từ phải qua trái
- `fade-right`: Hiệu ứng mờ dần từ trái qua phải
- `slide-in-left`: Kéo từ trái vào
- `slide-in-right`: Kéo từ phải vào
- `slide-in-up`: Kéo từ dưới lên
- `slide-in-down`: Kéo từ trên xuống
- `bounce-in`: Hiệu ứng nảy vào
- `flip-left`: Lật từ trái
- `flip-right`: Lật từ phải

#### Cách Sử Dụng:
```vue
<template>
  <!-- Hiệu ứng cơ bản -->
  <div data-aos="fade-up">Nội dung với hiệu ứng</div>
  
  <!-- Hiệu ứng với delay -->
  <div data-aos="fade-up" data-aos-delay="200">Nội dung với delay</div>
  
  <!-- Hiệu ứng với duration -->
  <div data-aos="fade-up" data-aos-duration="1000">Nội dung với thời gian dài</div>
  
  <!-- Hiệu ứng với offset -->
  <div data-aos="fade-up" data-aos-offset="150">Nội dung với offset</div>
</template>
```

### 3. Hiệu Ứng Hover

#### Các Class Hover:
- `hover-slide-left`: Trượt sang trái khi hover
- `hover-slide-right`: Trượt sang phải khi hover
- `hover-slide-up`: Trượt lên trên khi hover
- `hover-slide-down`: Trượt xuống dưới khi hover

#### Cách Sử Dụng:
```vue
<template>
  <button class="btn-primary hover-slide-right">
    Nút với hiệu ứng hover
  </button>
</template>
```

## Cấu Hình AOS

### Cấu Hình Mặc Định:
```javascript
AOS.init({
    duration: 800,        // Thời gian animation (ms)
    easing: 'ease-in-out', // Kiểu easing
    once: true,           // Chỉ chạy một lần
    mirror: false,        // Không chạy ngược lại
    offset: 100,          // Khoảng cách trigger (px)
    delay: 0              // Delay trước khi chạy (ms)
})
```

### Cấu Hình Tùy Chỉnh:
```javascript
// Trong component
onMounted(() => {
  AOS.init({
    duration: 1000,
    easing: 'ease-out-cubic',
    once: false,
    mirror: true,
    offset: 200,
    delay: 100
  })
})
```

## Tích Hợp Vào Router

### Cấu Hình Route Meta:
```javascript
const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { 
      requiresAuth: true, 
      transition: 'slide-right' 
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      requiresGuest: true, 
      transition: 'slide-left' 
    }
  }
]
```

### Router Guards:
```javascript
router.beforeEach((to, from, next) => {
  // Thêm class transition
  document.body.classList.add('page-transitioning')
  next()
})

router.afterEach((to, from) => {
  // Xóa class transition
  setTimeout(() => {
    document.body.classList.remove('page-transitioning')
  }, 300)
})
```

## Tối Ưu Hóa Hiệu Suất

### 1. Sử Dụng `once: true`:
```javascript
AOS.init({
  once: true  // Chỉ chạy animation một lần
})
```

### 2. Refresh AOS Sau Khi Chuyển Trang:
```javascript
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(() => route.path, () => {
  setTimeout(() => {
    AOS.refresh()
  }, 100)
})
```

### 3. Lazy Loading Components:
```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)
</script>
```

## Ví Dụ Thực Tế

### Dashboard với Hiệu Ứng:
```vue
<template>
  <PageTransition aos-animation="slide-in-right" aos-duration="800">
    <div class="min-h-screen bg-gray-50">
      <!-- Header với hiệu ứng -->
      <div class="px-4 py-6" data-aos="fade-down" data-aos-delay="100">
        <h1 class="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <!-- Cards với hiệu ứng tuần tự -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card" data-aos="fade-up" data-aos-delay="200">
          <!-- Nội dung card -->
        </div>
        <div class="card" data-aos="fade-up" data-aos-delay="300">
          <!-- Nội dung card -->
        </div>
        <div class="card" data-aos="fade-up" data-aos-delay="400">
          <!-- Nội dung card -->
        </div>
      </div>
    </div>
  </PageTransition>
</template>
```

### Form với Hiệu Ứng:
```vue
<template>
  <PageTransition aos-animation="slide-in-left" aos-duration="800">
    <form class="space-y-6">
      <!-- Input fields với hiệu ứng tuần tự -->
      <div data-aos="fade-up" data-aos-delay="100">
        <label>Email</label>
        <input type="email" class="input-field" />
      </div>
      
      <div data-aos="fade-up" data-aos-delay="200">
        <label>Password</label>
        <input type="password" class="input-field" />
      </div>
      
      <button 
        type="submit" 
        class="btn-primary hover-slide-right"
        data-aos="fade-up" 
        data-aos-delay="300"
      >
        Đăng nhập
      </button>
    </form>
  </PageTransition>
</template>
```

## Troubleshooting

### 1. Animation Không Hoạt Động:
- Kiểm tra xem AOS đã được import và khởi tạo chưa
- Đảm bảo element có thuộc tính `data-aos`
- Kiểm tra console để xem có lỗi JavaScript không

### 2. Hiệu Ứng Chuyển Trang Không Mượt:
- Kiểm tra CSS transition classes
- Đảm bảo router-view có key duy nhất
- Kiểm tra z-index của các element

### 3. Performance Issues:
- Giảm số lượng animation đồng thời
- Sử dụng `once: true` cho AOS
- Tối ưu hóa CSS transitions

## Kết Luận

Với việc tích hợp AOS và hiệu ứng chuyển trang, ứng dụng sẽ có trải nghiệm người dùng mượt mà và chuyên nghiệp hơn. Hãy sử dụng các hiệu ứng một cách hợp lý để không làm ảnh hưởng đến hiệu suất và trải nghiệm người dùng.
