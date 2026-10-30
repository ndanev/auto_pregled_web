<script setup lang="ts">
// "Najbolji za…": za svaku kategoriju prikazuje najbolje ocenjen model.
// Sve se računa iz liste automobila, pa se sekcija sama osvežava kad u bazu stignu novi modeli.
// Kategorija bez ijednog ocenjenog modela se ne prikazuje.
import type { CarSummary } from '~/types/car'

const props = defineProps<{ cars: CarSummary[] }>()

interface Category {
  title: string
  field: 'body_type' | 'fuel_type' | 'transmission' // polje automobila po kom se filtrira
  values: string[] // automobil ulazi u kategoriju ako mu je polje jednako nekoj od ovih vrednosti
}

const CATEGORIES: Category[] = [
  { title: 'Najbolji hečbek', field: 'body_type', values: ['hecbek'] },
  { title: 'Najbolji karavan', field: 'body_type', values: ['karavan'] },
  { title: 'Najbolji SUV', field: 'body_type', values: ['suv'] },
  { title: 'Najbolja limuzina', field: 'body_type', values: ['limuzina'] },
  { title: 'Najbolji dizel', field: 'fuel_type', values: ['dizel'] },
  { title: 'Najbolji benzinac', field: 'fuel_type', values: ['benzin'] },
  { title: 'Najbolji manuelac', field: 'transmission', values: ['manuelni'] },
  { title: 'Najbolji automatik', field: 'transmission', values: ['automatski', 'dsg_cvt'] },
]

interface Winner {
  title: string
  car: CarSummary
  rating: number
  count: number // koliko ocenjenih modela ima u kategoriji
  listLink?: { path: string; query: Record<string, string> } // link "Svi →"; vidi napomenu ispod
}

const winners = computed(() => {
  const result: Winner[] = []

  for (const category of CATEGORIES) {
    const carsInCategory = props.cars.filter((car) => category.values.includes(car[category.field] ?? ''))
    const ranked = sortByRating(carsInCategory)
    const best = ranked[0]
    if (!best) continue

    result.push({
      title: category.title,
      car: best,
      rating: best.overall_rating ?? 0,
      count: ranked.length,
      // Filter na /automobili prima samo jednu vrednost. Kategoriju sa više vrednosti
      // (npr. automatik) ne linkujemo, jer bi lista prikazala manje modela nego što piše.
      listLink: category.values.length === 1
        ? { path: '/automobili', query: { [category.field]: category.values[0]! } }
        : undefined,
    })
  }

  return result
})
</script>

<template>
  <section v-if="winners.length > 0" class="site-container py-14">
    <SectionHeading eyebrow="PREPORUKE PO KATEGORIJI" title="Najbolji za…" />

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="winner in winners" :key="winner.title" class="flex flex-col rounded-xl border border-ink/10 bg-white p-4">
        <div class="flex items-center justify-between gap-3">
          <span class="text-body-sm font-semibold text-ink/70">{{ winner.title }}</span>
          <NuxtLink v-if="winner.listLink" :to="winner.listLink" class="shrink-0 text-body-sm text-ink/55 hover:text-accent transition-colors">
            Svi ({{ winner.count }}) →
          </NuxtLink>
          <span v-else class="shrink-0 text-body-sm text-ink/55">{{ winner.count }} modela</span>
        </div>

        <NuxtLink :to="`/automobili/${winner.car.slug}`" class="group mt-3 flex items-center gap-4">
          <div class="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-sand to-sand-deep">
            <img
              v-if="winner.car.main_thumbnail_url" :src="winner.car.main_thumbnail_url" alt="" loading="lazy"
              class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div class="min-w-0">
            <p class="font-display font-bold text-lg leading-snug text-ink group-hover:text-accent transition-colors line-clamp-2">
              {{ carName(winner.car) }}
            </p>
            <p class="mt-0.5 text-body-sm text-ink/60 line-clamp-1">{{ winner.car.engine }}</p>
          </div>
        </NuxtLink>

        <div class="mt-auto pt-4">
          <div class="flex items-center justify-between border-t border-ink/10 pt-3">
            <span class="text-body-sm" :class="scoreTone(winner.rating).text">{{ scoreVerdict(winner.rating) }}</span>
            <span class="font-data text-data-lg font-semibold text-ink">
              {{ formatScore(winner.rating) }}<span class="text-data-sm font-normal text-ink/55">/10</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
