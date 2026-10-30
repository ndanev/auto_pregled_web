<script setup lang="ts">
// Rezultat poređenja dva automobila, odozgo nadole:
//   1. oba automobila sa ocenom
//   2. kratak zaključak ("X vodi u N od M poređenja")
//   3. redovi poređenja po grupama (ko je bolji odlučuje utils/compare.ts)
//   4. prednosti, mane i AI zaključak jedno pored drugog
import type { CarDetail } from '~/types/car'

const props = defineProps<{ carA: CarDetail; carB: CarDetail }>()
const emit = defineEmits<{ change: [] }>()

const groups = computed(() => buildCompareGroups(props.carA, props.carB))
const summary = computed(() => summarizeComparison(groups.value, props.carA, props.carB))

// Prednosti/mane i zaključak prikazujemo samo kad oba automobila imaju AI analizu
const cars = computed(() => [props.carA, props.carB])
const bothHaveAnalysis = computed(() => !!props.carA.analysis && !!props.carB.analysis)
</script>

<template>
  <div>
    <!-- 1. Oba automobila -->
    <div class="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-6 items-start">
      <CompareCarHeader :car="carA" align="right" />
      <VsBadge class="mt-16 sm:mt-24" />
      <CompareCarHeader :car="carB" align="left" />
    </div>

    <!-- 2. Kratak zaključak -->
    <div class="mt-10 rounded-2xl bg-ink px-6 py-5 text-center text-white">
      <p class="font-display font-bold text-xl sm:text-display-sm">{{ summary }}</p>
      <p class="mt-1 text-body-sm text-white/65">Broj pobeda nije presuda — pogledaj redove koji su tebi najvažniji.</p>
    </div>

    <!-- 3. Redovi poređenja -->
    <div class="mt-10">
      <!-- Lepljivo zaglavlje: dok skroluješ, uvek se vidi koja kolona je koji automobil -->
      <div class="sticky top-16 z-10 -mx-4 px-4 sm:mx-0 sm:px-0 bg-page/90 backdrop-blur border-b border-ink/10">
        <div class="grid grid-cols-[1fr_minmax(96px,auto)_1fr] sm:grid-cols-[1fr_180px_1fr] gap-x-3 sm:gap-x-6 py-3">
          <span class="truncate text-right text-body-sm font-semibold text-ink">{{ carName(carA) }}</span>
          <span></span>
          <span class="truncate text-left text-body-sm font-semibold text-ink">{{ carName(carB) }}</span>
        </div>
      </div>

      <section v-for="group in groups" :key="group.title" class="mt-8">
        <h3 class="text-center font-data text-eyebrow text-steel">{{ group.title.toUpperCase() }}</h3>
        <div class="mt-2 divide-y divide-ink/5">
          <CompareRow v-for="row in group.rows" :key="row.label" :row="row" />
        </div>
      </section>

      <p v-if="!bothHaveAnalysis" class="mt-8 rounded-xl bg-sand p-5 text-center text-body-sm text-ink/70">
        Za jedan od automobila AI analiza još nije gotova, pa poredimo samo tehničke podatke.
      </p>
    </div>

    <!-- 4. Prednosti, mane i zaključak -->
    <template v-if="bothHaveAnalysis">
      <section class="mt-16">
        <h3 class="font-display font-bold text-display-sm text-ink">Prednosti i mane</h3>
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="car in cars" :key="car.slug" class="rounded-xl border border-ink/10 bg-white p-5">
            <p class="text-body font-semibold text-ink">{{ carName(car) }}</p>
            <ul class="mt-4 space-y-2.5">
              <li v-for="item in car.analysis?.strengths.slice(0, 3)" :key="item.title" class="flex gap-3 text-body-sm text-ink/80">
                <span class="font-semibold text-positive" aria-hidden="true">+</span>{{ item.title }}
              </li>
              <li v-for="item in car.analysis?.weaknesses.slice(0, 3)" :key="item.title" class="flex gap-3 text-body-sm text-ink/80">
                <span class="font-semibold text-negative" aria-hidden="true">−</span>{{ item.title }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="mt-16">
        <h3 class="font-display font-bold text-display-sm text-ink">Zaključak analize</h3>
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <blockquote v-for="car in cars" :key="car.slug" class="rounded-xl bg-white border border-ink/10 p-5">
            <p class="text-body font-semibold text-ink">{{ carName(car) }}</p>
            <p class="mt-2 border-l-2 border-accent pl-4 text-body text-ink/80">{{ car.analysis?.ai_summary.final_verdict }}</p>
          </blockquote>
        </div>
      </section>
    </template>

    <div class="mt-12 flex justify-center">
      <button type="button" @click="emit('change')" class="btn-secondary">← Uporedi druge automobile</button>
    </div>
  </div>
</template>
