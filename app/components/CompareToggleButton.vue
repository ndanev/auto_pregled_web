<script setup lang="ts">
// Dugme koje dodaje automobil u poređenje ili ga uklanja iz njega (stanje je u useCompare).
const props = defineProps<{ slug: string; label: string }>()

const { toggle, isSelected } = useCompare()
const selected = computed(() => isSelected(props.slug))
</script>

<template>
  <button
    type="button"
    @click="toggle({ slug, label })"
    :aria-pressed="selected"
    class="rounded-full border px-5 py-2.5 text-body-sm font-medium transition-colors"
    :class="selected ? 'border-accent text-accent' : 'border-ink/20 text-ink hover:border-ink/50'"
  >
    {{ selected ? '✓ Dodat u poređenje' : '+ Dodaj u poređenje' }}
  </button>
</template>
