<template>
  <transition name="fade-scale" appear>
    <div v-if="visible" class="fixed inset-0 z-[100]">
      <div class="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      <div class="absolute inset-0 flex items-center justify-center p-6">
        <div class="relative rounded-2xl bg-white shadow-lg ring-1 ring-black/10 px-6 py-5 w-full max-w-sm text-center">
          <div class="mx-auto flex items-center justify-center gap-3">
            <Loader2 class="h-6 w-6 animate-spin text-black/80" />
            <div class="flex-1">
              <div class="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                <div class="h-full bg-black/70 animate-loading-bar"></div>
              </div>
              <p class="mt-2 text-sm font-medium text-black/70">{{ message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useUiStore } from '@/admin/stores/ui.store'

const ui = useUiStore()
const visible = computed(() => ui.isPageLoading)
const message = computed(() => ui.loadingMessage)
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
.animate-loading-bar {
  position: relative;
  width: 30%;
  animation: loadingMove 1.2s ease-in-out infinite;
}
@keyframes loadingMove {
  0% { width: 10%; transform: translateX(0); }
  50% { width: 80%; transform: translateX(10%); }
  100% { width: 10%; transform: translateX(90%); }
}
</style>


