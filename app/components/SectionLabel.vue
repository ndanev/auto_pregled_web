<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <div class="flex items-center gap-3 mb-6">
    <span class="font-mono text-eyebrow text-steel whitespace-nowrap">{{ text }}</span>
    <span class="h-px flex-1 bg-black/10"></span>
  </div>
</template>