<template>
  <section class="space-y-8">
    <!-- Header với gradient -->
    <div class="relative overflow-hidden bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 shadow-sm border border-emerald-100" data-aos="fade-up" data-aos-duration="800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
          <Folder class="h-5 w-5 text-white" />
        </div>
        <div class="relative z-10">
          <h1 class="text-2xl font-bold mb-2">Quản lý danh mục</h1>
          <p class="text-black">Tổ chức và phân loại sản phẩm</p>
        </div>
      </div>
      <div class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div>
      <div class="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10"></div>
      <div class="absolute -right-8 top-8 h-16 w-16 rounded-full bg-white/5"></div>
    </div>

    <!-- Quick Actions -->
    <div class="flex items-center justify-between" data-aos="fade-up" data-aos-duration="1000">
      <div class="flex items-center gap-4">
        <button @click="openCreate()" class="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700">
          <FolderPlus class="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          Tạo danh mục mới
        </button>
        <button @click="refresh()" class="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700">
          <LoaderCircle class="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          Tải mới
        </button>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <Folder class="h-4 w-4" />
        <span>{{ categories.length }} danh mục</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span class="ml-3 text-gray-600">Đang tải danh mục...</span>
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up" data-aos-duration="1200">
      <div 
        v-for="cat in categories" 
        :key="cat.id" 
        :class="[
          'group relative overflow-hidden rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:scale-105',
          cat.isActive 
            ? 'bg-white border-gray-100 hover:shadow-xl' 
            : 'bg-gray-100 border-gray-200 hover:shadow-md'
        ]"
      >
        <div 
          :class="[
            'absolute inset-0 transition-opacity duration-300',
            cat.isActive 
              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100' 
              : 'bg-gray-200 opacity-100'
          ]"
        ></div>
        <div class="relative z-10">
          <div class="flex items-start justify-between mb-4">
            <div 
              :class="[
                'h-12 w-12 rounded-xl flex items-center justify-center',
                cat.isActive 
                  ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' 
                  : 'bg-gray-300'
              ]"
            >
              <Folder 
                :class="[
                  'h-6 w-6',
                  cat.isActive ? 'text-emerald-600' : 'text-gray-500'
                ]" 
              />
            </div>
            <div class="flex items-center gap-2">
              <button @click="edit(cat)" class="group/btn p-2 rounded-lg hover:bg-emerald-100 transition-colors duration-200" title="Chỉnh sửa">
                <Edit class="h-4 w-4 text-emerald-600 group-hover/btn:scale-110 transition-transform duration-200" />
              </button>
              <button 
                @click="confirmToggle(cat)" 
                :class="[
                  'group/btn p-2 rounded-lg transition-colors duration-200',
                  cat.isActive 
                    ? 'hover:bg-red-100' 
                    : 'hover:bg-emerald-100'
                ]" 
                :title="cat.isActive ? 'Tắt danh mục' : 'Bật danh mục'"
              >
                <Power 
                  v-if="cat.isActive" 
                  class="h-4 w-4 text-red-600 group-hover/btn:scale-110 transition-transform duration-200" 
                />
                <Power 
                  v-else 
                  class="h-4 w-4 text-emerald-600 group-hover/btn:scale-110 transition-transform duration-200" 
                />
              </button>
            </div>
          </div>
          
          <div class="mb-4">
            <h3 
              :class="[
                'text-lg font-semibold mb-2',
                cat.isActive ? 'text-gray-900' : 'text-gray-600'
              ]"
            >
              {{ cat.name }}
            </h3>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <Hash class="h-4 w-4" />
                <span>{{ cat.slug }}</span>
              </div>
              <div class="flex items-center gap-2">
                <CheckCheck v-if="cat.isActive" class="h-4 w-4 text-emerald-600" />
                <X v-else class="h-4 w-4 text-gray-500" />
                <span 
                  :class="[
                    'text-sm',
                    cat.isActive ? 'text-emerald-600' : 'text-gray-500'
                  ]"
                >
                  {{ cat.isActive ? 'Đang hiển thị' : 'Đã tắt' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="categories.length === 0" class="col-span-full">
        <EmptyState :icon="FolderOpen" title="Chưa có danh mục" description="Hãy thêm danh mục mới để bắt đầu sắp xếp sản phẩm." />
      </div>
    </div>

    <dialog ref="dialogRef" class="p-0 rounded-2xl border border-gray-200 shadow-2xl">
      <form method="dialog" class="min-w-[400px] p-6 space-y-4" @submit.prevent>
        <div class="flex items-center gap-3 mb-4">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
            <FolderPlus class="h-5 w-5 text-emerald-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900">{{ form.id ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới' }}</h3>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tên danh mục</label>
            <input v-model="form.name" placeholder="Nhập tên danh mục..." class="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" :class="errors.name ? 'border-red-400' : 'border-gray-300'" />
            <div v-if="errors.name" class="text-[12px] text-red-600 mt-1">{{ errors.name }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Slug</label>
            <input v-model="form.slug" placeholder="nhap-ten-danh-muc" class="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" :class="errors.slug ? 'border-red-400' : 'border-gray-300'" />
            <div v-if="errors.slug" class="text-[12px] text-red-600 mt-1">{{ errors.slug }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Danh mục cha</label>
            <select v-model="form.parentId" class="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 border-gray-300">
              <option :value="null">Không có danh mục cha</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <label class="flex items-center gap-3 text-sm">
            <input type="checkbox" v-model="form.isActive" class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
            <span class="text-gray-700">Hiển thị danh mục</span>
          </label>
        </div>
        
        <div class="pt-4 flex justify-end gap-3">
          <button type="button" class="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200" @click="closeDialog">Hủy</button>
          <button type="button" class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl" @click="save">Lưu</button>
        </div>
      </form>
    </dialog>
    <ConfirmDialog ref="confirmRef" @confirm="toggleStatus" />
  </section>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/admin/stores/category.store'
import EmptyState from '@/admin/components/ui/EmptyState.vue'
import { 
  FolderOpen, Folder, FolderPlus, Edit, Power, Hash, CheckCheck, X, LoaderCircle
} from 'lucide-vue-next'
import { message } from 'ant-design-vue'
import ConfirmDialog from '@/admin/components/ui/ConfirmDialog.vue'

const store = useCategoryStore()
const { isLoading } = storeToRefs(store)
const { createCategory, updateCategory, ensureInitialized, fetchFirstPage } = store

// Sử dụng store trực tiếp để đảm bảo reactive
const categories = computed(() => store.categories)

const dialogRef = ref(null)
const form = ref({ id: null, name: '', slug: '', parentId: null, isActive: true })
const errors = ref({ name: '', slug: '' })

onMounted(async () => {
  await ensureInitialized()
})

const resetForm = (data = { id: null, name: '', slug: '', parentId: null, isActive: true }) => {
  form.value = { ...data }
  errors.value = { name: '', slug: '' }
}

const openCreate = () => { resetForm(); dialogRef.value?.showModal() }
const edit = (cat) => { resetForm(cat); dialogRef.value?.showModal() }
const closeDialog = () => dialogRef.value?.close()

const validate = () => {
  errors.value = { name: '', slug: '' }
  if (!form.value.name?.trim()) errors.value.name = 'Tên danh mục là bắt buộc'
  if (!form.value.slug?.trim()) errors.value.slug = 'Slug là bắt buộc'
  return !errors.value.name && !errors.value.slug
}

const save = () => {
  try {
    if (!validate()) return
    if (form.value.id) {
      // Map camelCase sang snake_case cho backend
      const backendPayload = {
        name: form.value.name,
        slug: form.value.slug,
        parent_id: form.value.parentId,
        is_active: form.value.isActive
      }
      updateCategory(form.value.id, backendPayload)
    } else {
      createCategory({ ...form.value })
    }
    closeDialog()
    message.success('Thao tác danh mục thành công!')
  } catch (error) {
    console.error(error)
    message.error('Thao tác danh mục thất bại!')
  }
}

const confirmRef = ref(null)
const confirmToggle = async (cat) => {
  if (cat.isActive) {
    const ok = await confirmRef.value?.open?.({
      title: 'Tắt danh mục?',
      message: `Danh mục "${cat.name}" sẽ bị tắt và không thể chọn khi tạo sản phẩm.\nBạn vẫn muốn tiếp tục?`,
      confirmText: 'Tắt',
      cancelText: 'Hủy',
      confirmType: 'danger',
    })
    if (!ok) return
  }
  await toggleStatus(cat)
}

const toggleStatus = async (cat) => {
  try {
    const newStatus = !cat.isActive    
    // Gọi API để cập nhật backend
    await updateCategory(cat.id, { is_active: newStatus })
    
    // Đợi DOM được cập nhật
    await nextTick()
  
    message.success(`Đã ${newStatus ? 'bật' : 'tắt'} danh mục "${cat.name}"`)
  } catch (error) {
    console.error(error)
    message.error('Thay đổi trạng thái danh mục thất bại!')
  }
}

const refresh = () => {
  store.fetchFirstPage()
}
</script>

<style scoped>
dialog::backdrop { 
  background: rgba(0,0,0,0.4); 
  backdrop-filter: blur(4px);
}
</style>


