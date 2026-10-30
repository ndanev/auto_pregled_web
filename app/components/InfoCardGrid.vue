<script setup lang="ts">
// Mreža kartica sa naslovom i kratkim tekstom (dve kolone od tablet širine).
// `variant`: 'white' za obične kartice sa okvirom, 'sand' za tonirane (npr. upozorenja, ograničenja).
withDefaults(defineProps<{ items: readonly { title: string; text: string }[]; variant?: 'white' | 'sand' }>(), {
  variant: 'white',
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div
      v-for="item in items" :key="item.title"
      class="rounded-xl p-5"
      :class="variant === 'white' ? 'border border-ink/10 bg-white' : 'bg-sand'"
    >
      <h3 class="text-body font-semibold text-ink">{{ item.title }}</h3>
      <p class="mt-1.5 text-body-sm text-ink/70">{{ item.text }}</p>
    </div>
  </div>
</template>
