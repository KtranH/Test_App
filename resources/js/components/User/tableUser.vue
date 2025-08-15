<template>
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Name
        </th>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Email
        </th>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Role
        </th>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Status
        </th>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Created
        </th>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Actions
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">
            {{ user.name }}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-500">{{ user.email }}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="getRoleBadgeClass(user.role)"
          >
            {{ user.role }}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="getStatusBadgeClass(user.status)"
          >
            {{ user.status }}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {{ user.created_at }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div class="flex space-x-2">
            <router-link
              :to="`/users/${user.id}/edit`"
              class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 p-1 rounded hover:bg-indigo-50"
              title="Chỉnh sửa"
            >
              <Edit class="w-4 h-4" />
            </router-link>
            <!-- Delete user -->
            <button
              class="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded hover:bg-red-50"
              title="Xóa"
              @click="onDelete(user)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  AlertTriangle,
  X,
} from "lucide-vue-next";
const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
  onDelete: {
    type: Function,
    required: true,
  },
});

const getRoleBadgeClass = (role) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "super_admin":
      return "bg-yellow-100 text-yellow-800";
    case "user":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusBadgeClass = (status) => {
  return status === "active"
    ? "bg-green-100 text-green-800"
    : "bg-gray-100 text-gray-800";
};
</script>

<style scoped>
</style>