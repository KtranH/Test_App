<template>
  <section class="space-y-6">
    <ButtonBack />
    <header class="flex items-center justify-between">
      <h1 class="text-xl font-semibold tracking-tight">Thêm sản phẩm</h1>
      <div class="text-sm text-black/60">Bản nháp sẽ được lưu vào trình duyệt</div>
    </header>

    <form class="grid grid-cols-1 lg:grid-cols-3 gap-6" @submit.prevent="save">
      <div class="lg:col-span-2 space-y-4">
        <div class="border border-black/10 rounded-lg p-4 space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-black/60">Tên</label>
              <input v-model="form.name" class="w-full px-3 py-2 border rounded-lg" :class="errors.name ? 'border-red-400' : ''" placeholder="Tên sản phẩm" />
              <div v-if="errors.name" class="text-[12px] text-red-600 mt-1">{{ errors.name }}</div>
            </div>
            <div>
              <label class="text-xs text-black/60">Slug</label>
              <input v-model="form.slug" class="w-full px-3 py-2 border rounded-lg" :class="errors.slug ? 'border-red-400' : ''" placeholder="slug" />
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
                <option value="draft">Bản nháp</option>
                <option value="active">Đang hoạt động</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
          </div>
        </div>

        <div class="border border-black/10 rounded-lg p-4">
        </div>

      </div>

      <div class="lg:col-span-1 space-y-4">
        <div class="border border-black/10 rounded-lg p-4">
          <ProductImageManager :product-id="productId" />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-3 py-2 border rounded-lg hover:bg-black/5" @click="cancel">Hủy</button>
          <button type="submit" class="px-3 py-2 border bg-black text-white font-bold rounded-lg hover:bg-black/5">Lưu</button>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@/admin/stores/category.store'
import { useProductStore } from '@/admin/stores/product.store'
import { uid } from '@/admin/services/db'
import ProductImageManager from '@/admin/components/product/ProductImageManager.vue'
import ButtonBack from '@/admin/components/ui/ButtonBack.vue'
import { message } from 'ant-design-vue'
import { generateSku } from '@/admin/services/sku'

const router = useRouter()
const categoryStore = useCategoryStore()
const productStore = useProductStore()

const categories = computed(() => categoryStore.categories)
const productId = ref(uid())

const form = ref({
  name: '', slug: '', description: '', basePrice: 0,
  category_id: null, status: 'draft'
})

const errors = ref({ name: '', slug: '' })

const validate = () => {
  errors.value = { name: '', slug: '' }
  if (!form.value.name?.trim()) errors.value.name = 'Tên sản phẩm là bắt buộc'
  if (!form.value.slug?.trim()) errors.value.slug = 'Slug là bắt buộc'
  return !errors.value.name && !errors.value.slug
}

const save = async () => {
  try {
    if (!validate()) return
    const sku = generateSku(form.value.name)
    await productStore.createProduct({ id: productId.value, ...form.value, sku })
    router.push({ name: 'admin.products' })
    message.success('Tạo sản phẩm thành công')
  } catch (error) {
    console.error('Error creating product:', error)
    message.error('Lỗi khi tạo sản phẩm')
  }
}

const cancel = () => router.push({ name: 'admin.products' })

onMounted(async () => {
  await categoryStore.ensureInitialized()
})
</script>


