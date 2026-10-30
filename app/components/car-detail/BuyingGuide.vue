<script setup lang="ts">
// Sekcija "Pre kupovine": interaktivni spisak za pregled vozila + preporučene/rizične verzije.
import type { CarAnalysis } from '~/types/car'

defineProps<{
  guide: CarAnalysis['buying_guide']
  carSlug: string // koristi se za ključ u localStorage, da svaki auto ima svoj spisak
  checklistTitle: string
}>()
</script>

<template>
  <CarDetailSection
    id="pregled" title="Pre kupovine"
    intro="Ponesi ovaj spisak kad ideš da gledaš auto. Štikliraj usput — pamti se i kad zatvoriš stranicu."
  >
    <div class="mt-6">
      <InspectionChecklist :items="guide.inspection_points" :storage-key="`checklist:${carSlug}`" :title="checklistTitle" />
    </div>

    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div v-if="guide.recommended_engines.length > 0">
        <h3 class="text-body font-semibold text-ink">Verzije koje preporučujemo</h3>
        <ul class="mt-3 space-y-2">
          <li v-for="engine in guide.recommended_engines" :key="engine" class="flex gap-3 text-body text-ink/75">
            <span class="text-positive" aria-hidden="true">✓</span>{{ capitalize(engine) }}
          </li>
        </ul>
      </div>
      <div v-if="guide.engines_to_avoid.length > 0">
        <h3 class="text-body font-semibold text-ink">Na šta da paziš</h3>
        <ul class="mt-3 space-y-2">
          <li v-for="engine in guide.engines_to_avoid" :key="engine" class="flex gap-3 text-body text-ink/75">
            <span class="text-negative" aria-hidden="true">✕</span>{{ capitalize(engine) }}
          </li>
        </ul>
      </div>
    </div>
  </CarDetailSection>
</template>
