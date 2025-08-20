<template>
  <div class="space-y-4">
    <div class="border border-black/10 rounded-lg p-3">
      <div class="text-sm font-medium mb-2">Chọn thuộc tính để tạo biến thể</div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div v-for="attr in variantAttributes" :key="attr.id" class="space-y-2">
          <div class="text-xs text-black/60">{{ attr.name }}</div>
          <div class="flex flex-wrap gap-2">
            <label v-for="val in (valuesByAttrId[attr.id] || [])" :key="val.id" class="inline-flex items-center gap-2 text-sm px-2 py-1 border rounded-lg hover:bg-black/5">
              <input type="checkbox" :value="val.id" v-model="selected[attr.id]" />
              <span class="inline-flex items-center gap-2">
                <span v-if="attr.type==='color'" class="w-3 h-3 rounded-full border" :style="{ background: val.meta?.hex || val.value.toLowerCase() }" />
                {{ val.value }}
              </span>
            </label>
          </div>
        </div>
      </div>
      <div class="mt-3 flex justify-end">
        <button class="px-3 py-2 border rounded-lg hover:bg-black/5" @click="emitGenerate">Tạo biến thể</button>
      </div>
    </div>

    <div v-if="generated.length" class="border border-black/10 rounded-lg">
      <table class="w-full text-sm">
        <thead class="bg-black/5">
          <tr>
            <th class="p-2 text-left">SKU (gợi ý)</th>
            <th class="p-2 text-left">Giá</th>
            <th class="p-2 text-left">Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in generated" :key="v.sku" class="border-t">
            <td class="p-2">{{ v.sku }}</td>
            <td class="p-2">{{ v.price }}</td>
            <td class="p-2"><code>{{ v.options }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useAttributeStore } from '@/admin/stores/attribute.store'
import { generateVariantsFromMap } from '@/admin/services/variant.util'

const props = defineProps({ productId: { type: String, required: true } })
const emit = defineEmits(['generate'])

const attrStore = useAttributeStore()
const { attributes, valuesByAttrId, fetchAll } = attrStore

const variantAttributes = computed(() => attributes.filter(a => a.isVariantDefining))
const selected = reactive({})

const generated = computed(() => generateVariantsFromMap(props.productId, selected))

const emitGenerate = () => emit('generate', generated.value)

onMounted(async () => {
  if (!attributes.length) {
    await fetchAll()
  }
})
</script>


