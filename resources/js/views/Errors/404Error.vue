<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <!-- Test div để xác nhận component được load -->
    <div class="fixed top-4 left-4 bg-red-500 text-white p-2 rounded text-xs z-50">
      404 Component Loaded!
    </div>
    
    <div class="bg-white rounded-2xl shadow-xl px-8 py-12 flex flex-col items-center animate-fade-in max-w-md w-full">
      <div class="flex items-center mb-6">
        <svg class="w-40 h-20 text-indigo-400 mr-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="3" fill="#f3f4f6"/>
          <text x="50%" y="58%" text-anchor="middle" fill="#6366f1" font-size="2.5rem" font-weight="bold" dy=".3em">404</text>
        </svg>
      </div>
      
      <h1 class="text-4xl font-extrabold text-indigo-600 mb-3 drop-shadow text-center">
        Không tìm thấy trang
      </h1>
      
      <p class="text-base text-gray-500 mb-6 text-center leading-relaxed">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>

      <!-- Hiển thị URL hiện tại để debug -->
      <div class="bg-gray-50 rounded-lg p-3 mb-6 w-full">
        <p class="text-xs text-gray-400 mb-1">URL hiện tại:</p>
        <p class="text-sm text-gray-600 font-mono break-all">{{ currentUrl }}</p>
      </div>

      <!-- Hiển thị thông tin route để debug -->
      <div class="bg-yellow-50 rounded-lg p-3 mb-6 w-full">
        <p class="text-xs text-yellow-600 mb-1">Route Info:</p>
        <p class="text-sm text-yellow-700 font-mono break-all">
          Path: {{ $route.path }}<br>
          Name: {{ $route.name }}<br>
          Component: {{ $route.component ? 'Loaded' : 'Not Loaded' }}
        </p>
      </div>

      <!-- Nút quay lại -->
      <button
        @click="goBack"
        class="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg shadow transition-all duration-200 mb-3 w-full justify-center"
        v-if="canGoBack"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại
      </button>

      <!-- Nút về trang chủ -->
      <router-link
        to="/"
        class="inline-flex items-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow transition-all duration-200 w-full justify-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Về trang chủ
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Lấy URL hiện tại
const currentUrl = computed(() => window.location.href)

// Kiểm tra có thể quay lại không
const canGoBack = computed(() => window.history.length > 1)

// Hàm quay lại trang trước
const goBack = () => {
  if (canGoBack.value) {
    router.go(-1)
  }
}

// Debug khi component được mount
onMounted(() => {
  console.log('🎯 404 Component mounted!')
  console.log('📍 Current route:', route)
  console.log('🔗 Router:', router)
  console.log('🌐 Window location:', window.location.href)
  
  // Thêm class vào body để xác nhận
  document.body.classList.add('404-page-loaded')
})
</script>

<style scoped>
@keyframes fade-in {
  from { 
    opacity: 0; 
    transform: translateY(30px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both;
}

/* Responsive design */
@media (max-width: 640px) {
  .min-h-screen {
    min-height: 100vh;
  }
}
</style>
