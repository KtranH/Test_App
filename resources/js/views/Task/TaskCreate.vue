<template>
  <PageTransition aos-animation="slide-in-right" aos-duration="800">
    <div class="min-h-screen bg-gray-50">
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0" data-aos="fade-down" data-aos-delay="100">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Tạo Task</h1>
              <p class="mt-2 text-gray-600">Nhập thông tin task</p>
            </div>
            <router-link to="/tasks" class="btn-secondary">Quay lại</router-link>
          </div>
        </div>
        <div class="px-4 sm:px-0">
          <div class="card max-w-full">
            <form class="space-y-4" @submit.prevent="onSubmit">
              <div>
                <label class="block text-sm text-gray-700 mb-1">Tên</label>
                <input v-model="form.name" type="text" required class="input-field" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Mô tả</label>
                <textarea v-model="form.description" rows="4" class="input-field"></textarea>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm text-gray-700 mb-1">Trạng thái</label>
                  <select v-model="form.status" class="input-field">
                    <option v-for="s in taskStore.statuses" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
                <div class="relative col-span-2" ref="userBox">
                  <label class="block text-sm text-gray-700 mb-1">Người dùng</label>
                  <input
                    v-model="userSearch"
                    type="text"
                    autocomplete="off"
                    placeholder="Nhập tên hoặc email để tìm..."
                    class="input-field w-full px-4 py-2 text-base"
                    style="min-width: 320px; max-width: 100%;"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': invalidUser }"
                    @input="onSearchInput"
                    @focus="onInputFocus"
                  />
                  <ul
                    v-if="showSuggestions"
                    class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-auto"
                  >
                    <li
                      v-for="u in userResults"
                      :key="u.id"
                      class="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                      @click="selectUser(u)"
                    >
                      <div class="font-medium">{{ u.name }}</div>
                      <div class="text-gray-500">{{ u.email }}</div>
                    </li>
                    <li v-if="userResults.length === 0" class="px-3 py-2 text-gray-500 text-sm">Không có kết quả</li>
                  </ul>
                  <p v-if="selectedUser" class="mt-1 text-xs text-gray-500">Đã chọn: {{ selectedUser.name }} (ID: {{ selectedUser.id }})</p>
                  <p v-else-if="invalidUser" class="mt-1 text-xs text-red-600">Vui lòng chọn người dùng từ gợi ý</p>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-700 mb-1">Start date</label>
                  <input v-model="form.start_date" type="date" required class="input-field" :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': isStartTooEarly }" :min="minStart" />
                </div>
                <div>
                  <label class="block text-sm text-gray-700 mb-1">End date</label>
                  <input v-model="form.end_date" type="date" required class="input-field" :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': isDateInvalid }" :min="form.start_date || undefined" />
                  <p v-if="isDateInvalid" class="mt-1 text-xs text-red-600">Ngày kết thúc không được trước ngày bắt đầu</p>
                  <p v-if="isStartTooEarly" class="mt-1 text-xs text-red-600">Ngày bắt đầu không được nhỏ hơn hiện tại</p>
                </div>
              </div>
              <div class="flex items-center gap-3 pt-2">
                <router-link to="/tasks" class="btn-secondary">Hủy</router-link>
                <button :disabled="taskStore.isSubmitting || !isFormValid" type="submit" class="btn-primary">
                  <span v-if="!taskStore.isSubmitting">Lưu</span>
                  <span v-else>Đang lưu...</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  </PageTransition>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore.js'
import { useUserStore } from '@/stores/userStore.js'
import PageTransition from '@/components/UI/PageTransition.vue'
import Footer from '@/components/Layout/Footer.vue'
import { message } from 'ant-design-vue'

const router = useRouter()
const taskStore = useTaskStore()
const userStore = useUserStore()

const nowLocal = () => new Date().toISOString().slice(0,10)
const addMinutesLocal = (baseIsoLocal, minutes) => {
  try {
    const d = new Date()
    d.setMinutes(d.getMinutes() + minutes)
    return d.toISOString().slice(0,10)
  } catch (_) {
    const d = new Date()
    d.setMinutes(d.getMinutes() + minutes)
    return d.toISOString().slice(0,10)
  }
}

const form = reactive({
  name: '',
  description: '',
  status: 'pending',
  user_id: null,
  start_date: nowLocal(),
  end_date: nowLocal()
})

// Autocomplete user
const userSearch = ref('')
const userResults = computed(() => Array.isArray(userStore.userQuery) ? userStore.userQuery : [])
const selectedUser = computed(() => {
  const list = Array.isArray(userStore.users) ? userStore.users : []
  return list.find(u => u.id === form.user_id) || null
})
const invalidUser = computed(() => {
  // Bắt buộc phải có user_id hợp lệ từ gợi ý
  return !(form.user_id && Number.isInteger(Number(form.user_id)) && Number(form.user_id) > 0)
})
let searchTimer = null
const onSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer)
  // Khi người dùng gõ tay -> vô hiệu hóa lựa chọn trước đó
  form.user_id = null
  searchTimer = setTimeout(() => {
    userStore.searchUserInAllDB(userSearch.value)
    showSuggestions.value = !!userSearch.value
  }, 300)
}
const selectUser = (u) => {
  form.user_id = u.id
  userSearch.value = `${u.name} (${u.email})`
  showSuggestions.value = false
}
const showSuggestions = ref(false)
const onInputFocus = () => {
  showSuggestions.value = !!userSearch.value
}
const userBox = ref(null)
const onDocumentClick = (e) => {
  if (!userBox.value) return
  if (!userBox.value.contains(e.target)) {
    showSuggestions.value = false
  }
}
import { onMounted, onBeforeUnmount } from 'vue'
onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})

// Date validation
const isDateInvalid = computed(() => {
  const s = new Date(form.start_date + 'T00:00:00')
  const e = new Date(form.end_date + 'T00:00:00')
  return isFinite(s) && isFinite(e) ? s > e : false
})
const minStart = nowLocal()
const isStartTooEarly = computed(() => {
  const s = new Date(form.start_date)
  const n = new Date(minStart)
  return isFinite(s) && isFinite(n) ? s < n : false
})
const isFormValid = computed(() => {
  const hasName = !!form.name && String(form.name).trim().length > 0
  const hasUser = !!form.user_id && Number(form.user_id) > 0
  return hasName && hasUser && !isDateInvalid.value && !isStartTooEarly.value
})

const onSubmit = async () => {
  try
  {
    if (isDateInvalid.value) {
      message.error('Ngày bắt đầu không được sau ngày kết thúc')
      return
    }
    if (isStartTooEarly.value) {
      message.error('Ngày bắt đầu không được nhỏ hơn hiện tại')
      return
    }
    if (invalidUser.value) {
      message.error('Vui lòng chọn người dùng từ gợi ý')
      return
    }
    const payload = {
      ...form,
      start_date: form.start_date, // YYYY-MM-DD
      end_date: form.end_date      // YYYY-MM-DD
    }
    await taskStore.createTask(payload)
    message.success('Tạo task thành công')
    router.push('/tasks')
  }
  catch (error) {
    console.error('Error creating task:', error)
    message.error('Lỗi khi tạo task')
  }
  finally {
    taskStore.isSubmitting = false
  }
}
</script>

<style scoped>
</style>
