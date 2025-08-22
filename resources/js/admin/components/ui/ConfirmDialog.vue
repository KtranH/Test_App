<template>
  <dialog ref="dialogRef" class="p-0 rounded-2xl border border-gray-200 shadow-2xl">
    <form method="dialog" class="min-w-[360px] p-6 space-y-4" @submit.prevent>
      <div class="flex items-start gap-3">
        <div class="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
          <AlertTriangle class="h-5 w-5 text-red-600" />
        </div>
        <div class="space-y-1">
          <h3 class="text-lg font-semibold text-gray-900">{{ local.title || title }}</h3>
          <p class="text-sm text-gray-600 whitespace-pre-line">{{ local.message || message }}</p>
        </div>
      </div>

      <div class="pt-2 flex justify-end gap-3">
        <button type="button" class="px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-50" @click="handleCancel">{{ local.cancelText || cancelText }}</button>
        <button type="button" class="px-5 py-2 rounded-xl text-white shadow-lg"
          :class="confirmClass" @click="handleConfirm">{{ local.confirmText || confirmText }}</button>
      </div>
    </form>
  </dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'

const props = defineProps({
  title: { type: String, default: 'Xác nhận' },
  message: { type: String, default: 'Bạn có chắc muốn thực hiện thao tác này?' },
  confirmText: { type: String, default: 'Xóa' },
  cancelText: { type: String, default: 'Hủy' },
  confirmType: { type: String, default: 'danger' }, // danger | primary
})

const dialogRef = ref(null)
const resolver = ref(null)
const local = reactive({ title: '', message: '', confirmText: '', cancelText: '' })

const confirmClass = computed(() =>
  props.confirmType === 'danger'
    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
)

const open = (options = {}) => {
  local.title = options.title || ''
  local.message = options.message || ''
  local.confirmText = options.confirmText || ''
  local.cancelText = options.cancelText || ''

  dialogRef.value?.showModal()
  return new Promise((resolve) => {
    resolver.value = (val) => {
      resolve(val)
      resolver.value = null
    }
  })
}

const close = () => {
  dialogRef.value?.close()
}

const handleConfirm = () => {
  resolver.value?.(true)
  close()
}

const handleCancel = () => {
  resolver.value?.(false)
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
dialog::backdrop {
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
}
</style>


