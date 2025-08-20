<template>
  <div class="w-full flex items-center justify-center">
    <svg :viewBox="`0 0 ${size} ${size}`" class="h-40 w-40 select-none">
      <g :transform="`rotate(-90 ${half} ${half})`">
        <circle :cx="half" :cy="half" :r="radius" class="stroke-black/10 fill-none" :stroke-width="thickness" />
        <circle
          :cx="half"
          :cy="half"
          :r="radius"
          class="stroke-black fill-none"
          :stroke-width="thickness"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
        />
      </g>
      <text :x="half" :y="half" text-anchor="middle" dominant-baseline="middle" class="fill-black text-sm font-semibold">
        {{ percentLabel }}
      </text>
      <text :x="half" :y="half + 14" text-anchor="middle" class="fill-black/60 text-[10px]">
        {{ label }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  total: { type: Number, default: 1 },
  label: { type: String, default: '' },
  thickness: { type: Number, default: 10 },
  size: { type: Number, default: 140 }
})

const half = computed(() => props.size / 2)
const radius = computed(() => props.size / 2 - props.thickness / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const progress = computed(() => Math.min(1, Math.max(0, props.total ? props.value / props.total : 0)))
const dashOffset = computed(() => circumference.value * (1 - progress.value))
const percentLabel = computed(() => `${Math.round(progress.value * 100)}%`)
</script>

<style scoped>
text { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
</style>


