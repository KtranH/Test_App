<template>
  <div id="app">
    <!-- Navigation -->
    <Navigation v-if="!isLoginOrRegister" />
    <!-- Content -->
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from '@/components/Layout/Navigation.vue'
// Hàm kiểm tra url không phải là /login hoặc /register để tắt header
const route = useRoute()
const isLoginOrRegister = computed(() => {
  return route.path === '/login' || route.path === '/register' || route.path === '/forgot-password' || route.path === '/reset-password'
})
// App component logic here
</script>

<style>
/* Global styles can be added here */
</style>
