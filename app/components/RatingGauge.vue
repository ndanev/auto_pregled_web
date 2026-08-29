<script setup lang="ts">
const props = withDefaults(
  defineProps<{ rating: number; label?: string; size?: number }>(),
  { label: 'OCENA', size: 220 }
)

const clamped = computed(() => Math.min(10, Math.max(0, props.rating)))
const needleAngle = computed(() => -90 + (clamped.value / 10) * 180)
const ticks = Array.from({ length: 11 }, (_, i) => i)

function tickAngle(value: number): number {
  return -90 + (value / 10) * 180
}
function tickPoint(value: number, radius: number) {
  const angleRad = (tickAngle(value) * Math.PI) / 180
  return { x: 100 + radius * Math.sin(angleRad), y: 100 - radius * Math.cos(angleRad) }
}
</script>

<template>
  <div class="flex flex-col items-center" :style="{ width: `${size}px` }">
    <svg viewBox="0 0 200 120" class="w-full">
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#131417" stroke-opacity="0.12" stroke-width="2" />
      <g v-for="tick in ticks" :key="tick">
        <line
          :x1="tickPoint(tick, 72).x" :y1="tickPoint(tick, 72).y"
          :x2="tickPoint(tick, 80).x" :y2="tickPoint(tick, 80).y"
          stroke="#131417" stroke-opacity="0.3" stroke-width="1.5"
        />
      </g>
      <g :style="{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '100px 100px' }" class="transition-transform duration-700 ease-out">
        <line x1="100" y1="100" x2="100" y2="32" stroke="#F0B429" stroke-width="3" stroke-linecap="round" />
      </g>
      <circle cx="100" cy="100" r="5" fill="#131417" />
    </svg>
    <div class="text-center">
      <span class="font-mono text-data-xl font-semibold text-ink">{{ clamped.toFixed(1) }}</span>
      <span class="font-mono text-data-sm text-ink/50">/10</span>
    </div>
    <span class="mt-1 font-mono text-eyebrow text-ink/50">{{ label }}</span>
  </div>
</template>