<template>
  <div class="px-4 sm:px-0 mb-6" data-aos="fade-up" data-aos-delay="700">
    <div class="card">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm theo tên task..."
            class="input-field pl-10"
            @keyup.enter="$emit('search', searchQuery)"
          />
        </div>
        <div class="flex gap-2">
          <select v-model="selectedStatus" class="input-field w-auto" @change="$emit('statusChange', selectedStatus)">
            <option value="">Tất cả trạng thái</option>
            <option v-for="s in statuses" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
          <button 
            v-if="searchQuery"
            @click="clearSearch"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-200"
            title="Xóa tìm kiếm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Search status indicator -->
      <div v-if="searchQuery" class="mt-3 pt-3 border-t border-gray-200">
        <div class="flex items-center justify-between text-sm">
          <span class="text-blue-600 font-medium">
            Đang tìm kiếm: "{{ searchQuery }}"
          </span>
          <button 
            @click="clearSearch"
            class="text-blue-600 hover:text-blue-800 underline"
          >
            Xóa tìm kiếm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Search } from "lucide-vue-next";

const props = defineProps({
  statuses: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['search', 'statusChange', 'clearSearch']);

const searchQuery = ref("");
const selectedStatus = ref("");

// Reset status khi search thay đổi
watch(searchQuery, (val) => {
  if (val && val.length > 0) {
    selectedStatus.value = "";
    emit('statusChange', "");
  }
});

// Reset search khi status thay đổi
watch(selectedStatus, (val) => {
  if (val && val.length > 0) {
    searchQuery.value = "";
    emit('search', "");
  }
});

const clearSearch = () => {
  searchQuery.value = "";
  emit('clearSearch');
};
</script>
