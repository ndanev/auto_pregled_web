<script setup lang="ts">
const { selected, toggle, clear } = useCompare()
</script>

<template>
  <div v-if="selected.length > 0" class="fixed bottom-4 inset-x-4 z-40">
    <div class="mx-auto max-w-4xl bg-ink text-canvas rounded-2xl shadow-xl px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3 flex-wrap">
        <span class="font-mono text-eyebrow text-canvas/50">POREĐENJE</span>
        <span
          v-for="item in selected" :key="item.slug"
          class="font-mono text-data-sm text-canvas bg-canvas/10 rounded-full px-3 py-1.5 flex items-center gap-2"
        >
          {{ item.label }}
          <button @click="toggle(item)" class="text-canvas/50 hover:text-rust">✕</button>
        </span>
        <span v-if="selected.length < 2" class="font-mono text-data-sm text-canvas/40">
          Izaberi još {{ 2 - selected.length }} automobil{{ 2 - selected.length === 1 ? '' : 'a' }}
        </span>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <button @click="clear" class="font-mono text-data-sm text-canvas/50 hover:text-canvas">Obriši</button>
        <NuxtLink
          v-if="selected.length === 2"
          :to="`/uporedi?a=${selected[0].slug}&b=${selected[1].slug}`"
          class="bg-amber text-ink font-mono text-eyebrow font-semibold rounded-full px-5 py-2.5 hover:bg-amber-dark transition-colors"
        >
          Uporedi
        </NuxtLink>
      </div>
    </div>
  </div>
</template>