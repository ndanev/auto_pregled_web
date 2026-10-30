<script setup lang="ts">
// Numerisana lista koraka sa brojem u krugu (1, 2, 3…), za uputstva "korak po korak".
defineProps<{ items: readonly string[] }>()
</script>

<template>
  <ol class="space-y-4">
    <li v-for="(item, index) in items" :key="item" class="flex gap-4">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 font-display font-bold text-accent-dark">
        {{ index + 1 }}
      </span>
      <p class="pt-1 text-body text-ink/80">{{ item }}</p>
    </li>
  </ol>
</template>
