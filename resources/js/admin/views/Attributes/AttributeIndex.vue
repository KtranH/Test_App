<template>
  <section class="space-y-8">
    <!-- Header với gradient và shadow -->
    <header class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Quản lý thuộc tính</h1>
            <p class="text-gray-600 text-sm">Tạo và quản lý các thuộc tính sản phẩm</p>
          </div>
        </div>
        <button 
          class="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
          @click="openCreate()"
        >
          <svg class="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Thêm thuộc tính
        </button>
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ attributes.length }}</div>
            <div class="text-sm text-gray-600">Tổng thuộc tính</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ attributes.filter(a => a.isVariantDefining).length }}</div>
            <div class="text-sm text-gray-600">Tạo biến thể</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M7 7h.01"></path>
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ attributes.filter(a => a.type === 'color').length }}</div>
            <div class="text-sm text-gray-600">Thuộc tính màu</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ attributes.filter(a => a.type === 'select').length }}</div>
            <div class="text-sm text-gray-600">Thuộc tính chọn</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <AdminCard v-if="isLoading" class="animate-pulse">
      <Skeletons type="cards" :rows="4" />
    </AdminCard>

    <!-- Attributes Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div 
        v-for="(attr, index) in attributes" 
        :key="attr.id"
        class="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center" 
                     :class="{
                       'bg-blue-100': attr.type === 'select',
                       'bg-green-100': attr.type === 'color',
                       'bg-purple-100': attr.type === 'text'
                     }">
                  <svg v-if="attr.type === 'select'" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                  </svg>
                  <svg v-else-if="attr.type === 'color'" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M7 7h.01"></path>
                  </svg>
                  <svg v-else class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 text-lg">{{ attr.name }}</h3>
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span class="px-2 py-1 bg-gray-100 rounded-md font-mono">{{ attr.code }}</span>
                    <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-md capitalize">{{ attr.type }}</span>
                    <span v-if="attr.isVariantDefining" class="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">
                      Tạo biến thể
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                @click="edit(attr)"
                title="Sửa thuộc tính"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button 
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                @click="remove(attr.id)"
                title="Xóa thuộc tính"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Values Section -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-700">Giá trị thuộc tính</h4>
              <span class="text-xs text-gray-500">{{ (valuesByAttrId[attr.id] || []).length }} giá trị</span>
            </div>
            
            <div class="flex flex-wrap gap-2 min-h-[40px]">
              <span 
                v-for="v in valuesByAttrId[attr.id] || []" 
                :key="v.id" 
                class="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 group/value"
              >
                <span v-if="attr.type === 'color'" 
                      class="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                      :style="{ background: v.meta?.hex || v.value.toLowerCase() }" />
                {{ v.value }}
                <button 
                  class="ml-1 w-5 h-5 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors duration-200 opacity-0 group-hover/value:opacity-100"
                  @click="removeValue(v.id)"
                  title="Xóa giá trị"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </span>
            </div>

            <!-- Add New Value Form -->
            <form class="flex gap-2" @submit.prevent="addNewValue(attr.id)">
              <div class="flex-1 relative">
                <input 
                  v-model="newValue" 
                  placeholder="Nhập giá trị mới..." 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
              </div>
              <input 
                v-if="attr.type === 'color'" 
                v-model="newColor" 
                type="color" 
                class="w-10 h-10 p-0 border border-gray-200 rounded-lg cursor-pointer hover:scale-110 transition-transform duration-200" 
              />
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Thêm
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="store.hasMore" class="flex justify-center">
      <button 
        class="group px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center gap-2"
        @click="store.fetchNextPage" 
        :disabled="isLoading"
      >
        <svg class="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
        </svg>
        Tải thêm
        <span class="text-sm text-gray-500">({{ attributes.length }}/{{ store.total }})</span>
      </button>
    </div>

    <!-- Modal Dialog -->
    <dialog ref="dialogRef" class="p-0 rounded-xl border border-gray-200 shadow-2xl backdrop:bg-black/20">
      <form method="dialog" class="min-w-[480px] p-6 space-y-6" @submit.prevent>
        <div class="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">{{ form.id ? 'Sửa thuộc tính' : 'Thêm thuộc tính mới' }}</h3>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tên thuộc tính</label>
            <input 
              v-model="form.name" 
              placeholder="Ví dụ: Màu sắc, Kích thước, Chất liệu..." 
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mã thuộc tính</label>
            <input 
              v-model="form.code" 
              placeholder="Ví dụ: color, size, material..." 
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-mono"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Loại thuộc tính</label>
            <select 
              v-model="form.type" 
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            >
              <option value="select">Select - Chọn từ danh sách</option>
              <option value="color">Color - Màu sắc</option>
              <option value="text">Text - Văn bản</option>
            </select>
          </div>
          
          <label class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <input 
              type="checkbox" 
              v-model="form.isVariantDefining"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <div class="text-sm font-medium text-blue-900">Dùng để tạo biến thể sản phẩm</div>
              <div class="text-xs text-blue-700">Khi bật, thuộc tính này sẽ được sử dụng để tạo các biến thể khác nhau của sản phẩm</div>
            </div>
          </label>
        </div>
        
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="button"
            class="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            @click="closeDialog"
          >
            Hủy
          </button>
          <button 
            type="button"
            class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            @click="save"
          >
            {{ form.id ? 'Cập nhật' : 'Tạo mới' }}
          </button>
        </div>
      </form>
    </dialog>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAttributeStore } from '@/admin/stores/attribute.store'
import AdminCard from '@/admin/components/ui/AdminCard.vue'
import Skeletons from '@/admin/components/ui/Skeletons.vue'

const store = useAttributeStore()
const { attributes, valuesByAttrId, isLoading } = storeToRefs(store)
const { createAttribute, updateAttribute, removeAttribute, addValue, removeValue, ensureInitialized } = store

const dialogRef = ref(null)
const form = ref({ id: null, name: '', code: '', type: 'select', isVariantDefining: false })

const newValue = ref('')
const newColor = ref('#000000')

onMounted(async () => {
  await ensureInitialized()
})

const openCreate = () => {
  form.value = { id: null, name: '', code: '', type: 'select', isVariantDefining: false }
  dialogRef.value?.showModal()
}

const edit = (attr) => {
  form.value = { ...attr }
  dialogRef.value?.showModal()
}

const closeDialog = () => dialogRef.value?.close()

const save = () => {
  if (!form.value.name || !form.value.code) return
  if (form.value.id) updateAttribute(form.value.id, { ...form.value })
  else createAttribute({ ...form.value })
  closeDialog()
}

const addNewValue = (attributeId) => {
  if (!newValue.value.trim()) return
  const meta = {}
  if (newColor.value && (attributes.value.find(a => a.id === attributeId)?.type === 'color')) {
    meta.hex = newColor.value
  }
  addValue(attributeId, { value: newValue.value.trim(), meta })
  newValue.value = ''
}

const remove = (id) => removeAttribute(id)
</script>

<style scoped>
dialog::backdrop { 
  background: rgba(0,0,0,0.3); 
  backdrop-filter: blur(4px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>


