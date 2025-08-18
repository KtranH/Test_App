<template>
  <div
    ref="modalRef"
    class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
    tabindex="-1"
  >
    <div class="mt-3 text-center">
      <div
        class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
      >
        <component :is="logo" class="h-6 w-6 text-red-600" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mt-4">{{ title }}</h3>
      <div class="mt-2 px-7 py-3">
        <p class="text-sm text-gray-500">
          {{ description }}
        </p>
      </div>
      <div class="flex justify-center space-x-3 mt-4">
        <button 
          ref="cancelButtonRef"
          @click="emit('cancel')"
          class="btn-secondary flex items-center gap-2"
        >
          <X class="w-4 h-4" />
          Hủy
        </button>
        <button 
          ref="confirmButtonRef"
          @click="emit('confirm')" 
          class="btn-danger flex items-center gap-2"
        >
          <component :is="logo" class="w-4 h-4" />
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from "vue";
import { X, Trash2, AlertTriangle, LogOut, Save } from "lucide-vue-next";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['cancel', 'confirm'])

// Refs cho focus
const modalRef = ref(null)
const cancelButtonRef = ref(null)
const confirmButtonRef = ref(null)

// Xác định logo dựa vào title
const logo = computed(() => {
  if (props.title === 'Xác nhận đăng xuất') {
    return LogOut
  }
  if (props.title === 'Xác nhận xóa') {
    return Trash2
  }
  if (props.title === 'Xác nhận cập nhật') {
    return Save
  }
  return AlertTriangle
})

// Focus vào modal khi component được mount
onMounted(async () => {
  await nextTick()
  if (modalRef.value) {
    modalRef.value.focus()
  }
})

// Expose focus method để parent component có thể gọi
const focusModal = async () => {
  await nextTick()
  if (modalRef.value) {
    modalRef.value.focus()
  }
}

defineExpose({
  focusModal
})
</script>