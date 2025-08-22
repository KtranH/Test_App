<template>
  <div class="overflow-hidden" data-aos="fade-up" data-aos-duration="1400">
    <table class="w-full text-sm">
      <thead class="bg-gradient-to-r from-blue-50 to-purple-50 text-left">
        <tr>
          <th class="p-4 font-semibold text-gray-700">Tên sản phẩm</th>
          <th class="p-4 font-semibold text-gray-700">Danh mục</th>
          <th class="p-4 font-semibold text-gray-700">Trạng thái</th>
          <th class="p-4 font-semibold text-gray-700 w-64">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="p in products" :key="p.id">
          <tr class="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <Package class="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ p.name }}</div>
                  <div class="text-xs text-gray-500">{{ p.slug }}</div>
                </div>
              </div>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <Folder class="h-4 w-4 text-gray-400" />
                <span class="text-gray-700">{{ categoryName(p.categoryId) }}</span>
              </div>
            </td>
            <td class="p-4">
              <span v-if="p.status === 'active'" class="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                <CheckCheck class="h-3 w-3" />
                Đang hoạt động
              </span>
              <span v-else-if="p.status === 'draft'" class="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                <FileText class="h-3 w-3" />
                Nháp
              </span>
              <span v-else class="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                <Archive class="h-3 w-3" />
                Lưu trữ
              </span>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <button @click="$emit('toggleExpand', p)" class="group/btn inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                  <Blend class="h-4 w-4 text-gray-600 group-hover/btn:text-blue-600"/>
                </button>
                <!-- Thêm biến thể cho sản phẩm -->
                <RouterLink :to="{ name: 'admin.products.variants.create', params: { id: p.id } }" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200">
                  <Plus class="h-4 w-4 text-gray-600" />
                </RouterLink>
                <RouterLink :to="{ name: 'admin.products.edit', params: { id: p.id } }" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200">
                  <Edit class="h-4 w-4 text-gray-600" />
                </RouterLink>
                <button @click="$emit('remove', p.id)" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200">
                  <Trash2 class="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </td>
          </tr>
          
          <!-- Variants Row -->
          <tr v-if="expandedId === p.id" :key="p.id + '-variants'">
            <td colspan="4" class="p-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
              <div class="p-6 border-t border-gray-200">
                <div v-if="rowLoading[p.id]" class="py-4">
                  <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span class="ml-3 text-gray-600">Đang tải biến thể...</span>
                  </div>
                </div>
                <div v-else-if="(p.variants?.length || 0) === 0" class="text-center py-8">
                  <div class="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Blend class="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Chưa có biến thể</h3>
                  <p class="text-gray-600">Sản phẩm này chưa có biến thể nào.</p>
                </div>
                <div v-else class="space-y-4">
                  <div class="flex items-center gap-2 mb-4">
                    <Blend class="h-5 w-5 text-blue-600" />
                    <h4 class="font-semibold text-gray-900">Danh sách biến thể</h4>
                    <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{{ p.variants.length }} biến thể</span>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="w-full text-xs">
                      <thead class="bg-white/80 text-left">
                        <tr>
                          <th class="p-3 font-medium text-gray-700">SKU</th>
                          <th class="p-3 font-medium text-gray-700">Tên</th>
                          <th class="p-3 font-medium text-gray-700">Giá</th>
                          <th class="p-3 font-medium text-gray-700">Trạng thái</th>
                          <th class="p-3 font-medium text-gray-700">Thuộc tính</th>
                          <th class="p-3 font-medium text-gray-700 w-24">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="v in p.variants" :key="v.id" class="border-t border-gray-100 hover:bg-white/60 transition-colors duration-200">
                          <td class="p-3">
                            <div class="flex items-center gap-2">
                              <Hash class="h-3 w-3 text-gray-400" />
                              <span class="font-mono text-gray-700">{{ v.sku || '-' }}</span>
                            </div>
                          </td>
                          <td class="p-3 font-medium text-gray-900">{{ v.name || '-' }}</td>
                          <td class="p-3">
                            <span v-if="p.basePrice != null" class="text-emerald-600 font-medium">{{ formatPrice(p.basePrice) }}</span>
                            <span v-else class="text-gray-700">{{ formatPrice(v.price ?? v.salePrice ?? 0) }}</span>
                          </td>
                          <td class="p-3">
                            <div class="flex items-center gap-2">
                              <CheckCheck v-if="v.isActive" class="h-4 w-4 text-emerald-600" />
                              <X v-else class="h-4 w-4 text-gray-400" />
                              <span class="text-xs">{{ v.isActive ? 'Hoạt động' : 'Không hoạt động' }}</span>
                            </div>
                          </td>
                          <td class="p-3">
                            <div class="flex flex-wrap gap-1">
                              <span v-for="(val, key) in v.attributeCombination" :key="key" class="inline-flex items-center gap-1 px-2 py-1 text-[10px] rounded-lg border border-gray-200 bg-white text-gray-700">
                                <span class="uppercase font-medium">{{ key }}:</span> {{ val }}
                              </span>
                            </div>
                          </td>
                          <td class="p-3">
                            <div class="flex items-center gap-2">
                              <button @click="$emit('editVariant', p, v)" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700">
                                <Edit class="h-4 w-4" />
                              </button>
                              <button @click="$emit('removeVariant', p, v)" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600">
                                <Trash2 class="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
        
        <!-- Empty State -->
        <tr v-if="products.length === 0">
          <td colspan="4" class="p-8">
            <div class="text-center">
              <div class="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                <Package class="h-10 w-10 text-blue-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Không có sản phẩm</h3>
              <p class="text-gray-600 mb-4">Hãy thử thay đổi bộ lọc hoặc thêm sản phẩm mới.</p>
              <RouterLink
                :to="{ name: 'admin.products.create' }"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              >
                <Plus class="h-4 w-4" />
                Tạo sản phẩm đầu tiên
              </RouterLink>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { 
  Package, Blend, Edit, Trash2, CheckCheck, X, 
  Plus, Folder, FileText, Archive, Hash
} from 'lucide-vue-next'

defineProps({
  products: { type: Array, required: true },
  expandedId: { type: [String, Number], default: null },
  rowLoading: { type: Object, default: () => ({}) },
  categoryName: { type: Function, required: true },
  formatPrice: { type: Function, required: true }
})

defineEmits(['toggleExpand', 'remove', 'editVariant', 'removeVariant'])
</script>
