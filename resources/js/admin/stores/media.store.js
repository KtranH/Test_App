import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db, uid } from '@/admin/services/db'
import { ProductImagesApi } from '@/admin/api/product_images'

const IMAGES_KEY = 'productImages'

export const useMediaStore = defineStore('admin.media', () => {
  const images = ref([])
  const isLoading = ref(false)

  const addImage = (productId, fileOrUrl, { isCover = false, alt = '', position = 0 } = {}) => {
    
    const entity = { id: uid(), productId, url: '', isCover, alt, position }
    if (typeof fileOrUrl === 'string') {
      entity.url = fileOrUrl
      images.value.push(entity)
      db.setCollection(IMAGES_KEY, images.value)
      return entity
    }
    const reader = new FileReader()
    reader.onload = () => {
      entity.url = String(reader.result)
      images.value.push(entity)
      db.setCollection(IMAGES_KEY, images.value)
    }
    reader.readAsDataURL(fileOrUrl)
    return entity
  }

  const removeImage = (id) => {
    images.value = images.value.filter(i => i.id !== id)
    db.setCollection(IMAGES_KEY, images.value)
  }

  const setCover = (productId, imageId) => {
    images.value = images.value.map(i => i.productId === productId ? { ...i, isCover: i.id === imageId } : i)
    db.setCollection(IMAGES_KEY, images.value)
  }

  const reorder = (productId, orderedIds) => {
    images.value = images.value.map(i => i.productId === productId ? { ...i, position: orderedIds.indexOf(i.id) } : i)
    db.setCollection(IMAGES_KEY, images.value)
  }

  const fetchAll = async () => {
    isLoading.value = true
    try {
      const res = await ProductImagesApi.getProductImages()
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      images.value = list.map(img => ({
        id: img.id,
        productId: String(img.product_id),
        productVariantId: img.product_variant_id,
        url: img.image_path,
        alt: img.alt_text ?? '',
        title: img.title ?? '',
        position: img.sort_order ?? 0,
        isCover: !!img.is_primary,
        isActive: !!img.is_active,
      }))
    } finally {
      isLoading.value = false
    }
  }

  return { images, isLoading, addImage, removeImage, setCover, reorder, fetchAll }
})


