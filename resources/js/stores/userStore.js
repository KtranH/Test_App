import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UserApi } from '@/api/index.js'

export const useUserStore = defineStore('user', () => {
  // State
  const usersDefault = ref([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      role: 'Admin',
      status: 'Active',
      created_at: '2024-01-15'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      role: 'User',
      status: 'Active',
      created_at: '2024-01-16'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      role: 'Moderator',
      status: 'Inactive',
      created_at: '2024-01-17'
    }
  ])

  // Lấy user từ API
  const users = ref([])
  const currentPage = ref(1)
  const perPage = ref(10)
  const hasMore = ref(false)
  const isFetching = ref(false)
  const total = ref(0)

  const fetchUsers = async (reset = true) => {
    try {
      isFetching.value = true
      if (reset) {
        currentPage.value = 1
        users.value = []
        hasMore.value = false
        total.value = 0
      }
      const response = await UserApi.getUsersPaginated(currentPage.value, perPage.value)
      const respData = response?.data
      const list = respData?.data ?? []
      const meta = respData?.meta ?? {}

      // Lần đầu load hoặc reset: thay thế danh sách
      if (reset) {
        users.value = Array.isArray(list) ? list : []
      } else {
        users.value = Array.isArray(list) ? users.value.concat(list) : users.value
      }
      total.value = meta.total ?? users.value.length
      hasMore.value = meta.has_more_pages === true || (meta.current_page ?? 1) < (meta.last_page ?? 1)
    } catch (error) {
      // Fallback demo data
      users.value = usersDefault.value
      total.value = users.value.length
      hasMore.value = false
    } finally {
      isFetching.value = false
    }
  }

  const loadMore = async () => {
    if (isFetching.value || !hasMore.value) return
    try {
      isFetching.value = true
      currentPage.value += 1
      const response = await UserApi.getUsersPaginated(currentPage.value, perPage.value)
      const respData = response?.data
      const list = respData?.data ?? []
      const meta = respData?.meta ?? {}

      if (Array.isArray(list) && list.length > 0) {
        users.value = users.value.concat(list)
      }

      total.value = meta.total ?? total.value
      hasMore.value = meta.has_more_pages === true || (meta.current_page ?? currentPage.value) < (meta.last_page ?? currentPage.value)
    } catch (error) {
      // Giữ nguyên danh sách hiện tại nếu lỗi
    } finally {
      isFetching.value = false
    }
  }

  const refreshTotal = async () => {
    try {
      const response = await UserApi.getUsersPaginated(1, 1)
      const respData = response?.data
      const meta = respData?.meta ?? {}
      
      if (meta.total) {
        total.value = meta.total
        hasMore.value = users.value.length < meta.total
      }
    } catch (error) {
    }
  }

  const currentUser = ref(null)
  const isLoading = ref(false)

  // Số user active
  const activeUsers = computed(() => {
    if (!Array.isArray(users.value)) return []
    return users.value.filter(user => user.status === 'active')
  })
  
  // Tổng số user
  const totalUsers = computed(() => {
    if (total.value && total.value > 0) {
      return total.value
    }
    if (!Array.isArray(users.value)) return 0
    return users.value.length
  })
  
  // Lấy user theo id
  const getUserById = computed(() => {
    return (id) => {
      if (!Array.isArray(users.value)) return null
      return users.value.find(user => user.id === id)
    }
  })  

  // Actions
  const addUser = async (user) => {
    // Gửi API add user
    const response = await UserApi.createUser(user)
    // Kiểm tra xem response có trả về error không
    if (response.error) {
      throw new Error(response.error.message)
    }
    // Thêm user vào users.value
    const newUser = {
      ...user,
      id: users.value.length + 1,
      created_at: new Date().toISOString().split('T')[0]
    }
    users.value.push(newUser)
    // Tính toán lại totalUsers, activeUsers
    totalUsers.value = users.value.length
    activeUsers.value = users.value.filter(user => user.status === 'active').length
  }
  
  const updateUser = async (id, updatedUser) => {
    // Gửi API update user
    const response = await UserApi.updateUser(id, updatedUser)
    // Kiểm tra xem response có trả về error không
    if (response.error) {
      throw new Error(response.error.message)
    }
    // Cập nhật user trong users.value
    const index = users.value.findIndex(user => user.id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updatedUser }
    }
  }
  
  const deleteUser = async (id) => {
    // Gửi API delete user
    const response = await UserApi.deleteUser(id)
    // Kiểm tra xem response có trả về error không
    if (response.error) {
      throw new Error(response.error.message)
    }
    // Xóa user trong users.value
    const index = users.value.findIndex(user => user.id === id)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
    // Tính toán lại totalUsers, activeUsers
    totalUsers.value = users.value.length
    activeUsers.value = users.value.filter(user => user.status === 'active').length
  }
  
  const setCurrentUser = (user) => {
    currentUser.value = user
  }

  return {
    users,
    currentPage,
    perPage,
    hasMore,
    isFetching,
    total,
    currentUser,
    isLoading,
    activeUsers,
    totalUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    setCurrentUser,
    fetchUsers,
    loadMore,
    refreshTotal
  }
})
