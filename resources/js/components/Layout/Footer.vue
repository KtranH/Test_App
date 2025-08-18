<template>
  <!-- Footer -->
  <div class="text-center mt-6">
    <!-- Logout -->
    <div class="px-4 sm:px-0" data-aos="fade-up" data-aos-delay="500">
      <div class="card">
        <button @click="confirmLogout" class="btn-danger flex items-center gap-2">
          <LogOut class="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </div>
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <ConfirmShow
        title="Xác nhận đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất không?"
        buttonText="Đăng xuất"
        @cancel="showDeleteModal = false"
        @confirm="logout"
      />
    </div>
    <p class="text-gray-500 text-sm" data-aos="fade-up" data-aos-delay="500">© 2025. Tất cả quyền được bảo lưu.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import ConfirmShow from '@/components/UI/ConfirmShow.vue'

const authStore = useAuthStore()
const router = useRouter()
const showDeleteModal = ref(false)

const confirmLogout = () => {
  showDeleteModal.value = true
}
const logout = () => {
  authStore.logout()
}
</script>
