<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 text-black font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400
      hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 hover:text-black"
    @click="goBack"
  >
    <ArrowLeft class="h-5 w-5 transition-colors duration-200 group-hover:text-white" />
    Quay lại
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>   