import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db, uid } from '@/admin/services/db'
import { CategoriesApi } from '@/admin/api/categories'

const CATEGORIES_KEY = 'categories'

export const useCategoryStore = defineStore('admin.categories', () => {
  const categories = ref(db.getCollection(CATEGORIES_KEY))
  const isLoading = ref(false)
  const hasLoaded = ref(false)

  const createCategory = (payload) => {
    const entity = { id: uid(), name: payload.name, slug: payload.slug, parentId: payload.parentId || null, isActive: payload.isActive ?? true }
    categories.value.push(entity)
    db.setCollection(CATEGORIES_KEY, categories.value)
    return entity
  }

  const updateCategory = (id, patch) => {
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx < 0) return
    categories.value[idx] = { ...categories.value[idx], ...patch }
    db.setCollection(CATEGORIES_KEY, categories.value)
  }

  const removeCategory = (id) => {
    categories.value = categories.value.filter(c => c.id !== id && c.parentId !== id)
    db.setCollection(CATEGORIES_KEY, categories.value)
  }

  const importDefaultsIfEmpty = () => {
    if (categories.value.length) return
    createCategory({ name: 'Tops', slug: 'tops' })
    createCategory({ name: 'Bottoms', slug: 'bottoms' })
    createCategory({ name: 'Outerwear', slug: 'outerwear' })
  }

  const fetchAll = async () => {
    isLoading.value = true
    try {
      const res = await CategoriesApi.getCategories()
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      categories.value = list.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        parentId: c.parent_id ?? null,
        description: c.description ?? '',
        image: c.image ?? null,
        sortOrder: c.sort_order ?? 0,
        isActive: !!c.is_active,
      }))
      db.setCollection(CATEGORIES_KEY, categories.value)
    } finally {
      isLoading.value = false
      hasLoaded.value = true
    }
  }

  const ensureInitialized = async () => {
    if (hasLoaded.value) return
    if (categories.value?.length > 0) {
      hasLoaded.value = true
      return
    }
    await fetchAll()
  }

  return { categories, isLoading, createCategory, updateCategory, removeCategory, importDefaultsIfEmpty, fetchAll, ensureInitialized }
})



