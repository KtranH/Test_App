import { useAttributeStore } from '@/admin/stores/attribute.store'
import { useCategoryStore } from '@/admin/stores/category.store'

export const ensureDemoSeed = () => {
  const attrStore = useAttributeStore()
  const catStore = useCategoryStore()
  attrStore.importDefaultsIfEmpty()
  catStore.importDefaultsIfEmpty()
}


