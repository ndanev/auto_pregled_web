<script setup lang="ts">
// Lista sa obojenom tačkicom ispred svake stavke. `tone` bira boju tačkice:
// accent (neutralno), positive (dobro / uradi), negative (loše / upozorenje).
const props = withDefaults(defineProps<{ items: readonly string[]; tone?: 'accent' | 'positive' | 'negative' }>(), {
  tone: 'accent',
})

// Klase napisane u celosti da bi ih Tailwind pronašao
const DOT_CLASSES = { accent: 'bg-accent', positive: 'bg-positive', negative: 'bg-negative' }
const dotClass = computed(() => DOT_CLASSES[props.tone])
</script>

<template>
  <ul class="space-y-2.5">
    <li v-for="item in items" :key="item" class="flex gap-3 text-body text-ink/75">
      <span class="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full" :class="dotClass" aria-hidden="true"></span>
      <span>{{ item }}</span>
    </li>
  </ul>
</template>
