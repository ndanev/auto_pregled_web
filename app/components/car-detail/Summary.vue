<script setup lang="ts">
// Sekcija "Ukratko": AI zaključak, za koga je auto, prednosti i mane.
import type { CarAnalysis } from '~/types/car'

const props = defineProps<{ analysis: CarAnalysis }>()

const audience = computed(() => [
  { title: 'Kupi ga ako…', items: props.analysis.target_audience.ideal_for, dotClass: 'bg-positive' },
  { title: 'Zaobiđi ga ako…', items: props.analysis.target_audience.not_recommended_for, dotClass: 'bg-negative' },
])

const prosAndCons = computed(() => [
  { title: 'Šta je dobro', items: props.analysis.strengths, sign: '+', colorClass: 'text-positive' },
  { title: 'Šta smeta', items: props.analysis.weaknesses, sign: '−', colorClass: 'text-negative' },
])
</script>

<template>
  <ContentSection id="ukratko" title="Ukratko">
    <blockquote class="mt-5 max-w-4xl border-l-2 border-accent pl-5 text-body-lg md:text-xl leading-relaxed text-ink">
      {{ analysis.ai_summary.final_verdict }}
    </blockquote>
    <p v-if="analysis.ai_summary.market_position" class="mt-5 max-w-4xl text-body text-ink/60">
      {{ analysis.ai_summary.market_position }}
    </p>

    <!-- Za koga je / za koga nije -->
    <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="group in audience" :key="group.title">
        <h3 class="text-body font-semibold text-ink">{{ group.title }}</h3>
        <ul class="mt-3 space-y-2.5">
          <li v-for="item in group.items" :key="item" class="flex gap-3 text-body text-ink/75">
            <span class="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full" :class="group.dotClass" aria-hidden="true"></span>
            {{ capitalize(item) }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Prednosti i mane -->
    <div class="mt-10 grid grid-cols-1 md:grid-cols-2 rounded-xl border border-ink/10 divide-y md:divide-y-0 md:divide-x divide-ink/10">
      <div v-for="group in prosAndCons" :key="group.title" class="p-5 md:p-6">
        <h3 class="text-body-sm font-semibold uppercase tracking-wider" :class="group.colorClass">{{ group.title }}</h3>
        <ul class="mt-4 space-y-4">
          <li v-for="item in group.items" :key="item.title" class="flex gap-3">
            <span class="font-data text-body font-semibold" :class="group.colorClass" aria-hidden="true">{{ group.sign }}</span>
            <div>
              <p class="text-body font-medium text-ink">{{ item.title }}</p>
              <p class="text-body-sm text-ink/60 mt-0.5">{{ item.description }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </ContentSection>
</template>
