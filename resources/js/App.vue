<template>
  <div id="app">
    <!-- Navigation - ẩn khi ở login/register hoặc error routes -->
    <Navigation v-if="shouldShowNavigation" />
    
    <!-- Global Loading Component -->
    <Loading 
      :show="loadingStore.isGlobalLoading"
      :text="loadingStore.currentLoadingText"
      :duration="loadingStore.currentDuration"
      :show-progress="loadingStore.shouldShowProgress"
      @loading-complete="onLoadingComplete"
    />
    
    <!-- Content với hiệu ứng chuyển trang - sử dụng slot props -->
    <router-view v-slot="{ Component, route }">
      <transition 
        :name="getTransitionName(route)" 
        mode="out-in"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <component 
          :is="Component" 
          :key="route.fullPath"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from '@/components/Layout/Navigation.vue'
import Loading from '@/components/UI/Loading.vue'
import { useLoadingStore } from '@/stores/loadingStore'
import AOS from 'aos'

// Hàm kiểm tra url không phải là /login hoặc /register để tắt header
const route = useRoute()
const loadingStore = useLoadingStore()

const isLoginOrRegister = computed(() => {
  return route.path === '/login' || route.path === '/register' || route.path === '/forgot-password' || route.path === '/reset-password' || route.path === '/email-verification'
})

const isErrorRoute = computed(() => {
  return route.name === 'NotFound' || route.name === 'ServerError'
})

const shouldShowNavigation = computed(() => {
  return !isLoginOrRegister.value && !isErrorRoute.value
})

// Xác định tên transition dựa trên route
const getTransitionName = (currentRoute) => {
  if (currentRoute.name === 'NotFound' || currentRoute.name === 'ServerError') {
    return 'fade' // Sử dụng fade transition cho error pages
  }
  return currentRoute.meta?.transition || 'slide-right'
}

// Hiệu ứng chuyển trang
const beforeEnter = (el) => {
  const currentRoute = route
  if (currentRoute.name === 'NotFound' || currentRoute.name === 'ServerError') {
    // Fade transition cho error pages
    el.style.opacity = '0'
  } else {
    // Slide transition cho normal pages
    el.style.transform = 'translateX(-100%)'
    el.style.opacity = '0'
  }
}

const enter = (el, done) => {
  const currentRoute = route
  if (currentRoute.name === 'NotFound' || currentRoute.name === 'ServerError') {
    // Fade transition cho error pages
    el.style.transition = 'opacity 0.3s ease-in-out'
    el.style.opacity = '1'
    
    setTimeout(() => {
      done()
    }, 300)
  } else {
    // Slide transition cho normal pages
    el.style.transition = 'all 0.3s ease-in-out'
    el.style.transform = 'translateX(0)'
    el.style.opacity = '1'
    
    setTimeout(() => {
      // Khởi tạo lại AOS sau khi chuyển trang
      AOS.refresh()
      done()
    }, 300)
  }
}

const leave = (el) => {
  const currentRoute = route
  if (currentRoute.name === 'NotFound' || currentRoute.name === 'ServerError') {
    // Fade transition cho error pages
    el.style.transition = 'opacity 0.3s ease-in-out'
    el.style.opacity = '0'
  } else {
    // Slide transition cho normal pages
    el.style.transition = 'all 0.3s ease-in-out'
    el.style.transform = 'translateX(100%)'
    el.style.opacity = '0'
  }
}

// Khởi tạo AOS khi component mount
import { onMounted } from 'vue'
onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    offset: 100,
    delay: 0
  })
})

// Refresh AOS khi route thay đổi
watch(() => route.path, () => {
  // Hiển thị loading khi chuyển trang (chỉ cho normal routes)
  if (!isErrorRoute.value) {
    loadingStore.showNavigationLoading()
  }
  
  setTimeout(() => {
    AOS.refresh()
  }, 100)
})

// Xử lý khi loading hoàn thành
const onLoadingComplete = () => {
  // Có thể thêm logic xử lý sau khi loading hoàn thành
}
</script>

<style>
/* Global styles */
.page-transitioning {
  overflow: hidden;
}

/* Transition styles */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Fade transition cho error pages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* AOS custom styles */
[data-aos] {
  pointer-events: none;
}

[data-aos].aos-animate {
  pointer-events: auto;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Page transition overlay */
.page-transitioning::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  z-index: 9999;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
}
</style>
