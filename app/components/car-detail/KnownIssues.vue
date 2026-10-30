<script setup lang="ts">
// Sekcija "Poznati problemi": numerisana lista čestih kvarova sa okvirnom cenom popravke.
import type { CarAnalysis } from '~/types/car'

const props = defineProps<{ repairs: CarAnalysis['maintenance']['common_repairs'] }>()

// Cena je slobodan tekst; ako sadrži iznos u evrima, prikazujemo samo iznos.
// Ako kvar odgovara pojmu iz rečnika (npr. "DPF"), uz njega ide link ka objašnjenju.
const rows = computed(() =>
  props.repairs.map((repair) => ({
    ...repair,
    parsedCost: extractCost(repair.estimated_cost),
    glossaryTerm: findGlossaryTerm(repair.problem),
  }))
)
</script>

<template>
  <ContentSection id="kvarovi" title="Poznati problemi" intro="Kvarovi koji se kod ovog modela javljaju češće nego što bi trebalo.">
    <ol class="mt-6 border-t border-ink/10">
      <li v-for="(row, index) in rows" :key="row.problem" class="flex gap-5 border-b border-ink/10 py-5">
        <span class="font-data text-data-sm text-ink/50 pt-0.5">{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="flex-1 min-w-0 sm:flex sm:items-baseline sm:justify-between sm:gap-6">
          <div>
            <p class="text-body font-medium text-ink">{{ capitalize(row.problem) }}</p>
            <NuxtLink
              v-if="row.glossaryTerm" :to="`/recnik#${row.glossaryTerm.id}`"
              class="mt-1 inline-block text-body-sm text-ink/60 underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent"
            >
              {{ row.glossaryTerm.term }}: šta je i kako se prepoznaje kvar →
            </NuxtLink>
          </div>
          <span v-if="row.parsedCost" class="mt-1 sm:mt-0 block shrink-0 font-data text-data text-ink/80">{{ row.parsedCost.value }}</span>
          <p v-else class="mt-1 sm:mt-0 sm:max-w-[45%] sm:text-right text-body-sm text-ink/60">{{ capitalize(row.estimated_cost) }}</p>
        </div>
      </li>
    </ol>
  </ContentSection>
</template>
