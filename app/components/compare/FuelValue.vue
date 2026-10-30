<script setup lang="ts">
// Potrošnja iz AI teksta: krupan broj ako ga ima, inače originalni tekst.
const props = defineProps<{ text: string }>()

const parsed = computed(() => extractFuel(props.text))
</script>

<template>
  <span v-if="parsed" class="font-data text-data-xl font-semibold text-ink">
    {{ parsed.value }} <span class="text-data-sm font-normal text-ink/50">l/100 km</span>
  </span>
  <span v-else class="text-body-sm text-ink/70">{{ capitalize(text) }}</span>
</template>
