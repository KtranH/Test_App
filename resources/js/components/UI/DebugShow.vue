<template>
  <!-- Debug info (chỉ hiển thị trong development) -->
  <div v-if="isDevelopment" class="mt-4 p-4 bg-gray-100 rounded-lg">
    <h4 class="text-sm font-medium text-gray-700 mb-2">Debug Info:</h4>
    <div class="text-xs text-gray-600 space-y-1">
      <p>Offset: {{ userStore.offset ? userStore.offset : taskStore.offset }}</p>
      <p>Total: {{ userStore.total ? userStore.total : taskStore.total }}</p>
      <p>Has More: {{ userStore.hasMore ? userStore.hasMore : taskStore.hasMore }}</p>
      <p>Next URL: {{ userStore.nextUrl ? userStore.nextUrl : taskStore.nextUrl || "None" }}</p>
      <p>Users loaded: {{ userStore.users.length ? userStore.users.length : taskStore.tasks.length }}</p>
      <p>Per Page: {{ perPage }}</p>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/userStore.js";
import { useTaskStore } from "@/stores/taskStore.js";
const userStore = useUserStore();
const taskStore = useTaskStore();
const isDevelopment = true
const perPage = 10
</script>
