<template>
  <section class="space-y-6">
    <ButtonBack />
    <div ref="headerRef" :class="['relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6 text-indigo-900 transition-shadow', headerHighlight ? 'ring-2 ring-indigo-300 shadow-lg' : '']">
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
            <div v-for="attr in variantAttributes" :key="attr.id" class="space-y-2">
              <div v-if="attr.isActive">
                <div class="text-sm font-medium text-gray-800 mb-2">{{ attr.name }}</div>
                
                <!-- Tìm kiếm cho thuộc tính này -->
                <div class="relative mb-2">
                  <input 
                    v-model="searchQueries[attr.id]" 
                    type="text" 
                    :placeholder="`Tìm ${attr.name.toLowerCase()}...`"
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                
                <!-- Danh sách giá trị thuộc tính với phân trang -->
                <div class="space-y-2">
                  <div v-for="val in paginatedValues(attr.id)" :key="val.id" class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/60 cursor-pointer">
                    <input class="accent-indigo-600" type="checkbox" :value="val.id" v-model="selected[attr.id]" />
                    <span class="inline-flex items-center gap-2 text-sm flex-1 min-w-0">
                      <span v-if="attr.type==='color'" class="w-3 h-3 rounded-full border flex-shrink-0" :style="{ background: val.meta?.hex || val.value?.toLowerCase?.() }" />
                      <span class="truncate">{{ val.value }}</span>
                    </span>
                  </div>
                  
                  <!-- Phân trang cho thuộc tính này -->
                  <div v-if="getFilteredValues(attr.id).length > itemsPerPage" class="flex items-center justify-between text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
                    <span>{{ getCurrentPageInfo(attr.id) }}</span>
                    <div class="flex gap-1">
                      <button 
                        @click="prevPage(attr.id)"
                        :disabled="currentPages[attr.id] <= 1"
                        class="px-2 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        ←
                      </button>
                      <button 
                        @click="nextPage(attr.id)"
                        :disabled="currentPages[attr.id] >= getTotalPages(attr.id)"
                        class="px-2 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
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
                    <input v-model="fv.sku" class="w-40 px-2 py-1 border border-gray-200 rounded-lg" :class="rowErrors[fv.__k]?.sku ? 'border-red-400' : ''" @input="clearRowError(fv.__k, 'sku')" />
                    <div v-if="rowErrors[fv.__k]?.sku" class="text-[11px] text-red-600 mt-1">{{ rowErrors[fv.__k].sku }}</div>
                  </td>
                  <td class="p-3">
                    <input v-model="fv.name" class="w-48 px-2 py-1 border border-gray-200 rounded-lg" :class="rowErrors[fv.__k]?.name ? 'border-red-400' : ''" @input="clearRowError(fv.__k, 'name')" />
                    <div v-if="rowErrors[fv.__k]?.name" class="text-[11px] text-red-600 mt-1">{{ rowErrors[fv.__k].name }}</div>
                  </td>
                  <td class="p-3">
                    <input type="number" min="0" v-model.number="fv.price" class="w-28 px-2 py-1 border border-gray-200 rounded-lg" :class="rowErrors[fv.__k]?.price ? 'border-red-400' : ''" @input="clearRowError(fv.__k, 'price')" />
                    <div v-if="rowErrors[fv.__k]?.price" class="text-[11px] text-red-600 mt-1">{{ rowErrors[fv.__k].price }}</div>
                  </td>
                  <td class="p-3">
                    <input type="number" min="0" v-model.number="fv.salePrice" class="w-28 px-2 py-1 border border-gray-200 rounded-lg" />
                  </td>
                  <td class="p-3">
                    <div class="flex gap-2">
                      <input type="number" min="0" step="0.01" v-model.number="fv.width" class="w-20 px-2 py-1 border border-gray-200 rounded-lg" :class="rowErrors[fv.__k]?.width ? 'border-red-400' : ''" placeholder="Rộng" @input="clearRowError(fv.__k, 'width')" />
                      <input type="number" min="0" step="0.01" v-model.number="fv.height" class="w-20 px-2 py-1 border border-gray-200 rounded-lg" :class="rowErrors[fv.__k]?.height ? 'border-red-400' : ''" placeholder="Cao" @input="clearRowError(fv.__k, 'height')" />
                      <input type="number" min="0" step="0.01" v-model.number="fv.length" class="w-20 px-2 py-1 border border-gray-200 rounded-lg" :class="rowErrors[fv.__k]?.length ? 'border-red-400' : ''" placeholder="Dài" @input="clearRowError(fv.__k, 'length')" />
                      <input type="number" min="0" v-model.number="fv.weight" class="w-20 px-2 py-1 border border-gray-200 rounded-lg" :class="rowErrors[fv.__k]?.weight ? 'border-red-400' : ''" placeholder="Nặng" @input="clearRowError(fv.__k, 'weight')" />
                    </div>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span v-if="rowErrors[fv.__k]?.width" class="text-[11px] text-red-600">{{ rowErrors[fv.__k].width }}</span>
                      <span v-if="rowErrors[fv.__k]?.height" class="text-[11px] text-red-600">{{ rowErrors[fv.__k].height }}</span>
                      <span v-if="rowErrors[fv.__k]?.length" class="text-[11px] text-red-600">{{ rowErrors[fv.__k].length }}</span>
                      <span v-if="rowErrors[fv.__k]?.weight" class="text-[11px] text-red-600">{{ rowErrors[fv.__k].weight }}</span>
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
          <RouterLink :to="{ name: 'admin.products' }" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
            <ArrowLeft class="h-4 w-4" />
            <span class="text-sm font-medium">Quay lại</span>
          </RouterLink>
          <div class="flex items-center gap-2">
            <button @click="applyBulkPrice" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50">
              <DollarSign class="h-4 w-4" />
              Áp giá mặc định
            </button>
            <button @click="saveToLocal" class="inline-flex font-bold items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700">
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Layers, Settings2, Wrench, Sparkles, Trash2, Save, ArrowLeft, DollarSign } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/admin/stores/product.store'
import { useAttributeStore } from '@/admin/stores/attribute.store'
import { generateVariantsFromMap } from '@/admin/services/variant.util'
import ButtonBack from '@/admin/components/ui/ButtonBack.vue'
import { generateSku } from '@/admin/services/sku'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
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

// Thêm state cho phân trang và tìm kiếm
const searchQueries = reactive({})
const currentPages = reactive({})
const itemsPerPage = 8 // Hiển thị 8 items mỗi trang

const variantsForm = ref([])

// Lỗi từng dòng theo key __k
const rowErrors = ref({})
const clearRowError = (key, field) => {
  if (!rowErrors.value[key]) return
  if (field) delete rowErrors.value[key][field]
  if (rowErrors.value[key] && Object.keys(rowErrors.value[key]).length === 0) delete rowErrors.value[key]
}

const validateRow = (fv) => {
  const errs = {}
  if (!String(fv.sku || '').trim()) errs.sku = 'SKU là bắt buộc'
  if (!String(fv.name || '').trim()) errs.name = 'Tên biến thể là bắt buộc'
  if (fv.price == null || Number.isNaN(Number(fv.price))) errs.price = 'Giá không hợp lệ'
  if (Number(fv.price) < 0) errs.price = 'Giá không thể âm'
  // Validate kích thước/khối lượng nếu có nhập thì phải >= 0
  const numericNonNegative = (n) => n == null || n === '' || (!Number.isNaN(Number(n)) && Number(n) >= 0)
  if (!numericNonNegative(fv.weight)) errs.weight = 'Khối lượng không hợp lệ'
  if (!numericNonNegative(fv.width)) errs.width = 'Rộng không hợp lệ'
  if (!numericNonNegative(fv.height)) errs.height = 'Cao không hợp lệ'
  if (!numericNonNegative(fv.length)) errs.length = 'Dài không hợp lệ'
  return errs
}

const validateAll = () => {
  const allErrors = {}
  for (const fv of variantsForm.value) {
    const errs = validateRow(fv)
    if (Object.keys(errs).length) allErrors[fv.__k] = errs
  }
  rowErrors.value = allErrors
  return Object.keys(allErrors).length === 0
}

// Logic phân trang và tìm kiếm
const getFilteredValues = (attrId) => {
  const query = searchQueries[attrId] || ''
  const values = valuesByAttrId.value[attrId] || []
  
  if (!query.trim()) return values
  
  return values.filter(val => 
    val.value.toLowerCase().includes(query.toLowerCase())
  )
}

const paginatedValues = (attrId) => {
  const filtered = getFilteredValues(attrId)
  const start = ((currentPages[attrId] || 1) - 1) * itemsPerPage
  const end = start + itemsPerPage
  
  return filtered.slice(start, end)
}

const getTotalPages = (attrId) => {
  const filtered = getFilteredValues(attrId)
  return Math.ceil(filtered.length / itemsPerPage)
}

const getCurrentPageInfo = (attrId) => {
  const current = currentPages[attrId] || 1
  const total = getTotalPages(attrId)
  const filtered = getFilteredValues(attrId)
  
  if (total <= 1) return `${filtered.length} ${filtered.length === 1 ? 'lựa chọn' : 'lựa chọn'}`
  
  const start = ((current - 1) * itemsPerPage) + 1
  const end = Math.min(current * itemsPerPage, filtered.length)
  
  return `${start}-${end} / ${filtered.length}`
}

const prevPage = (attrId) => {
  if (currentPages[attrId] > 1) {
    currentPages[attrId]--
  }
}

const nextPage = (attrId) => {
  const total = getTotalPages(attrId)
  if (currentPages[attrId] < total) {
    currentPages[attrId]++
  }
}

// Reset trang khi tìm kiếm
watch(searchQueries, () => {
  Object.keys(currentPages).forEach(attrId => {
    currentPages[attrId] = 1
  })
})

const attrLabel = (attrId) => attributes.value.find(a => String(a.id) === String(attrId))?.name || attrId
const attrCodeOrName = (attrId) => {
  const a = attributes.value.find(x => String(x.id) === String(attrId))
  if (!a) return String(attrId)
  const key = a.code || a.name || String(attrId)
  return String(key).toLowerCase()
}
const valueLabel = (valId) => {
  const lists = valuesByAttrId.value
  for (const [k, arr] of Object.entries(lists)) {
    const f = (arr || []).find(v => String(v.id) === String(valId))
    if (f) return f.value
  }
  return valId
}
// build pretty attribute combination for API: { color: 'black', size: 'l' }
const buildPrettyCombination = (combo) => {
  const out = {}
  for (const [attrId, valId] of Object.entries(combo || {})) {
    const key = attrCodeOrName(attrId)
    const val = valueLabel(valId)
    out[key] = val
  }
  return out
}

const headerRef = ref(null)
const headerHighlight = ref(false)

const generate = () => {
  try
  {
     const generated = generateVariantsFromMap(id, selected)
    const base = generateSku(product.value?.name || 'PRODUCT')
    variantsForm.value = generated.map((g, index) => ({
      __k: `${g.sku}-${index}-${Date.now()}`,
      productId: id,
      sku: `${skuPrefix.value || ''}${base}-V${index + 1}`,
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
    rowErrors.value = {}
    message.success('Đã tạo biến thể')
    // Focus lên đầu trang và highlight header
    try {
      headerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      headerHighlight.value = true
      setTimeout(() => { headerHighlight.value = false }, 900)
    } catch {}
  }
  catch (error) {
    console.error('Error generating variants:', error)
    message.error('Lỗi khi tạo biến thể')
  }
}

const removeRow = (idx) => {
  try {
    variantsForm.value.splice(idx, 1)
    message.success('Đã xóa biến thể')
  }
  catch (error) {
    console.error('Error removing row:', error)
    message.error('Lỗi khi xóa biến thể')
  }
}

const applyBulkPrice = () => {
  variantsForm.value = variantsForm.value.map(v => ({ ...v, price: Number(defaultPrice.value || 0) }))
}

const saveToLocal = () => {
  // Validate trước khi lưu
  if (!variantsForm.value.length) {
    message.error('Chưa có biến thể nào để lưu')
    return
  }
  if (!validateAll()) {
    message.error('Vui lòng điền đầy đủ các trường bắt buộc cho biến thể')
    return
  }
  // Tạo danh sách biến thể cục bộ (không gọi API)
  const created = variantsForm.value.map(fv => ({
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
    attributeCombination: buildPrettyCombination(fv.attributeCombination),
  }))

  // Đồng bộ ngay product.variants để bảng ở ProductIndex hiển thị tức thì
  if (product.value) {
    const existing = Array.isArray(product.value.variants) ? product.value.variants : []
    const normalized = created.map(v => ({
      id: v.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
    if (typeof productStore.updateProductLocal === 'function') {
      productStore.updateProductLocal(product.value.id, { variants: existing.concat(normalized) })
    } else {
      // Fallback: cập nhật trực tiếp đối tượng đang hiển thị
      product.value.variants = existing.concat(normalized)
    }
  }
  message.success('Đã lưu biến thể (local)')
  // Điều hướng về danh sách sản phẩm
  router.push({ name: 'admin.products' })
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      productStore.ensureInitialized(),
      attributeStore.ensureInitialized(),
    ])
    // Khởi tạo mảng chọn cho từng thuộc tính biến thể
    variantAttributes.value.forEach(attr => {
      if (!Array.isArray(selected[attr.id])) selected[attr.id] = []
    })
  } finally {
    loading.value = false
  }
})

// Theo dõi thay đổi danh sách thuộc tính để đảm bảo selected[attrId] luôn là mảng
watch(variantAttributes, (list) => {
  list.forEach(attr => {
    if (!Array.isArray(selected[attr.id])) selected[attr.id] = []
    if (!searchQueries[attr.id]) searchQueries[attr.id] = ''
    if (!currentPages[attr.id]) currentPages[attr.id] = 1
  })
}, { immediate: true })
</script>

<style scoped>
</style>


