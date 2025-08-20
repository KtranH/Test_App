<template>
  <div class="min-h-screen bg-white text-black flex">
    <AdminSidebar />
    <div class="flex-1 flex flex-col">
      <AdminHeader />
      <main class="p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AdminHeader from '@/admin/components/layout/AdminHeader.vue'
import AdminSidebar from '@/admin/components/layout/AdminSidebar.vue'
</script>

<style scoped>
</style>
