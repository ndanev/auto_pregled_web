<script setup lang="ts">
// Traka na dnu ekrana sa automobilima izabranim za poređenje. Vidljiva na svim stranicama (vidi layouts/default.vue).
const { selected, toggle, clear } = useCompare()

// Link ka /uporedi postoji tek kad su izabrana tačno dva automobila
const compareUrl = computed(() => {
  const [first, second] = selected.value
  return first && second ? `/uporedi?a=${first.slug}&b=${second.slug}` : null
})
</script>

<template>
  <div v-if="selected.length > 0" class="fixed bottom-4 inset-x-4 z-40">
    <div class="mx-auto max-w-4xl text-ink rounded-2xl shadow-xl shadow-ink/10 border border-ink/10 bg-white px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3 flex-wrap">
        <span class="font-data text-eyebrow text-steel">POREĐENJE</span>
        <span
          v-for="item in selected" :key="item.slug"
          class="font-data text-data-sm text-ink bg-ink/5 rounded-full px-3 py-1.5 flex items-center gap-2"
        >
          {{ item.label }}
          <button @click="toggle(item)" class="text-ink/50 hover:text-negative">✕</button>
        </span>
        <span v-if="selected.length < 2" class="font-data text-data-sm text-ink/40">
          Izaberi još {{ 2 - selected.length }} automobil{{ 2 - selected.length === 1 ? '' : 'a' }}
        </span>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <button @click="clear" class="font-data text-data-sm text-ink/50 hover:text-ink">Obriši</button>
        <NuxtLink
          v-if="compareUrl"
          :to="compareUrl"
          class="bg-accent text-white font-data text-eyebrow font-semibold rounded-full px-5 py-2.5 hover:bg-accent-dark transition-colors"
        >
          Uporedi
        </NuxtLink>
      </div>
    </div>
  </div>
</template>