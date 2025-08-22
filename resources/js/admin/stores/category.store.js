import { defineStore } from 'pinia'
import { ref, computed, nextTick, watch } from 'vue'
import { db, uid } from '@/admin/services/db'
import { CategoriesApi } from '@/admin/api/categories'

const CATEGORIES_KEY = 'categories'

export const useCategoryStore = defineStore('admin.categories', () => {
  const categories = ref(db.getCollection(CATEGORIES_KEY))
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const pagingNext = ref(null)
  const total = ref(0)

  const createCategory = async (payload) => {
    // Map camelCase từ frontend sang snake_case cho backend
    const backendPayload = {
      name: payload.name,
      slug: payload.slug,
      parent_id: payload.parentId || null,
      is_active: payload.isActive ?? true
    }
    
    const respone = await CategoriesApi.createCategory(backendPayload)
    if (respone.error) return
    
    // Cập nhật local với camelCase
    const entity = { 
      id: uid(), 
      name: payload.name, 
      slug: payload.slug, 
      parentId: payload.parentId || null, 
      isActive: payload.isActive ?? true 
    }
    categories.value.push(entity)
    db.setCollection(CATEGORIES_KEY, categories.value)
    return entity
  }

  const updateCategory = async (id, patch) => {
    console.log('Store updateCategory được gọi với:', { id, patch })
    
    const respone = await CategoriesApi.updateCategory(id, patch)
    if (respone.error) return
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx < 0) return
    
    console.log('Tìm thấy category tại index:', idx, 'với data:', categories.value[idx])
    
    // Map snake_case từ backend sang camelCase cho frontend
    const mappedPatch = {}
    if (patch.hasOwnProperty('is_active')) {
      mappedPatch.isActive = patch.is_active
    }
    if (patch.hasOwnProperty('parent_id')) {
      mappedPatch.parentId = patch.parent_id
    }
    if (patch.hasOwnProperty('sort_order')) {
      mappedPatch.sortOrder = patch.sort_order
    }
    
    // Thêm các field khác nếu có
    Object.keys(patch).forEach(key => {
      if (!['is_active', 'parent_id', 'sort_order'].includes(key)) {
        mappedPatch[key] = patch[key]
      }
    })
    
    console.log('Mapped patch:', mappedPatch)
    
    // Force reactive update bằng cách tạo array mới hoàn toàn
    const updatedCategories = categories.value.map((cat, index) => {
      if (index === idx) {
        const updated = { ...cat, ...mappedPatch }
        console.log('Category được cập nhật:', updated)
        return updated
      }
      return cat
    })
    
    console.log('Categories trước khi cập nhật:', categories.value)
    console.log('Categories sau khi cập nhật:', updatedCategories)
    
    // Gán lại toàn bộ array để trigger reactive update
    categories.value = updatedCategories
    
    // Sử dụng watch để đảm bảo reactive updates hoạt động
    watch(categories, (newVal) => {
      console.log('Categories trong watch:', newVal)
    }, { immediate: true, deep: true, flush: 'post' })
    
    // Đợi DOM được cập nhật
    await nextTick()
    
    console.log('Categories sau khi gán:', categories.value)
    
    db.setCollection(CATEGORIES_KEY, categories.value)
  }

  const removeCategory = async (id) => {
    const respone = await CategoriesApi.deleteCategory(id)
    if (respone.error) return
    categories.value = categories.value.filter(c => c.id !== id && c.parentId !== id)
    db.setCollection(CATEGORIES_KEY, categories.value)
  }

  const importDefaultsIfEmpty = () => {
    if (categories.value.length) return
    createCategory({ name: 'Tops', slug: 'tops' })
    createCategory({ name: 'Bottoms', slug: 'bottoms' })
    createCategory({ name: 'Outerwear', slug: 'outerwear' })
  }

  const mapCategory = (c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        parentId: c.parent_id ?? null,
        description: c.description ?? '',
        image: c.image ?? null,
        sortOrder: c.sort_order ?? 0,
        isActive: !!c.is_active,
      })

  const fetchFirstPage = async (params = {}) => {
    isLoading.value = true
    try {
      const res = await CategoriesApi.getCategories(params)
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      categories.value = list.map(mapCategory)
      const meta = res?.data?.meta || {}
      const paging = meta?.paging || {}
      pagingNext.value = paging?.links?.next ?? null
      total.value = Number(paging?.total ?? categories.value.length)
      db.setCollection(CATEGORIES_KEY, categories.value)
    } finally {
      isLoading.value = false
      hasLoaded.value = true
    }
  }

  const fetchNextPage = async () => {
    if (!pagingNext.value) return
    isLoading.value = true
    try {
      const res = await CategoriesApi.getByUrl(pagingNext.value)
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      categories.value = categories.value.concat(list.map(mapCategory))
      const meta = res?.data?.meta || {}
      const paging = meta?.paging || {}
      pagingNext.value = paging?.links?.next ?? null
      total.value = Number(paging?.total ?? total.value)
      db.setCollection(CATEGORIES_KEY, categories.value)
    } finally {
      isLoading.value = false
    }
  }

  const ensureInitialized = async () => {
    if (hasLoaded.value) return
    if (categories.value?.length > 0) {
      hasLoaded.value = true
      return
    }
    await fetchFirstPage()
  }

  return { categories, isLoading, total, hasMore: computed(() => !!pagingNext.value), createCategory, updateCategory, removeCategory, importDefaultsIfEmpty, fetchFirstPage, fetchNextPage, ensureInitialized }
})



