<template>
  <PageTransition />
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
    <div class="bg-white rounded-2xl shadow-xl px-8 py-12 flex flex-col items-center animate-fade-in max-w-md w-full">
      <div class="flex items-center mb-6">
        <svg class="w-20 h-20 text-red-400 mr-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="3" fill="#fef2f2"/>
          <text x="50%" y="58%" text-anchor="middle" fill="#ef4444" font-size="2.5rem" font-weight="bold" dy=".3em">500</text>
        </svg>
      </div>
      
      <h1 class="text-4xl font-extrabold text-red-600 mb-3 drop-shadow text-center">
        Lỗi máy chủ
      </h1>
      
      <p class="text-base text-gray-500 mb-6 text-center leading-relaxed">
        Xin lỗi, đã xảy ra lỗi nội bộ. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
      </p>

      <!-- Nút thử lại -->
      <button
        @click="reloadPage"
        class="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow transition-all duration-200 mb-3 w-full justify-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Thử lại
      </button>

      <!-- Nút về trang chủ -->
      <router-link
        to="/"
        class="inline-flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition-all duration-200 w-full justify-center"
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
import PageTransition from '@/components/UI/PageTransition.vue'

// Hàm reload trang
const reloadPage = () => {
  window.location.reload()
}
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
