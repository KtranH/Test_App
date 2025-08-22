<template>
  <section class="space-y-6" v-if="product">
    <ButtonBack />
    <header class="flex items-center justify-between">
      <h1 class="text-xl font-semibold tracking-tight">Sửa sản phẩm</h1>
      <div class="text-sm text-black/60">{{ product.name }}</div>
    </header>

    <form class="grid grid-cols-1 lg:grid-cols-3 gap-6" @submit.prevent="save">
      <div class="lg:col-span-2 space-y-4">
        <div class="border border-black/10 rounded-lg p-4 space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-black/60">Tên</label>
              <input v-model="form.name" class="w-full px-3 py-2 border rounded-lg" :class="errors.name ? 'border-red-400' : ''" />
              <div v-if="errors.name" class="text-[12px] text-red-600 mt-1">{{ errors.name }}</div>
            </div>
            <div>
              <label class="text-xs text-black/60">Slug</label>
              <input v-model="form.slug" class="w-full px-3 py-2 border rounded-lg" :class="errors.slug ? 'border-red-400' : ''" />
              <div v-if="errors.slug" class="text-[12px] text-red-600 mt-1">{{ errors.slug }}</div>
            </div>
          </div>
          <div>
            <label class="text-xs text-black/60">Mô tả</label>
            <textarea v-model="form.description" rows="4" class="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>

        <div class="border border-black/10 rounded-lg p-4 space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="text-xs text-black/60">Giá gốc</label>
              <input v-model.number="form.basePrice" type="number" min="0" class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label class="text-xs text-black/60">Danh mục</label>
              <select v-model="form.category_id" class="w-full px-3 py-2 border rounded-lg">
                <option :value="null">Không</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-black/60">Trạng thái</label>
              <select v-model="form.status" class="w-full px-3 py-2 border rounded-lg">
                <option value="active">Đang hoạt động</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
          </div>
        </div>

        <div class="border border-black/10 rounded-lg p-4">
          <!-- Xóa VariantGenerator component -->
        </div>

        <!-- Xóa VariantTable component -->
      </div>

      <div class="lg:col-span-1 space-y-4">
        <div class="border border-black/10 rounded-lg p-4">
          <ProductImageManager :product-id="String(product.id)" />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-3 py-2 border rounded-lg hover:bg-black/5" @click="cancel">Hủy</button>
          <button type="submit" class="px-3 py-2 border rounded-lg hover:bg-black/5">Lưu</button>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore } from '@/admin/stores/category.store'
import { useProductStore } from '@/admin/stores/product.store'
import ProductImageManager from '@/admin/components/product/ProductImageManager.vue'
import { useMediaStore } from '@/admin/stores/media.store'
import { ProductsApi } from '@/admin/api/products'
import ButtonBack from '@/admin/components/ui/ButtonBack.vue'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()
const productStore = useProductStore()
const mediaStore = useMediaStore()

const categories = computed(() => categoryStore.categories)
const product = computed(() => {
  const paramId = String(route.params.id ?? '')
  const foundProduct = productStore.products.find(p => String(p.id) === paramId)
  return foundProduct
})
const form = ref({ name: '', slug: '', description: '', basePrice: 0, category_id: null, status: 'draft' })

const errors = ref({ name: '', slug: '' })
const validate = () => {
  errors.value = { name: '', slug: '' }
  if (!form.value.name?.trim()) errors.value.name = 'Tên sản phẩm là bắt buộc'
  if (!form.value.slug?.trim()) errors.value.slug = 'Slug là bắt buộc'
  return !errors.value.name && !errors.value.slug
}

const save = async () => {
  try
  {
    if (!product.value) return
    if (!validate()) return
    await productStore.updateProduct(product.value.id, { ...form.value })
    router.push({ name: 'admin.products' })
    message.success('Cập nhật sản phẩm thành công')
  }
  catch (error) {
    console.error('Error updating product:', error)
    message.error('Lỗi khi cập nhật sản phẩm')
  }
}

const cancel = () => router.push({ name: 'admin.products' })

onMounted(async () => {
  await Promise.all([
    categoryStore.ensureInitialized(),
    productStore.ensureInitialized(),
  ])
  if (product.value) {
    form.value = {
      name: product.value.name || '',
      slug: product.value.slug || '',
      description: product.value.description || '',
      basePrice: product.value.basePrice || 0,
      category_id: product.value.category_id || null,
      status: product.value.status || 'draft'
    }
    // Đồng bộ ảnh từ API sản phẩm vào media store để hiển thị
    if (Array.isArray(product.value.images) && product.value.images.length) {
      const pid = String(product.value.id)
      mediaStore.images = mediaStore.images.filter(i => i.productId !== pid)
      product.value.images.forEach((img, idx) => {
        mediaStore.addImage(pid, img.image_path, {
          isCover: !!img.is_primary,
          alt: img.alt_text ?? '',
          position: img.sort_order ?? idx,
        })
      })
    }
  }
})
</script>


