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
  const userQuery = ref([])
  const offset = ref(0)
  const perPage = ref(10)
  const hasMore = ref(false)
  const isFetching = ref(false)
  const isFetchingV2 = ref(false)
  const total = ref(0)
  const nextUrl = ref(null)

  //----------------------------------
  // Hàm lấy danh sách user
  //----------------------------------
  const fetchUsers = async (reset = true) => {
    try {
      isFetching.value = true
      if (reset) {
        offset.value = 0
        users.value = []
        hasMore.value = false
        total.value = 0
        nextUrl.value = null
      }
      
      console.log('Fetching users with offset:', offset.value, 'limit:', perPage.value)
      const response = await UserApi.getUsersPaginated(offset.value, perPage.value)
      console.log('API Response:', response)
      
      const respData = response?.data
      const list = respData?.data ?? []
      const meta = respData?.meta ?? {}
      const paging = meta?.paging ?? {}

      console.log('Parsed data:', { list, meta, paging })

      // Lần đầu load hoặc reset: thay thế danh sách
      if (reset) {
        users.value = Array.isArray(list) ? list : []
        // Reset offset về 0 và cập nhật cho lần tiếp theo
        offset.value = Array.isArray(list) ? list.length : 0
      } else {
        users.value = Array.isArray(list) ? users.value.concat(list) : users.value
        // Cập nhật offset cho lần load tiếp theo
        if (Array.isArray(list) && list.length > 0) {
          offset.value += list.length
        }
      }
      
      total.value = paging?.total ?? users.value.length
      nextUrl.value = paging?.links?.next || null
      hasMore.value = !!nextUrl.value
      
      console.log('Updated store state:', { 
        usersCount: users.value.length, 
        total: total.value, 
        hasMore: hasMore.value, 
        nextUrl: nextUrl.value 
      })
      
    } catch (error) {
      console.error('Error fetching users:', error)
      // Fallback demo data
      users.value = usersDefault.value
      total.value = users.value.length
      hasMore.value = false
    } finally {
      isFetching.value = false
    }
  }

  //----------------------------------
  // Hàm load thêm user
  //----------------------------------
  const loadMore = async () => {
    if (isFetching.value || !hasMore.value) return
    try {
      isFetching.value = true
      
      console.log('Loading more users with offset:', offset.value, 'limit:', perPage.value)
      const response = await UserApi.getUsersPaginated(offset.value, perPage.value)
      const respData = response?.data
      const list = respData?.data ?? []
      const meta = respData?.meta ?? {}
      const paging = meta?.paging ?? {}

      console.log('Load more response:', { list, meta, paging })

      if (Array.isArray(list) && list.length > 0) {
        users.value = users.value.concat(list)
        // Cập nhật offset sau khi thêm dữ liệu thành công
        offset.value += list.length
      }

      total.value = paging?.total ?? total.value
      nextUrl.value = paging?.links?.next || null
      hasMore.value = !!nextUrl.value
      
      console.log('Updated store state after load more:', { 
        usersCount: users.value.length, 
        total: total.value, 
        hasMore: hasMore.value, 
        nextUrl: nextUrl.value,
        offset: offset.value
      })
    } catch (error) {
      console.error('Error loading more users:', error)
      // Giữ nguyên danh sách hiện tại nếu lỗi
    } finally {
      isFetching.value = false
    }
  }

  //----------------------------------
  // Hàm làm mới tổng số user
  //----------------------------------
  const refreshTotal = async () => {
    try {
      const response = await UserApi.getUsersPaginated(0, 1)
      const respData = response?.data
      const meta = respData?.meta ?? {}
      const paging = meta?.paging ?? {}
      
      if (paging?.total) {
        total.value = paging.total
        hasMore.value = users.value.length < paging.total
      }
    } catch (error) {
      console.error('Error refreshing total:', error)
    }
  }

  //----------------------------------
  // Hàm tìm kiếm user
  //----------------------------------
  const searchUserInAllDB = async (query) => {
    try {
      isFetchingV2.value = true
      userQuery.value = []
      
      if (!query || query.trim() === '') {
        userQuery.value = []
        return
      }
      
      console.log('Searching users in all DB with query:', query)
      const response = await UserApi.searchUser(query.trim())
      console.log('Search API Response:', response)
      
      const respData = response?.data
      const list = respData?.data ?? []
      
      userQuery.value = Array.isArray(list) ? list : []
      
      console.log('Search results:', userQuery.value)
      
    } catch (error) {
      console.error('Error searching users in all DB:', error)
      userQuery.value = []
      // Có thể hiển thị thông báo lỗi cho user
    } finally {
      isFetchingV2.value = false
    }
  }

  const currentUser = ref(null)
  const isLoading = ref(false)

  // Số user active
  const activeUsers = computed(() => {
    if (!Array.isArray(users.value)) return []
    return users.value.filter(user => user.status === 'active')
  })
  
  // Số user inactive
  const inactiveUsers = computed(() => {
    if (!Array.isArray(users.value)) return []
    return users.value.filter(user => user.status === 'inactive')
  })
  
  // Tổng số user
  const totalUsers = computed(() => {
    if (total.value && total.value > 0) {
      return total.value
    }
    if (!Array.isArray(users.value)) return 0
    return users.value.length
  })
  
  // Số lượng user active (count)
  const activeUsersCount = computed(() => activeUsers.value.length)
  
  // Số lượng user inactive (count)
  const inactiveUsersCount = computed(() => inactiveUsers.value.length)
  
  // Lấy user theo id
  const getUserById = computed(() => {
    return (id) => {
      if (!Array.isArray(users.value)) return null
      return users.value.find(user => user.id === id)
    }
  })  

  //----------------------------------
  // Hàm thêm user
  //----------------------------------
  const addUser = async (user) => {
    try {
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
      
      // Cập nhật total count nếu cần
      if (total.value > 0) {
        total.value += 1
      }
      
      console.log('User added successfully:', newUser)
      console.log('Updated store state:', {
        totalUsers: totalUsers.value,
        activeUsersCount: activeUsersCount.value,
        inactiveUsersCount: inactiveUsersCount.value
      })
      
    } catch (error) {
      console.error('Error adding user:', error)
      throw error
    }
  }
  
  //----------------------------------
  // Hàm cập nhật user
  //----------------------------------
  const updateUser = async (id, updatedUser) => {
    try {
      // Gửi API update user
      const response = await UserApi.updateUser(id, updatedUser)
      // Kiểm tra xem response có trả về error không
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      // Cập nhật user trong users.value
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        const oldUser = users.value[index]
        users.value[index] = { ...oldUser, ...updatedUser }
        
        console.log('User updated successfully:', {
          old: oldUser,
          new: users.value[index]
        })
        console.log('Updated store state:', {
          totalUsers: totalUsers.value,
          activeUsersCount: activeUsersCount.value,
          inactiveUsersCount: inactiveUsersCount.value
        })
      }
      
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }
  
  //----------------------------------
  // Hàm xóa user
  //----------------------------------
  const deleteUser = async (id) => {
    try {
      // Gửi API delete user
      const response = await UserApi.deleteUser(id)
      // Kiểm tra xem response có trả về error không
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      // Xóa user trong users.value
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        const deletedUser = users.value[index]
        users.value.splice(index, 1)
        
        // Cập nhật total count nếu cần
        if (total.value > 0) {
          total.value -= 1
        }
        
        console.log('User deleted successfully:', deletedUser)
        console.log('Updated store state:', {
          totalUsers: totalUsers.value,
          activeUsersCount: activeUsersCount.value,
          inactiveUsersCount: inactiveUsersCount.value
        })
      }
      
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }
  
  //----------------------------------
  // Hàm set current user
  //----------------------------------
  const setCurrentUser = (user) => {
    currentUser.value = user
  }

  //----------------------------------
  // Hàm làm mới thống kê
  //----------------------------------
  const refreshStatistics = () => {
    console.log('Refreshing statistics...')
    console.log('Current store state:', {
      totalUsers: totalUsers.value,
      activeUsersCount: activeUsersCount.value,
      inactiveUsersCount: inactiveUsersCount.value,
      usersLength: users.value.length,
      total: total.value
    })
  }

  //----------------------------------
  // Hàm khởi tạo user state
  //----------------------------------
  const initUser = async () => {
    await fetchUsers()
  }
  
  return {
        users,
        userQuery,
        offset,
        perPage,
        hasMore,
        isFetching,
        isFetchingV2,
        total,
        nextUrl,
        currentUser,
        isLoading,
        activeUsers,
        inactiveUsers,
        totalUsers,
        activeUsersCount,
        inactiveUsersCount,
        getUserById,
        addUser,
        updateUser,
        deleteUser,
        setCurrentUser,
        fetchUsers,
        loadMore,
        refreshTotal,
        searchUserInAllDB,
        refreshStatistics
      }
})
