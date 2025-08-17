<template>
  <div v-if="isVisible" class="loading-overlay">
    <div class="loading-container">
      <!-- Spinner chính -->
      <div class="spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      
      <!-- Text loading -->
      <div class="loading-text">
        <span v-for="(char, index) in loadingText" 
              :key="index" 
              class="loading-char"
              :style="{ animationDelay: `${index * 0.1}s` }">
          {{ char }}
        </span>
      </div>
      
      <!-- Progress bar -->
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  show?: boolean
  text?: string
  duration?: number
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  text: 'Loading...',
  duration: 1000,
  showProgress: true
})

const emit = defineEmits<{
  'loading-complete': []
}>()

const isVisible = ref(props.show)
const progress = ref(0)
const loadingText = ref(props.text.split(''))

// Hiển thị loading
const showLoading = () => {
  isVisible.value = true
  progress.value = 0
  
  // Animate progress bar
  if (props.showProgress) {
    const interval = setInterval(() => {
      progress.value += 2
      if (progress.value >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          hideLoading()
        }, 200)
      }
    }, props.duration / 50)
  } else {
    // Nếu không có progress bar, tự động ẩn sau duration
    setTimeout(() => {
      hideLoading()
    }, props.duration)
  }
}

// Ẩn loading
const hideLoading = () => {
  isVisible.value = false
  progress.value = 0
  emit('loading-complete')
}

// Watch props.show
watch(() => props.show, (newValue) => {
  if (newValue) {
    showLoading()
  } else {
    hideLoading()
  }
})

// Expose methods
defineExpose({
  show: showLoading,
  hide: hideLoading
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-in-out;
}

.loading-container {
  text-align: center;
  color: white;
}

/* Spinner Animation */
.spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  border-top-color: #10b981;
  animation-delay: 0.3s;
}

.spinner-ring:nth-child(3) {
  border-top-color: #f59e0b;
  animation-delay: 0.6s;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Loading Text Animation */
.loading-text {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  letter-spacing: 2px;
}

.loading-char {
  display: inline-block;
  animation: bounce 1.4s ease-in-out infinite both;
  color: #3b82f6;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Progress Bar */
.progress-container {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981, #f59e0b);
  border-radius: 2px;
  transition: width 0.1s ease-out;
  animation: progressGlow 2s ease-in-out infinite;
}

@keyframes progressGlow {
  0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
}

/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .spinner {
    width: 60px;
    height: 60px;
  }
  
  .loading-text {
    font-size: 16px;
  }
  
  .progress-container {
    width: 150px;
  }
}
</style>
