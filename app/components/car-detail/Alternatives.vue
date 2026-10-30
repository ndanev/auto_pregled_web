<script setup lang="ts">
// Sekcija "Ako ne ovaj, onda…": slični modeli koje AI predlaže.
import type { CarAnalysis } from '~/types/car'

defineProps<{ alternatives: CarAnalysis['alternatives'] }>()

// AI vraća pun naziv ("Peugeot 308 1.5/1.6 BlueHDi"); za pretragu baze dovoljna su prva dva pojma.
function searchQuery(model: string): string {
  return model.split(/\s+/).slice(0, 2).join(' ')
}
</script>

<template>
  <CarDetailSection id="alternative" title="Ako ne ovaj, onda…">
    <ul class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <li v-for="alt in alternatives" :key="alt.model">
        <NuxtLink
          :to="{ path: '/automobili', query: { q: searchQuery(alt.model) } }"
          class="group flex h-full flex-col rounded-xl border border-ink/10 p-5 hover:border-ink/30 transition-colors"
        >
          <span class="text-body-lg font-semibold text-ink">{{ alt.model }}</span>
          <span class="mt-1 text-body-sm text-ink/60">{{ capitalize(alt.reason) }}</span>
          <span class="mt-auto pt-4 text-body-sm text-ink/55 group-hover:text-accent transition-colors">Potraži u bazi →</span>
        </NuxtLink>
      </li>
    </ul>
  </CarDetailSection>
</template>
