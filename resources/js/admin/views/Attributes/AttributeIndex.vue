<template>
  <section class="space-y-8">
    <!-- Header với gradient và shadow -->
    <header class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100" data-aos="fade-up" data-aos-duration="800">
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
        <div class="flex items-center gap-3">
          <button 
            class="group relative px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            @click="handleCreate()"
          >
            <Plus class="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            Thêm thuộc tính
          </button>
          <button @click="refresh()" class="group relative px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"> 
            <LoaderCircle class="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            Tải mới
          </button>
        </div>
      </div>
    </header>

    <!-- Stats Cards -->
    <AttributeStats 
      :total-attributes="totalAttributes"
      :variant-defining-attributes="variantDefiningAttributes"
      :color-attributes="colorAttributes"
      :select-attributes="selectAttributes"
    />

    <!-- Loading State -->
    <AdminCard v-if="isLoading" class="animate-pulse">
      <Skeletons type="cards" :rows="4" />
    </AdminCard>

    <!-- Attributes Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6" data-aos="fade-up" data-aos-duration="1200">
      <AttributeCard 
        v-for="(attr, index) in attributes" 
        :key="`${attr.id}-${attr.isActive}`"
        :attribute="attr"
        :values="valuesByAttrId[attr.id] || []"
        :has-more="hasMoreValues(attr.id)"
        :total="getValuesTotal(attr.id)"
        :style="{ animationDelay: `${index * 100}ms` }"
        @edit="handleEdit"
        @toggle="confirmToggle"
        @add-value="(data) => handleAddValue(attr.id, data)"
        @remove-value="removeValue"
        @load-more="() => handleLoadMoreValues(attr.id)"
        @toggle-value="handleToggleValue"
        @edit-value="handleEditValue"
        @create-value="handleCreateValue"
      />
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
    <AttributeDialog 
      v-model="showDialog"
      :attribute="editingAttribute"
      @save="handleSave"
    />

    <!-- Value Dialog -->
    <AttributeValueDialog 
      v-model="showValueDialog"
      :attribute-type="editingValue?.attribute?.type || attributes.find(a => a.id === editingValue?.attributeId)?.type || 'select'"
      :value="editingValue"
      @save="handleSaveValue"
    />

    <ConfirmDialog ref="confirmRef" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAttributes } from '@/admin/composable/useAttributes'
import AdminCard from '@/admin/components/ui/AdminCard.vue'
import Skeletons from '@/admin/components/ui/Skeletons.vue'
import AttributeStats from '@/admin/components/attributes/AttributeStats.vue'
import AttributeCard from '@/admin/components/attributes/AttributeCard.vue'
import AttributeDialog from '@/admin/components/attributes/AttributeDialog.vue'
import AttributeValueDialog from '@/admin/components/attributes/AttributeValueDialog.vue'
import ConfirmDialog from '@/admin/components/ui/ConfirmDialog.vue'
import { LoaderCircle, Plus } from 'lucide-vue-next'
import { message } from 'ant-design-vue'

const {
  store,
  attributes,
  valuesByAttrId,
  isLoading,
  totalAttributes,
  variantDefiningAttributes,
  colorAttributes,
  selectAttributes,
  openCreate,
  edit,
  save,
  addNewValue,
  removeValue,
  refresh,
  toggleActive,
  toggleAttributeValue,
  ensureInitialized,
  newValueByAttrId,
  newColorByAttrId,
  hasMoreValues,
  getValuesTotal,
  loadMoreValues
} = useAttributes()

// Local state for dialog
const showDialog = ref(false)
const editingAttribute = ref({})

// Local state for value dialog
const showValueDialog = ref(false)
const editingValue = ref(null)

// Override edit function to handle dialog state
const handleEdit = (attr) => {
  editingAttribute.value = { ...attr }
  showDialog.value = true
}

// Override openCreate function
const handleCreate = () => {
  editingAttribute.value = {}
  showDialog.value = true
}

// Override save function
const handleSave = async (data) => {
  try {
    await save(data)
    showDialog.value = false
    editingAttribute.value = {}
    // Refresh data sau khi lưu
    await refresh()
    message.success('Thao tác thuộc tính thành công!')
  } catch (error) {
    console.error('Lỗi khi lưu thuộc tính:', error)
    message.error('Thao tác thuộc tính thất bại!')
  }
}

// Override addNewValue to handle the new data structure
const handleAddValue = (attributeId, data) => {
  // Gọi addNewValue với cả attributeId và data
  addNewValue(attributeId, data)
}

// Handle load more values for a specific attribute
const handleLoadMoreValues = async (attributeId) => {
  await loadMoreValues(attributeId)
}

// Handle edit attribute value
const handleEditValue = (value) => {
  // Đảm bảo value có đúng cấu trúc
  editingValue.value = {
    ...value,
    attributeId: value.attributeId || value.attribute?.id || editingAttribute.value?.id
  }
  showValueDialog.value = true
}

// Handle create new value for an attribute
const handleCreateValue = (attribute) => {
  editingValue.value = {
    id: null,
    value: '',
    attributeId: attribute.id,
    attribute: attribute
  }
  showValueDialog.value = true
}

// Handle toggle attribute value visibility
const handleToggleValue = async (data) => {
  const { id, isActive } = data
  
  if (!isActive) {
    // Khi ẩn giá trị, hiển thị confirm dialog
    const ok = await confirmRef.value?.open?.({
      title: 'Ẩn giá trị thuộc tính?',
      message: `Giá trị này sẽ bị ẩn và không thể chọn khi tạo sản phẩm.\nBạn vẫn muốn tiếp tục?`,
      confirmText: 'Ẩn',
      cancelText: 'Hủy',
      confirmType: 'danger',
    })
    if (!ok) return
  }
  
  await toggleAttributeValue(id, isActive)
}

// Handle save attribute value
const handleSaveValue = async (data) => {
  const { id, data: valueData } = data
  
  if (id) {
    // Update existing value
    await store.updateValue(id, valueData)
  } else {
    // Create new value - cần có attributeId
    const attributeId = editingValue.value?.attributeId
    if (!attributeId) {
      console.error('Missing attributeId for new value')
      return
    }
    
    await addNewValue(attributeId, {
      value: valueData.value,
      meta: {
        hex: valueData.color_code,
        code: valueData.code,
        image: valueData.image
      }
    })
  }
  
  // Refresh data
  await refresh()
}

// Xác nhận trước khi tắt
const confirmRef = ref(null)
const confirmToggle = async (attr) => {
  if (attr.isActive) {
    const ok = await confirmRef.value?.open?.({
      title: 'Tắt thuộc tính?',
      message: `Thuộc tính "${attr.name}" sẽ bị tắt và không thể chọn khi tạo sản phẩm.\nBạn vẫn muốn tiếp tục?`,
      confirmText: 'Tắt',
      cancelText: 'Hủy',
      confirmType: 'danger',
    })
    if (!ok) return
  }
  await toggleActive(attr)
}

onMounted(async () => {
  await ensureInitialized()
})
</script>

<style scoped>
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


