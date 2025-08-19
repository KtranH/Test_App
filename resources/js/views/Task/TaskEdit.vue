<template>
  <PageTransition aos-animation="slide-in-right" aos-duration="800">
    <div class="min-h-screen bg-gray-50">
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" v-if="loaded">
        <div class="px-4 py-6 sm:px-0" data-aos="fade-down" data-aos-delay="100">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Chỉnh sửa Task #{{ id }}</h1>
              <p class="mt-2 text-gray-600">Cập nhật thông tin task</p>
            </div>
            <router-link to="/tasks" class="btn-secondary">Quay lại</router-link>
          </div>
        </div>
        <div class="px-4 sm:px-0">
          <div class="card max-w-3xl">
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
                <div>
                  <label class="block text-sm text-gray-700 mb-1">User ID</label>
                  <input v-model.number="form.user_id" type="number" min="1" required class="input-field" />
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-700 mb-1">Start date</label>
                  <input v-model="form.start_date" type="datetime-local" required class="input-field" />
                </div>
                <div>
                  <label class="block text-sm text-gray-700 mb-1">End date</label>
                  <input v-model="form.end_date" type="datetime-local" required class="input-field" />
                </div>
              </div>
              <div class="flex items-center gap-3 pt-2">
                <router-link to="/tasks" class="btn-secondary">Hủy</router-link>
                <button :disabled="taskStore.isSubmitting" type="submit" class="btn-primary">
                  <span v-if="!taskStore.isSubmitting">Lưu</span>
                  <span v-else>Đang lưu...</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </main>
      <main v-else class="max-w-3xl mx-auto py-8 px-4">
        <div class="text-gray-600">Đang tải...</div>
      </main>
    </div>
  </PageTransition>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore.js'
import PageTransition from '@/components/UI/PageTransition.vue'
import Footer from '@/components/Layout/Footer.vue'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const id = Number(route.params.id)
const loaded = ref(false)
const form = reactive({
  name: '',
  description: '',
  status: 'pending',
  user_id: 1,
  start_date: '',
  end_date: ''
})

onMounted(async () => {
  const task = await taskStore.getTaskById(id)
  if (!task) {
    router.push('/tasks')
    return
  }
  form.name = task.name || ''
  form.description = task.description || ''
  form.status = task.status || 'pending'
  form.user_id = task.user_id || 1
  form.start_date = toLocal(task.start_date)
  form.end_date = toLocal(task.end_date)
  loaded.value = true
})

const toLocal = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

const onSubmit = async () => {
  const payload = {
    ...form,
    start_date: new Date(form.start_date).toISOString(),
    end_date: new Date(form.end_date).toISOString()
  }
  await taskStore.updateTask(id, payload)
  message.success('Cập nhật task thành công')
  router.push('/tasks')
}
</script>

<style scoped>
</style>


