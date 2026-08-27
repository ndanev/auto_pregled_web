<script setup lang="ts">
const props = defineProps<{ rating: number }>()
const percentage = computed(() => Math.min(100, Math.max(0, (props.rating / 10) * 100)))
</script>

<template>
  <div class="relative w-16 h-10 shrink-0">
    <svg viewBox="0 0 100 60" class="w-full h-full overflow-visible">
      <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#131417" stroke-opacity="0.12" stroke-width="7" stroke-linecap="round" pathLength="100" />
      <path
        d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#161616" stroke-width="7" stroke-linecap="round"
        pathLength="100" :stroke-dasharray="100" :stroke-dashoffset="100 - percentage"
        class="transition-all duration-700 ease-out"
      />
    </svg>
    <span class="absolute inset-x-0 bottom-0 text-center font-mono text-data font-semibold text-ink">
      {{ rating.toFixed(1) }}
    </span>
  </div>
</template>