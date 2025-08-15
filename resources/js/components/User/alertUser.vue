<template>
  <div
    v-if="filteredUsers.length === 0 && !userStore.isFetching"
    class="text-center py-12"
  >
    <Users class="mx-auto h-12 w-12 text-gray-400" />
    <h3 class="mt-2 text-sm font-medium text-gray-900">Không có user nào</h3>
    <p class="mt-1 text-sm text-gray-500">
      {{
        searchQuery || statusFilter || roleFilter
          ? "Không tìm thấy user nào phù hợp với bộ lọc."
          : "Bắt đầu bằng cách tạo user đầu tiên."
      }}
    </p>
    <div class="mt-6">
      <router-link
        to="/users/create"
        class="btn-primary flex items-center gap-2 mx-auto w-fit"
      >
        <Plus class="w-4 h-4" />
        Thêm User
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { Plus } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore.js'
const userStore = useUserStore()
const props = defineProps({
  filteredUsers: {
    type: Array,
    required: true
  },
  searchQuery: {
    type: String,
    required: true
  },
  statusFilter: {
    type: String,
    required: true
  },
  roleFilter: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
</style>