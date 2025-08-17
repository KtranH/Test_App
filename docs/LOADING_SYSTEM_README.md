# Loading System Documentation

## ** Tổng Quan**

Hệ thống Loading được thiết kế để cung cấp trải nghiệm người dùng tốt hơn khi thực hiện các thao tác bất đồng bộ như chuyển trang, gọi API, hoặc xử lý form.

## **🚀 Tính Năng Chính**

### **1. Global Loading Component**
- **Spinner Animation**: 3 vòng xoay với màu sắc khác nhau
- **Progress Bar**: Hiển thị tiến trình với gradient màu
- **Text Animation**: Ký tự nhảy múa theo thời gian
- **Backdrop Blur**: Hiệu ứng mờ nền
- **Responsive**: Tương thích với mọi kích thước màn hình

### **2. Loading Store (Pinia)**
- **State Management**: Quản lý trạng thái loading toàn cục
- **Multiple Loading**: Hỗ trợ nhiều loading cùng lúc
- **Auto Hide**: Tự động ẩn sau khi hoàn thành
- **Configurable**: Tùy chỉnh text, duration, progress

### **3. Loading Composable**
- **Easy to Use**: API đơn giản và dễ sử dụng
- **Async Wrapper**: Wrapper cho async functions
- **Predefined Types**: Loading cho navigation, API, form

## **📁 Cấu Trúc Files**

```
resources/js/
├── components/UI/
│   ├── Loading.vue          # Loading component chính
│   └── LoadingDemo.vue      # Demo component
├── stores/
│   └── loadingStore.js      # Pinia store
├── composable/
│   └── useLoading.js        # Composable hook
└── App.vue                  # Tích hợp global loading
```

## **🔧 Cách Sử Dụng**

### **1. Sử Dụng Cơ Bản**

```javascript
import { useLoading } from '@/composable/useLoading'

const { showLoading, hideLoading } = useLoading()

// Hiển thị loading
showLoading({
  text: 'Đang xử lý...',
  duration: 2000,
  progress: true
})

// Ẩn loading
hideLoading()
```

### **2. Loading Cho Navigation**

```javascript
const { showNavigationLoading } = useLoading()

// Tự động hiển thị khi chuyển trang
showNavigationLoading()
```

### **3. Loading Cho API Calls**

```javascript
const { showApiLoading } = useLoading()

// Hiển thị loading khi gọi API
showApiLoading('Đang tải dữ liệu...')
```

### **4. Loading Cho Form Submission**

```javascript
const { showFormLoading } = useLoading()

// Hiển thị loading khi submit form
showFormLoading('Đang gửi dữ liệu...')
```

### **5. Loading Wrapper**

```javascript
const { withLoading } = useLoading()

// Wrap async function với loading
const result = await withLoading(
  async () => {
    // Async operation
    const data = await fetchData()
    return data
  },
  {
    text: 'Đang xử lý...',
    duration: 2000,
    progress: true,
    minDelay: 1000
  }
)
```

## **⚙️ Props và Options**

### **Loading Component Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | Boolean | `false` | Hiển thị/ẩn loading |
| `text` | String | `'Loading...'` | Text hiển thị |
| `duration` | Number | `1000` | Thời gian hiển thị (ms) |
| `showProgress` | Boolean | `true` | Hiển thị progress bar |

### **Loading Store Options**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | String | `'Loading...'` | Text hiển thị |
| `duration` | Number | `1000` | Thời gian hiển thị (ms) |
| `progress` | Boolean | `true` | Hiển thị progress bar |
| `minDelay` | Number | `1000` | Thời gian tối thiểu (ms) |

## **🎨 Customization**

### **1. Thay Đổi Style**

```vue
<template>
  <Loading 
    :show="isLoading"
    text="Đang xử lý..."
    :duration="3000"
    :show-progress="false"
  />
</template>
```

### **2. Thay Đổi CSS Variables**

```css
/* Tùy chỉnh màu sắc */
:root {
  --loading-primary: #3b82f6;
  --loading-secondary: #10b981;
  --loading-accent: #f59e0b;
}
```

### **3. Thay Đổi Animation**

```css
/* Tùy chỉnh tốc độ spinner */
.spinner-ring {
  animation: spin 0.8s linear infinite; /* Nhanh hơn */
}
```

## **📱 Responsive Design**

### **Mobile (< 768px)**
- Spinner size: 60x60px
- Text size: 16px
- Progress bar width: 150px

### **Desktop (≥ 768px)**
- Spinner size: 80x80px
- Text size: 18px
- Progress bar width: 200px

## **🔍 Debug và Monitoring**

### **1. Loading Status**
```javascript
const { isLoading, loadingText, loadingDuration } = useLoading()

console.log('Loading:', isLoading.value)
console.log('Text:', loadingText.value)
console.log('Duration:', loadingDuration.value)
```

### **2. Loading Count**
```javascript
const loadingStore = useLoadingStore()
console.log('Active loadings:', loadingStore.loadingCount)
```

### **3. Force Hide**
```javascript
const { forceHideLoading } = useLoading()

// Ẩn tất cả loading ngay lập tức
forceHideLoading()
```

## **🚀 Performance Tips**

### **1. Sử Dụng minDelay**
```javascript
// Đảm bảo loading hiển thị ít nhất 1s
showLoadingWithDelay({
  text: 'Đang xử lý...',
  duration: 500,
  minDelay: 1000
})
```

### **2. Tránh Loading Quá Ngắn**
```javascript
// Không nên hiển thị loading < 300ms
showLoading({
  text: 'Đang xử lý...',
  duration: 300
})
```

### **3. Sử Dụng Progress Bar**
```javascript
// Progress bar giúp user biết thời gian còn lại
showLoading({
  text: 'Đang tải dữ liệu...',
  duration: 2000,
  progress: true
})
```

## **🐛 Troubleshooting**

### **1. Loading Không Hiển Thị**
- Kiểm tra `isLoading` state
- Kiểm tra z-index của loading overlay
- Kiểm tra CSS position và display

### **2. Loading Không Ẩn**
- Kiểm tra `hideLoading()` method
- Kiểm tra `loadingCount` trong store
- Sử dụng `forceHideLoading()` để reset

### **3. Performance Issues**
- Giảm `duration` nếu cần
- Tắt `progress` bar nếu không cần
- Sử dụng `minDelay` hợp lý

## **📚 Examples**

### **1. Login Form**
```javascript
const handleLogin = async () => {
  const { withFormLoading } = useLoading()
  
  await withFormLoading(async () => {
    const response = await loginAPI(credentials)
    // Handle response
  })
}
```

### **2. Data Fetching**
```javascript
const fetchUsers = async () => {
  const { withLoading } = useLoading()
  
  const users = await withLoading(
    async () => {
      return await userAPI.getUsers()
    },
    {
      text: 'Đang tải danh sách người dùng...',
      duration: 1500
    }
  )
}
```

### **3. File Upload**
```javascript
const uploadFile = async (file) => {
  const { showFormLoading, hideLoading } = useLoading()
  
  showFormLoading('Đang tải file lên...')
  
  try {
    await uploadAPI.upload(file)
  } finally {
    hideLoading()
  }
}
```

## **🎯 Best Practices**

1. **Luôn sử dụng loading** cho các thao tác bất đồng bộ
2. **Text rõ ràng** để user biết đang làm gì
3. **Duration hợp lý** (không quá ngắn, không quá dài)
4. **Progress bar** cho các thao tác dài
5. **Error handling** kết hợp với loading
6. **Responsive design** cho mọi thiết bị

## **🔄 Migration Guide**

### **Từ Loading Cũ**
```javascript
// Cũ
this.$loading.show()

// Mới
const { showLoading } = useLoading()
showLoading()
```

### **Từ Loading State**
```javascript
// Cũ
this.isLoading = true

// Mới
const { showLoading, hideLoading } = useLoading()
showLoading()
// ... async operation
hideLoading()
```

---

**Loading System** được thiết kế để dễ sử dụng, hiệu quả và có thể tùy chỉnh. Hãy sử dụng nó để cải thiện trải nghiệm người dùng trong ứng dụng của bạn! 🚀
