<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="text-sm font-semibold tracking-tight flex items-center gap-2">
        <Images class="h-4 w-4" />
        Ảnh sản phẩm
      </div>
      <label class="inline-flex items-center gap-2 cursor-pointer px-3 py-1.5 border border-black/15 rounded-lg bg-white hover:bg-black/5 transition-colors text-xs font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
        </svg>
        Thêm ảnh
        <input type="file" multiple accept="image/*" class="hidden" @change="onFiles" />
      </label>
    </div>
    <div v-if="productImages.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="img in productImages"
        :key="img.id"
        class="relative group border border-black/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
      >
        <img
          :src="img.url"
          :alt="img.alt"
          class="w-full h-36 object-cover bg-black/5"
        />
        <div
          class="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/40 via-black/10 to-transparent"
        >
          <div class="flex items-center justify-between gap-2 p-2">
            <button
              class="flex items-center gap-1 px-2 py-1 text-xs rounded bg-white/90 border border-black/10 font-medium hover:bg-black/10 transition"
              :class="img.isCover ? 'text-black font-bold border-black/30' : 'text-black/60'"
              @click="setCover(productId, img.id)"
              :disabled="img.isCover"
            >
              <svg v-if="img.isCover" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="9" stroke-width="1.5" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="9" stroke-width="1.5" />
              </svg>
              {{ img.isCover ? 'Ảnh chính' : 'Đặt làm chính' }}
            </button>
            <button
              class="flex items-center gap-1 px-2 py-1 text-xs rounded bg-white/90 border border-black/10 text-red-600 hover:bg-red-50 transition"
              @click="removeImage(img.id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Xóa
            </button>
          </div>
        </div>
        <div
          v-if="img.isCover"
          class="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold pointer-events-none select-none"
        >
          Ảnh chính
        </div>
      </div>
    </div>
    <div v-else class="text-xs text-black/50 text-center py-6">
      Chưa có ảnh nào cho sản phẩm này.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMediaStore } from '@/admin/stores/media.store'
import { Images } from 'lucide-vue-next'

const props = defineProps({ productId: { type: String, required: true } })
const media = useMediaStore()

const productImages = computed(() => {
  const images = media.images.filter(i => i.productId === props.productId).sort((a, b) => a.position - b.position)
  return images
})

const onFiles = (e) => {
  const files = Array.from(e.target.files || [])
  files.forEach((f, idx) => media.addImage(props.productId, f, { position: productImages.value.length + idx }))
}

const { removeImage, setCover } = media
</script>


