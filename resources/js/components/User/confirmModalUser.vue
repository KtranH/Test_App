<template>
  <div
    v-if="props.showDeleteModal"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
    >
      <div class="mt-3 text-center">
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
        >
          <AlertTriangle class="h-6 w-6 text-red-600" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mt-4">Xác nhận xóa</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">
            Bạn có chắc chắn muốn xóa user "{{ props.userToDelete?.name }}"
            không? Hành động này không thể hoàn tác.
          </p>
        </div>
        <div class="flex justify-center space-x-3 mt-4">
          <button
            @click="props.showDeleteModal = false"
            class="btn-secondary flex items-center gap-2"
          >
            <X class="w-4 h-4" />
            Hủy
          </button>
          <button
            @click="props.deleteUser"
            class="btn-danger flex items-center gap-2"
          >
            <Trash2 class="w-4 h-4" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X, Trash2, AlertTriangle } from "lucide-vue-next";
const props = defineProps({
  deleteUser: {
    type: Function,
    required: true,
  },
  showDeleteModal: {
    type: Boolean,
    required: true,
  },
  userToDelete: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
</style>