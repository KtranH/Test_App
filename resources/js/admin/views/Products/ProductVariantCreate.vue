<template>
  <section class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6 text-indigo-900">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Layers class="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 class="text-xl font-bold mb-1">Thêm biến thể</h1>
          <p class="text-black/80">Tạo biến thể cho sản phẩm: <span class="font-semibold">{{ product?.name || '...' }}</span></p>
        </div>
      </div>
      <div class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent" />
    </div>

    <div v-if="loading" class="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <span class="ml-3 text-gray-600">Đang tải...</span>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Cột chọn thuộc tính/ giá trị -->
      <div class="lg:col-span-1 space-y-4">
        <div class="rounded-2xl bg-white p-5 shadow border border-gray-100">
          <div class="flex items-center gap-2 mb-3">
            <Settings2 class="h-5 w-5 text-indigo-600" />
            <h2 class="font-semibold text-gray-900">Thuộc tính biến thể</h2>
          </div>
          <div class="space-y-4">
            <div v-for="attr in variantAttributes" :key="attr.id" class="">
              <div class="text-sm font-medium text-gray-800 mb-2">{{ attr.name }}</div>
              <div class="flex flex-wrap gap-2">
                <label v-for="val in (valuesByAttrId[attr.id] || [])" :key="val.id" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/60 cursor-pointer">
                  <input class="accent-indigo-600" type="checkbox" :value="val.id" v-model="selected[attr.id]" />
                  <span class="inline-flex items-center gap-2 text-sm">
                    <span v-if="attr.type==='color'" class="w-3 h-3 rounded-full border" :style="{ background: val.meta?.hex || val.value?.toLowerCase?.() }" />
                    {{ val.value }}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-5 shadow border border-gray-100">
          <div class="flex items-center gap-2 mb-3">
            <Wrench class="h-5 w-5 text-indigo-600" />
            <h2 class="font-semibold text-gray-900">Cài đặt gợi ý</h2>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label class="block text-gray-600 mb-1">Tiền tố SKU</label>
              <input v-model="skuPrefix" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="VD: SKU-" />
            </div>
            <div>
              <label class="block text-gray-600 mb-1">Giá mặc định</label>
              <input type="number" min="0" v-model.number="defaultPrice" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="0" />
            </div>
          </div>
          <div class="mt-3 flex justify-end">
            <button @click="generate" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700">
              <Sparkles class="h-4 w-4" />
              Tạo biến thể
            </button>
          </div>
        </div>
      </div>

      <!-- Cột kết quả và form chi tiết -->
      <div class="lg:col-span-2 space-y-4">
        <div class="rounded-2xl bg-white p-5 shadow border border-gray-100">
          <div class="flex items-center gap-2 mb-3">
            <Layers class="h-5 w-5 text-indigo-600" />
            <h2 class="font-semibold text-gray-900">Danh sách biến thể</h2>
            <span class="ml-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{{ variantsForm.length }}</span>
          </div>

          <div v-if="!variantsForm.length" class="text-sm text-gray-600">Chọn thuộc tính và nhấn "Tạo biến thể" để sinh các tổ hợp.</div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100 text-left">
                <tr>
                  <th class="p-3">SKU</th>
                  <th class="p-3">Tên</th>
                  <th class="p-3">Giá</th>
                  <th class="p-3">Giá KM</th>
                  <th class="p-3">Kích thước/Khối lượng</th>
                  <th class="p-3">Trạng thái</th>
                  <th class="p-3">Thuộc tính</th>
                  <th class="p-3">Tồn kho</th>
                  <th class="p-3 w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(fv, idx) in variantsForm" :key="fv.__k" class="border-t border-gray-100">
                  <td class="p-3">
                    <input v-model="fv.sku" class="w-40 px-2 py-1 border border-gray-200 rounded-lg" />
                  </td>
                  <td class="p-3">
                    <input v-model="fv.name" class="w-48 px-2 py-1 border border-gray-200 rounded-lg" />
                  </td>
                  <td class="p-3">
                    <input type="number" min="0" v-model.number="fv.price" class="w-28 px-2 py-1 border border-gray-200 rounded-lg" />
                  </td>
                  <td class="p-3">
                    <input type="number" min="0" v-model.number="fv.salePrice" class="w-28 px-2 py-1 border border-gray-200 rounded-lg" />
                  </td>
                  <td class="p-3">
                    <div class="flex gap-2">
                      <input type="number" min="0" step="0.01" v-model.number="fv.width" class="w-20 px-2 py-1 border border-gray-200 rounded-lg" placeholder="Rộng" />
                      <input type="number" min="0" step="0.01" v-model.number="fv.height" class="w-20 px-2 py-1 border border-gray-200 rounded-lg" placeholder="Cao" />
                      <input type="number" min="0" step="0.01" v-model.number="fv.length" class="w-20 px-2 py-1 border border-gray-200 rounded-lg" placeholder="Dài" />
                      <input type="number" min="0" v-model.number="fv.weight" class="w-20 px-2 py-1 border border-gray-200 rounded-lg" placeholder="Nặng" />
                    </div>
                  </td>
                  <td class="p-3">
                    <label class="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-lg border border-gray-200">
                      <input type="checkbox" v-model="fv.isActive" class="accent-indigo-600" />
                      <span>Active</span>
                    </label>
                  </td>
                  <td class="p-3">
                    <div class="flex flex-wrap gap-1">
                      <span v-for="(valId, attrId) in fv.attributeCombination" :key="attrId" class="inline-flex items-center gap-1 px-2 py-1 text-[10px] rounded-lg border border-gray-200 bg-white text-gray-700">
                        <span class="uppercase font-medium">{{ attrLabel(attrId) }}:</span> {{ valueLabel(valId) }}
                      </span>
                    </div>
                  </td>
                  <td class="p-3">
                    <div class="flex gap-2">
                      <input type="number" min="0" v-model.number="fv.inventory.quantity" class="w-20 px-2 py-1 border border-gray-200 rounded-lg" placeholder="SL" />
                      <input type="number" min="0" v-model.number="fv.inventory.low_stock_threshold" class="w-24 px-2 py-1 border border-gray-200 rounded-lg" placeholder="Ngưỡng" />
                      <label class="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-lg border border-gray-200">
                        <input type="checkbox" v-model="fv.inventory.is_backorder_allowed" class="accent-indigo-600" />
                        <span>Backorder</span>
                      </label>
                    </div>
                  </td>
                  <td class="p-3">
                    <div class="flex items-center gap-2">
                      <button @click="removeRow(idx)" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                        <Trash2 class="h-4 w-4" />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <RouterLink :to="{ name: 'admin.products.edit', params: { id } }" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
            <ArrowLeft class="h-4 w-4" />
            <span class="text-sm font-medium">Quay lại</span>
          </RouterLink>
          <div class="flex items-center gap-2">
            <button @click="applyBulkPrice" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50">
              <DollarSign class="h-4 w-4" />
              Áp giá mặc định
            </button>
            <button @click="saveToLocal" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700">
              <Save class="h-4 w-4" />
              Lưu (local)
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Layers, Settings2, Wrench, Sparkles, Trash2, Save, ArrowLeft, DollarSign } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/admin/stores/product.store'
import { useAttributeStore } from '@/admin/stores/attribute.store'
import { generateVariantsFromMap } from '@/admin/services/variant.util'

const route = useRoute()
const id = route.params.id

const productStore = useProductStore()
const attributeStore = useAttributeStore()

const { products } = storeToRefs(productStore)
const product = computed(() => products.value.find(p => String(p.id) === String(id)) || null)
const { valuesByAttrId, attributes } = storeToRefs(attributeStore)
const variantAttributes = computed(() => attributes.value.filter(a => a.isVariantDefining))

const loading = ref(false)

const selected = reactive({})
const skuPrefix = ref('SKU-')
const defaultPrice = ref(0)

const variantsForm = ref([])

const attrLabel = (attrId) => attributes.value.find(a => String(a.id) === String(attrId))?.name || attrId
const valueLabel = (valId) => {
  const lists = valuesByAttrId.value
  for (const [k, arr] of Object.entries(lists)) {
    const f = (arr || []).find(v => String(v.id) === String(valId))
    if (f) return f.value
  }
  return valId
}

const generate = () => {
  const generated = generateVariantsFromMap(id, selected)
  variantsForm.value = generated.map((g, index) => ({
    __k: `${g.sku}-${index}-${Date.now()}`,
    productId: id,
    sku: `${skuPrefix.value}${index + 1}`,
    name: '',
    price: Number(defaultPrice.value || 0),
    salePrice: null,
    weight: null,
    width: null,
    height: null,
    length: null,
    isActive: true,
    attributeCombination: g.options || {},
    inventory: {
      quantity: 0,
      reserved_quantity: 0,
      available_quantity: 0,
      low_stock_threshold: 0,
      is_in_stock: true,
      is_backorder_allowed: false,
    },
  }))
}

const removeRow = (idx) => {
  variantsForm.value.splice(idx, 1)
}

const applyBulkPrice = () => {
  variantsForm.value = variantsForm.value.map(v => ({ ...v, price: Number(defaultPrice.value || 0) }))
}

const saveToLocal = () => {
  // Lưu local: đẩy vào store. Ở đây không gọi API theo yêu cầu chỉ frontend
  const created = []
  for (const fv of variantsForm.value) {
    const v = productStore.upsertVariant({
      id: undefined,
      productId: fv.productId,
      sku: fv.sku,
      name: fv.name,
      price: fv.price,
      salePrice: fv.salePrice,
      weight: fv.weight,
      width: fv.width,
      height: fv.height,
      length: fv.length,
      isActive: fv.isActive,
      attributeCombination: fv.attributeCombination,
    })
    created.push(v)
  }
  // Đồng bộ ngay product.variants để bảng ở ProductIndex hiển thị tức thì
  if (product.value) {
    const existing = Array.isArray(product.value.variants) ? product.value.variants : []
    const normalized = created.map(v => ({
      id: v.id,
      productId: v.productId,
      sku: v.sku,
      name: v.name,
      price: v.price,
      salePrice: v.salePrice,
      weight: v.weight,
      width: v.width,
      height: v.height,
      length: v.length,
      isActive: v.isActive,
      attributeCombination: v.attributeCombination,
      deletedAt: null,
    }))
    productStore.updateProduct(product.value.id, { variants: existing.concat(normalized) })
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      productStore.ensureInitialized(),
      attributeStore.ensureInitialized(),
    ])
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
</style>


