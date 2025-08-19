import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TaskApi } from '@/api/index.js'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])
  const isFetching = ref(false)
  const isSubmitting = ref(false)
  const offset = ref(0)
  const perPage = ref(10)
  const total = ref(0)
  const hasMore = ref(false)
  const nextUrl = ref(null)

  const statuses = ['pending', 'in_progress', 'completed', 'cancelled']

  const fetchTasks = async (reset = true) => {
    try {
      isFetching.value = true
      if (reset) {
        tasks.value = []
        offset.value = 0
        total.value = 0
        hasMore.value = false
        nextUrl.value = null
      }

      const response = await TaskApi.getTasksPaginated(offset.value, perPage.value)
      const respData = response?.data
      const list = respData?.data ?? []
      const paging = respData?.meta?.paging ?? {}

      if (reset) {
        tasks.value = Array.isArray(list) ? list : []
        offset.value = Array.isArray(list) ? list.length : 0
      } else {
        tasks.value = tasks.value.concat(Array.isArray(list) ? list : [])
        if (Array.isArray(list) && list.length > 0) {
          offset.value += list.length
        }
      }

      total.value = paging?.total ?? tasks.value.length
      nextUrl.value = paging?.links?.next || null
      hasMore.value = !!nextUrl.value
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      isFetching.value = false
    }
  }

  const loadMore = async () => {
    if (isFetching.value || !hasMore.value) return
    await fetchTasks(false)
  }

  const getTaskById = async (id) => {
    const existing = tasks.value.find(t => t.id === Number(id))
    if (existing) return existing
    const { data } = await TaskApi.getTaskById(id)
    return data?.data || data
  }

  const createTask = async (payload) => {
    try {
      isSubmitting.value = true
      const response = await TaskApi.createTask(payload)
      if (response?.error) {
        throw new Error(response.error.message)
      }
      const newTask = {
        ...payload,
        id: tasks.value.length + 1
      }
      tasks.value.push(newTask)
      if (typeof total.value === 'number') {
        total.value = total.value > 0 ? total.value + 1 : tasks.value.length
      }
      return newTask
    } catch (error) {
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const updateTask = async (id, payload) => {
    try {
      isSubmitting.value = true
      const response = await TaskApi.updateTask(id, payload)
      if (response?.error) {
        throw new Error(response.error.message)
      }
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        const oldTask = tasks.value[index]
        tasks.value[index] = { ...oldTask, ...payload }
      }
      return tasks.value.find(task => task.id === id) || null
    } catch (error) {
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteTask = async (id) => {
    try {
      const target = tasks.value.find(t => t.id === id)
      if (target && !['pending', 'completed', 'cancelled'].includes(target.status)) {
        throw new Error('Chỉ được xóa task khi trạng thái là pending, completed hoặc cancelled')
      }
      const response = await TaskApi.deleteTask(id)
      if (response?.error) {
        throw new Error(response.error.message)
      }
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value.splice(index, 1)
        if (typeof total.value === 'number' && total.value > 0) {
          total.value -= 1
        }
      }
    } catch (error) {
      throw error
    }
  }
    const completedCount = computed(() => tasks.value.filter(t => t.status === 'completed').length)
    const pendingCount = computed(() => tasks.value.filter(t => t.status === 'pending').length)

    return {
      // state
      tasks,
      isFetching,
      isSubmitting,
      offset,
      perPage,
      total,
      hasMore,
      nextUrl,
      statuses,

      // getters
      completedCount,
      pendingCount,

      // actions
      fetchTasks,
      loadMore,
      getTaskById,
      createTask,
      updateTask,
      deleteTask
    }
  })


