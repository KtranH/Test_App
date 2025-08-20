<template>
  <div class="w-full">
    <svg :viewBox="`0 0 ${viewWidth} ${viewHeight}`" class="w-full h-40 select-none">
      <g :transform="`translate(${paddingLeft} 0)`">
        <line :x1="0" :y1="viewHeight - paddingBottom" :x2="chartWidth" :y2="viewHeight - paddingBottom" stroke="currentColor" class="text-black/10" />

        <template v-for="(bar, idx) in bars" :key="idx">
          <rect
            :x="bar.x"
            :y="bar.y"
            :width="bar.width"
            :height="bar.height"
            rx="2"
            class="fill-black/10 hover:fill-black/20 transition-colors"
          />
          <text
            :x="bar.x + bar.width / 2"
            :y="viewHeight - paddingBottom + 10"
            text-anchor="middle"
            class="fill-black/60 text-[8px]"
          >
            {{ shortLabel(labels[idx]) }}
          </text>
        </template>

        <template v-if="showValues">
          <text
            v-for="(bar, idx) in bars"
            :key="`v-${idx}`"
            :x="bar.x + bar.width / 2"
            :y="bar.y - 2"
            text-anchor="middle"
            class="fill-black text-[8px]"
          >
            {{ values[idx] }}
          </text>
        </template>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
  max: { type: Number, default: 0 },
  showValues: { type: Boolean, default: true }
})

const viewWidth = 320
const viewHeight = 120
const paddingLeft = 8
const paddingBottom = 18
const barGap = 8

const chartWidth = viewWidth - paddingLeft

const maxValue = computed(() => {
  const localMax = Math.max(0, ...props.values)
  return props.max > 0 ? Math.max(props.max, localMax) : localMax || 1
})

const bars = computed(() => {
  const n = props.values.length || 1
  const totalGap = barGap * (n + 1)
  const bw = Math.max(6, (chartWidth - totalGap) / n)
  const usableHeight = viewHeight - paddingBottom - 8
  return props.values.map((v, i) => {
    const h = Math.max(1, (v / maxValue.value) * usableHeight)
    const x = barGap + i * (bw + barGap)
    const y = viewHeight - paddingBottom - h
    return { x, y, width: bw, height: h }
  })
})

const shortLabel = (label) => {
  if (!label) return ''
  const s = String(label)
  return s.length > 8 ? s.slice(0, 7) + '…' : s
}
</script>

<style scoped>
text { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
</style>


