<script setup lang="ts">
// Padajući meni za filtere. Prazna vrednost ('') znači "bez filtera" i tada se prikazuje placeholder.
defineProps<{ placeholder: string; options: { value: string; label: string }[] }>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <select
    v-model="model"
    :aria-label="placeholder"
    class="font-data text-data-sm rounded-full border border-ink/15 bg-white px-4 py-2 text-ink focus:outline-none focus:border-accent"
  >
    <option value="">{{ placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
  </select>
</template>
