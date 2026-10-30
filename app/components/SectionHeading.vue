<script setup lang="ts">
// Naslov sekcije: mala oznaka iznad (eyebrow) + veliki naslov. Desno se kroz slot može dodati link.
defineProps<{ eyebrow: string; title: string }>()
</script>

<template>
  <div class="flex items-baseline justify-between gap-4 mb-6">
    <div>
      <span class="font-data text-eyebrow text-steel">{{ eyebrow }}</span>
      <h2 class="font-display font-bold uppercase text-display-sm text-ink mt-1">{{ title }}</h2>
    </div>
    <slot />
  </div>
</template>
