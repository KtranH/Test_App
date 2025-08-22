<template>
  <dialog ref="dialogRef" class="p-0 rounded-2xl border border-gray-200 shadow-2xl">
    <form method="dialog" class="min-w-[520px] p-6 space-y-5" @submit.prevent>
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
          <Edit class="h-5 w-5 text-blue-700" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Chỉnh sửa biến thể</h3>
          <p class="text-sm text-gray-600">Cập nhật thông tin chung và tồn kho</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-gray-600 mb-1">SKU</label>
          <input v-model="form.sku" class="w-full px-3 py-2 border border-gray-300 rounded-xl" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Tên</label>
          <input v-model="form.name" class="w-full px-3 py-2 border border-gray-300 rounded-xl" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Giá</label>
          <input type="number" min="0" v-model.number="form.price" class="w-full px-3 py-2 border border-gray-300 rounded-xl" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Giá KM</label>
          <input type="number" min="0" v-model.number="form.salePrice" class="w-full px-3 py-2 border border-gray-300 rounded-xl" />
        </div>

        <div class="md:col-span-2">
          <label class="block text-xs text-gray-600 mb-1">Kích thước / Khối lượng</label>
          <div class="flex flex-wrap gap-2">
            <input type="number" step="0.01" min="0" v-model.number="form.width" class="w-24 px-3 py-2 border border-gray-300 rounded-xl" placeholder="Rộng" />
            <input type="number" step="0.01" min="0" v-model.number="form.height" class="w-24 px-3 py-2 border border-gray-300 rounded-xl" placeholder="Cao" />
            <input type="number" step="0.01" min="0" v-model.number="form.length" class="w-24 px-3 py-2 border border-gray-300 rounded-xl" placeholder="Dài" />
            <input type="number" min="0" v-model.number="form.weight" class="w-24 px-3 py-2 border border-gray-300 rounded-xl" placeholder="Nặng" />
          </div>
        </div>

        <div class="md:col-span-2">
          <label class="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-lg border border-gray-200">
            <input type="checkbox" v-model="form.isActive" class="accent-indigo-600" />
            <span>Hoạt động</span>
          </label>
        </div>

        <div class="md:col-span-2" v-if="chips.length">
          <label class="block text-xs text-gray-600 mb-1">Thuộc tính</label>
          <div class="flex flex-wrap gap-1">
            <span v-for="c in chips" :key="c.k" class="inline-flex items-center gap-1 px-2 py-1 text-[10px] rounded-lg border border-gray-200 bg-white text-gray-700">
              <span class="uppercase font-medium">{{ c.k }}:</span> {{ c.v }}
            </span>
          </div>
        </div>

        <div class="md:col-span-2">
          <div class="flex items-center gap-2 mb-2 text-gray-900 font-medium">
            <PackagePlus class="h-4 w-4" /> Tồn kho
          </div>
          <div class="flex flex-wrap gap-4">
            <div class="space-y-1">
              <div class="text-xs text-gray-600">Số lượng hiện có</div>
              <input type="number" min="0" v-model.number="form.inventory.quantity" class="w-32 px-3 py-2 border border-gray-300 rounded-xl" placeholder="Số lượng" title="Số lượng hiện có trong kho (quantity)" />
            </div>
            <div class="space-y-1">
              <div class="text-xs text-gray-600">Ngưỡng cảnh báo</div>
              <input type="number" min="0" v-model.number="form.inventory.low_stock_threshold" class="w-36 px-3 py-2 border border-gray-300 rounded-xl" placeholder="Ngưỡng cảnh báo" title="Ngưỡng cảnh báo tồn kho thấp (low_stock_threshold)" />
            </div>
            <label class="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-lg border border-gray-200">
              <input type="checkbox" v-model="form.inventory.is_backorder_allowed" class="accent-indigo-600" />
              <span>Cho phép backorder</span>
            </label>
          </div>
        </div>
      </div>

      <div class="pt-2 flex justify-end gap-3">
        <button type="button" class="px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-50" @click="handleCancel">Hủy</button>
        <button type="button" class="px-5 py-2 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg" @click="handleSave">Lưu</button>
      </div>
    </form>
  </dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Edit, PackagePlus } from 'lucide-vue-next'

const dialogRef = ref(null)
const resolver = ref(null)
const form = reactive({
  id: null,
  productId: null,
  sku: '',
  name: '',
  price: null,
  salePrice: null,
  weight: null,
  width: null,
  height: null,
  length: null,
  isActive: true,
  attributeCombination: {},
  inventory: {
    quantity: 0,
    reserved_quantity: 0,
    available_quantity: 0,
    low_stock_threshold: 0,
    is_in_stock: true,
    is_backorder_allowed: false,
  },
})

const chips = computed(() => {
  const out = []
  const ac = form.attributeCombination || {}
  for (const [k, v] of Object.entries(ac)) out.push({ k, v })
  return out
})

const open = (variant = {}, options = {}) => {
  Object.assign(form, {
    id: variant.id ?? null,
    productId: variant.productId ?? null,
    sku: variant.sku ?? '',
    name: variant.name ?? '',
    price: variant.price ?? null,
    salePrice: variant.salePrice ?? null,
    weight: variant.weight ?? null,
    width: variant.width ?? null,
    height: variant.height ?? null,
    length: variant.length ?? null,
    isActive: !!variant.isActive,
    attributeCombination: variant.attributeCombination ?? {},
    inventory: {
      quantity: options.inventory?.quantity ?? 0,
      reserved_quantity: options.inventory?.reserved_quantity ?? 0,
      available_quantity: options.inventory?.available_quantity ?? Math.max(0, (options.inventory?.quantity ?? 0) - (options.inventory?.reserved_quantity ?? 0)),
      low_stock_threshold: options.inventory?.low_stock_threshold ?? 0,
      is_in_stock: options.inventory?.is_in_stock ?? true,
      is_backorder_allowed: options.inventory?.is_backorder_allowed ?? false,
    },
  })
  dialogRef.value?.showModal()
  return new Promise((resolve) => { resolver.value = resolve })
}

const close = () => dialogRef.value?.close()

const handleSave = () => {
  resolver.value?.({ ...form })
  resolver.value = null
  close()
}

const handleCancel = () => {
  resolver.value?.(null)
  resolver.value = null
  close()
}

defineExpose({ open, close })
</script>

<style scoped>
dialog::backdrop {
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
}
</style>


