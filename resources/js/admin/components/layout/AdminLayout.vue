<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 text-gray-900">
    <!-- Fixed Sidebar -->
    <AdminSidebar />
    
    <!-- Main Content Area -->
    <div class="md:ml-64">
      <!-- Fixed Header -->
      <AdminHeader/>
      <div class="h-14"></div>
      <!-- Scrollable Main Content -->
      <main class="pt-14 p-6 lg:p-8">
        <div class="mx-auto w-full max-w-[1400px]">
          <RouterView />
        </div>
      </main>
    </div>
    
    <LoadingOverlay />
  </div>
</template>

<script setup>
import { RouterView, useRouter } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import AdminHeader from '@/admin/components/layout/AdminHeader.vue'
import AdminSidebar from '@/admin/components/layout/AdminSidebar.vue'
import LoadingOverlay from '@/admin/components/ui/LoadingOverlay.vue'
import { useUiStore } from '@/admin/stores/ui.store'

const router = useRouter()
const ui = useUiStore()

let removeBeforeEach = null
let removeAfterEach = null

onMounted(() => {
  const before = (to, from, next) => {
    if (to.path.startsWith('/admin')) {
      ui.startLoading('Đang tải trang quản trị...')
    }
    next()
  }
  const after = () => {
    // Nhẹ nhàng để người dùng kịp thấy animation
    setTimeout(() => ui.stopLoading(), 250)
  }
  removeBeforeEach = router.beforeEach(before)
  removeAfterEach = router.afterEach(after)
})

onUnmounted(() => {
  // vue-router v4 trả về hàm unregister cho beforeEach/afterEach
  if (typeof removeBeforeEach === 'function') removeBeforeEach()
  if (typeof removeAfterEach === 'function') removeAfterEach()
})
</script>

<style scoped>
/* Đảm bảo layout hoạt động mượt mà */
</style>
