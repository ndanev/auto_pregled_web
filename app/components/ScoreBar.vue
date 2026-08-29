<script setup lang="ts">
const props = defineProps<{ label: string; score: number }>()
const percentage = computed(() => Math.min(100, Math.max(0, (props.score / 10) * 100)))
</script>

<template>
  <div>
    <div class="flex items-baseline justify-between mb-1.5">
      <span class="font-mono text-eyebrow text-ink/60">{{ label }}</span>
      <span class="font-mono text-data text-ink">{{ score.toFixed(1) }}</span>
    </div>
    <div class="h-1.5 bg-black/10 overflow-hidden rounded-full">
      <div class="h-full bg-amber transition-all duration-700 ease-out rounded-full" :style="{ width: `${percentage}%` }"></div>
    </div>
  </div>
</template>