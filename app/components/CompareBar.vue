<script setup lang="ts">
const { selected, toggle, clear } = useCompare()
</script>

<template>
  <div v-if="selected.length > 0" class="fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-black/10">
    <div class="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3 flex-wrap">
        <span class="font-mono text-eyebrow text-steel">POREĐENJE</span>
        <span
          v-for="item in selected" :key="item.slug"
          class="font-mono text-data-sm text-ink bg-canvas px-3 py-1.5 border border-black/10 flex items-center gap-2"
        >
          {{ item.label }}
          <button @click="toggle(item)" class="text-ink/40 hover:text-rust">✕</button>
        </span>
        <span v-if="selected.length < 2" class="font-mono text-data-sm text-ink/40">
          Izaberi još {{ 2 - selected.length }} automobil{{ 2 - selected.length === 1 ? '' : 'a' }}
        </span>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <button @click="clear" class="font-mono text-data-sm text-ink/50 hover:text-ink">Obriši</button>
        <NuxtLink
          v-if="selected.length === 2"
          :to="`/uporedi?a=${selected[0].slug}&b=${selected[1].slug}`"
          class="bg-amber text-white font-mono text-eyebrow px-4 py-2 hover:bg-amber/90 transition-colors"
        >
          Uporedi
        </NuxtLink>
      </div>
    </div>
  </div>
</template>