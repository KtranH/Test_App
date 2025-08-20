<template>
  <div class="px-4 sm:px-0 mb-6" data-aos="fade-up" data-aos-delay="200">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card" data-aos="fade-up" data-aos-delay="300">
        <div class="flex items-center">
          <div class="p-2 bg-gray-100 rounded-lg">
            <CheckSquare class="w-6 h-6 text-gray-800" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Tổng Task</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ total || tasks.length }}
            </p>
          </div>
        </div>
      </div>
      <div class="card" data-aos="fade-up" data-aos-delay="400">
        <div class="flex items-center">
          <div class="p-2 bg-gray-100 rounded-lg">
            <div class="w-6 h-6 bg-green-600 rounded-full"></div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Hoàn thành</p>
            <p class="text-2xl font-bold text-green-700">
              {{ completedCount }}
            </p>
          </div>
        </div>
      </div>
      <div class="card" data-aos="fade-up" data-aos-delay="500">
        <div class="flex items-center">
          <div class="p-2 bg-gray-100 rounded-lg">
            <div class="w-6 h-6 bg-yellow-600 rounded-full"></div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Chờ xử lý</p>
            <p class="text-2xl font-bold text-yellow-700">
              {{ pendingCount }}
            </p>
          </div>
        </div>
      </div>
      <div class="card" data-aos="fade-up" data-aos-delay="600">
        <div class="flex items-center">
          <div class="p-2 bg-gray-100 rounded-lg">
            <div class="w-6 h-6 bg-gray-700 rounded-full"></div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Đã tải</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ tasks.length }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckSquare } from "lucide-vue-next";

defineProps({
  total: {
    type: Number,
    default: 0
  },
  tasks: {
    type: Array,
    default: () => []
  },
  completedCount: {
    type: Number,
    default: 0
  },
  pendingCount: {
    type: Number,
    default: 0
  }
});
</script>
