<script setup lang="ts">
// Mala oznaka sa linijom do kraja reda, za podnaslove na stranici /uporedi.
defineProps<{ text: string }>()
</script>

<template>
  <div class="flex items-center gap-3 mb-6">
    <span class="font-data text-eyebrow text-steel whitespace-nowrap">{{ text }}</span>
    <span class="h-px flex-1 bg-ink/10"></span>
  </div>
</template>