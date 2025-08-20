<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <h1 class="text-xl font-semibold tracking-tight">Danh mục</h1>
      <button class="px-3 py-2 border border-black/15 rounded-lg hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/20" @click="openCreate()">Thêm danh mục</button>
    </header>

    <div v-if="isLoading" class="p-4 border rounded-lg text-sm">Đang tải danh mục...</div>

    <ul v-else class="space-y-2">
      <li v-for="cat in categories" :key="cat.id" class="border border-black/10 rounded-lg p-3 flex items-center justify-between hover:bg-black/5 transition-colors">
        <div>
          <div class="font-medium">{{ cat.name }}</div>
          <div class="text-xs text-black/50">Slug: {{ cat.slug }} · {{ cat.isActive ? 'Active' : 'Inactive' }}</div>
        </div>
        <div class="space-x-2">
          <button class="text-xs px-2 py-1 border rounded-lg hover:bg-black/5" @click="edit(cat)">Sửa</button>
          <button class="text-xs px-2 py-1 border rounded-lg hover:bg-black/5" @click="remove(cat.id)">Xóa</button>
        </div>
      </li>
    </ul>

    <dialog ref="dialogRef" class="p-0 rounded-lg border border-black/20">
      <form method="dialog" class="min-w-[340px] p-4 space-y-3" @submit.prevent>
        <h3 class="font-medium">{{ form.id ? 'Sửa danh mục' : 'Thêm danh mục' }}</h3>
        <div class="space-y-2">
          <input v-model="form.name" placeholder="Tên" class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black/20" />
          <input v-model="form.slug" placeholder="Slug" class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black/20" />
          <select v-model="form.parentId" class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black/20">
            <option :value="null">Không có danh mục cha</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <label class="inline-flex items-center gap-2 text-sm"><input type="checkbox" v-model="form.isActive" /> Hiển thị</label>
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
import { useCategoryStore } from '@/admin/stores/category.store'

const store = useCategoryStore()
const { categories, isLoading } = storeToRefs(store)
const { createCategory, updateCategory, removeCategory, fetchAll } = store

const dialogRef = ref(null)
const form = ref({ id: null, name: '', slug: '', parentId: null, isActive: true })

onMounted(async () => {
  await fetchAll()
})

const openCreate = () => { form.value = { id: null, name: '', slug: '', parentId: null, isActive: true }; dialogRef.value?.showModal() }
const edit = (cat) => { form.value = { ...cat }; dialogRef.value?.showModal() }
const closeDialog = () => dialogRef.value?.close()
const save = () => {
  if (!form.value.name || !form.value.slug) return
  if (form.value.id) updateCategory(form.value.id, { ...form.value })
  else createCategory({ ...form.value })
  closeDialog()
}
const remove = (id) => removeCategory(id)
</script>

<style scoped>
dialog::backdrop { background: rgba(0,0,0,.2); }
</style>


