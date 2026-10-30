<script setup lang="ts">
// Sekcija "Pouzdanost": ukupna ocena, ocene po komponentama i utisak iz vožnje.
import type { CarAnalysis } from '~/types/car'

const props = defineProps<{ analysis: CarAnalysis }>()

const reliabilityRows = computed(() => [
  { label: 'Motor', score: props.analysis.reliability.engine_reliability },
  { label: 'Menjač', score: props.analysis.reliability.transmission_reliability },
  { label: 'Elektronika', score: props.analysis.reliability.electronics_reliability },
])

const drivingRows = computed(() => {
  const driving = props.analysis.driving_experience
  return [
    { label: 'Udobnost', score: driving.comfort },
    { label: 'Performanse', score: driving.performance },
    { label: 'Upravljivost', score: driving.handling },
    { label: 'Zvučna izolacija', score: driving.noise_level },
  ]
})

const showDriving = computed(() => !!props.analysis.driving_experience && !hasInsufficientData(props.analysis, 'driving_experience'))
</script>

<template>
  <ContentSection
    id="pouzdanost" title="Pouzdanost"
    intro="Ocene od 1 do 10 na osnovu poznatih problema za ovaj motor, menjač i elektroniku."
  >
    <p v-if="hasInsufficientData(analysis, 'reliability')" class="mt-4 rounded-lg bg-caution/10 px-4 py-3 text-body-sm text-caution">
      Za ovaj model ima malo pouzdanih podataka — ocene shvati kao okvirnu procenu.
    </p>

    <div class="mt-8 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 items-start">
      <div class="sm:pr-8 sm:border-r border-ink/10">
        <span class="font-display text-data-xl md:text-[3rem] leading-none font-bold" :class="scoreTone(analysis.reliability.score).text">
          {{ formatScore(analysis.reliability.score) }}
        </span>
        <span class="block mt-2 text-body-sm text-ink/60">ukupna pouzdanost</span>
      </div>
      <div class="space-y-5">
        <ScoreBar v-for="row in reliabilityRows" :key="row.label" :label="row.label" :score="row.score" />
      </div>
    </div>

    <div v-if="showDriving" class="mt-12">
      <h3 class="text-body font-semibold text-ink">Za volanom</h3>
      <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
        <ScoreBar v-for="row in drivingRows" :key="row.label" :label="row.label" :score="row.score" />
      </div>
    </div>
  </ContentSection>
</template>
