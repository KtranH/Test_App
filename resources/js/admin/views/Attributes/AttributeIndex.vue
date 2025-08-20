<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <h1 class="text-xl font-semibold tracking-tight">Thuộc tính</h1>
      <button class="px-3 py-2 border border-black/15 rounded-lg hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/20" @click="openCreate()">
        Thêm thuộc tính
      </button>
    </header>

    <div v-if="isLoading" class="p-4 border rounded-lg text-sm">Đang tải thuộc tính...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="attr in attributes" :key="attr.id" class="border border-black/10 rounded-lg p-4 hover:bg-black/5 transition-colors">
        <div class="flex items-start justify-between">
          <div>
            <div class="font-medium">{{ attr.name }}</div>
            <div class="text-xs text-black/50">{{ attr.code }} · {{ attr.type }} · {{ attr.isVariantDefining ? 'Dùng tạo biến thể' : 'Không tạo biến thể' }}</div>
          </div>
          <div class="space-x-2">
            <button class="text-xs px-2 py-1 border rounded-lg hover:bg-black/5" @click="edit(attr)">Sửa</button>
            <button class="text-xs px-2 py-1 border rounded-lg hover:bg-black/5" @click="remove(attr.id)">Xóa</button>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-xs mb-2 text-black/60">Giá trị</div>
          <div class="flex flex-wrap gap-2">
            <span v-for="v in valuesByAttrId[attr.id] || []" :key="v.id" class="text-xs border border-black/15 px-2 py-1 rounded-lg inline-flex items-center gap-2 bg-white/60">
              <span v-if="attr.type === 'color'" class="w-3 h-3 rounded-full border" :style="{ background: v.meta?.hex || v.value.toLowerCase() }" />
              {{ v.value }}
              <button class="ml-1" @click="removeValue(v.id)">×</button>
            </span>
          </div>
          <form class="mt-3 flex gap-2" @submit.prevent="addNewValue(attr.id)">
            <input v-model="newValue" placeholder="Nhập giá trị..." class="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black/20" />
            <input v-if="attr.type === 'color'" v-model="newColor" type="color" class="w-10 h-10 p-0 border rounded-lg" />
            <button class="px-3 py-2 border rounded-lg hover:bg-black/5">Thêm</button>
          </form>
        </div>
      </div>
    </div>

    <dialog ref="dialogRef" class="p-0 rounded-lg border border-black/20">
      <form method="dialog" class="min-w-[340px] p-4 space-y-3" @submit.prevent>
        <h3 class="font-medium">{{ form.id ? 'Sửa thuộc tính' : 'Thêm thuộc tính' }}</h3>
        <div class="space-y-2">
          <input v-model="form.name" placeholder="Tên (ví dụ: Color)" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black/20 outline-none" />
          <input v-model="form.code" placeholder="Mã (ví dụ: color)" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black/20 outline-none" />
          <select v-model="form.type" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black/20 outline-none">
            <option value="select">Select</option>
            <option value="color">Color</option>
            <option value="text">Text</option>
          </select>
          <label class="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="form.isVariantDefining" /> Dùng để tạo biến thể
          </label>
        </div>
        <div class="pt-2 flex justify-end gap-2">
          <button class="px-3 py-2 border rounded-lg hover:bg-black/5" @click="closeDialog">Hủy</button>
          <button class="px-3 py-2 border rounded-lg hover:bg-black/5" @click="save">Lưu</button>
        </div>
      </form>
    </dialog>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAttributeStore } from '@/admin/stores/attribute.store'

const store = useAttributeStore()
const { attributes, valuesByAttrId, isLoading } = storeToRefs(store)
const { createAttribute, updateAttribute, removeAttribute, addValue, removeValue, fetchAll } = store

const dialogRef = ref(null)
const form = ref({ id: null, name: '', code: '', type: 'select', isVariantDefining: false })

const newValue = ref('')
const newColor = ref('#000000')

onMounted(async () => {
  await fetchAll()
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
dialog::backdrop { background: rgba(0,0,0,.2); }
</style>


