<script setup lang="ts">
// Ocena 0–10 kao traka od 10 polja, obojena po semaforu (scoreTone).
const props = defineProps<{ label: string; score: number }>()

const clamped = computed(() => Math.min(10, Math.max(0, props.score)))
const tone = computed(() => scoreTone(clamped.value))

// Svaka ćelija predstavlja jedan poen; poslednja može biti delimično popunjena (npr. 6,5).
function cellFill(index: number): number {
  return Math.min(1, Math.max(0, clamped.value - index)) * 100
}
</script>

<template>
  <div>
    <div class="flex items-baseline justify-between mb-2">
      <span class="text-body-sm text-ink/70">{{ label }}</span>
      <span class="font-data text-data font-semibold text-ink">{{ formatScore(clamped) }}</span>
    </div>
    <div
      class="grid grid-cols-10 gap-1"
      role="meter" aria-valuemin="0" aria-valuemax="10" :aria-valuenow="clamped" :aria-label="label"
    >
      <span v-for="i in 10" :key="i" class="relative h-2 rounded-[2px] bg-ink/10 overflow-hidden">
        <span class="absolute inset-y-0 left-0 transition-[width] duration-700" :class="tone.bg" :style="{ width: `${cellFill(i - 1)}%` }"></span>
      </span>
    </div>
  </div>
</template>
