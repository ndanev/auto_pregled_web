<script setup lang="ts">
// "Najbolji za…": za svaku kategoriju prikazuje najbolje ocenjen model.
// Sve se računa iz liste automobila, pa se sekcija sama osvežava kad u bazu stignu novi modeli.
// Kategorija bez ijednog ocenjenog modela se ne prikazuje.
import type { CarSummary } from '~/types/car'

const props = defineProps<{ cars: CarSummary[] }>()

interface Category {
  title: string
  matches: (car: CarSummary) => boolean
  // Filter za link "Svi" na /automobili. Izostavljen kad kategoriju ne može da opiše jedan filter
  // (npr. automatik = 'automatski' ILI 'dsg_cvt'), jer bi link prikazao manje modela nego što piše.
  listQuery?: Record<string, string>
}

const CATEGORIES: Category[] = [
  { title: 'Najbolji hečbek', matches: (car) => car.body_type === 'hecbek', listQuery: { body_type: 'hecbek' } },
  { title: 'Najbolji karavan', matches: (car) => car.body_type === 'karavan', listQuery: { body_type: 'karavan' } },
  { title: 'Najbolji SUV', matches: (car) => car.body_type === 'suv', listQuery: { body_type: 'suv' } },
  { title: 'Najbolja limuzina', matches: (car) => car.body_type === 'limuzina', listQuery: { body_type: 'limuzina' } },
  { title: 'Najbolji dizel', matches: (car) => car.fuel_type === 'dizel', listQuery: { fuel_type: 'dizel' } },
  { title: 'Najbolji benzinac', matches: (car) => car.fuel_type === 'benzin', listQuery: { fuel_type: 'benzin' } },
  { title: 'Najbolji manuelac', matches: (car) => car.transmission === 'manuelni', listQuery: { transmission: 'manuelni' } },
  {
    title: 'Najbolji automatik',
    matches: (car) => car.transmission === 'automatski' || car.transmission === 'dsg_cvt',
  },
]

const winners = computed(() =>
  CATEGORIES.map((category) => {
    const rated = props.cars.filter((car) => car.overall_rating !== null && category.matches(car))
    const best = rated.reduce<CarSummary | null>(
      (top, car) => (!top || (car.overall_rating ?? 0) > (top.overall_rating ?? 0) ? car : top),
      null
    )
    return { ...category, best, count: rated.length }
  }).filter((entry): entry is typeof entry & { best: CarSummary } => entry.best !== null)
)
</script>

<template>
  <section v-if="winners.length > 0" class="site-container py-14">
    <SectionHeading eyebrow="PREPORUKE PO KATEGORIJI" title="Najbolji za…" />

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="entry in winners" :key="entry.title" class="flex flex-col rounded-xl border border-ink/10 bg-white p-4">
        <div class="flex items-center justify-between gap-3">
          <span class="text-body-sm font-semibold text-ink/70">{{ entry.title }}</span>
          <NuxtLink
            v-if="entry.listQuery"
            :to="{ path: '/automobili', query: entry.listQuery }"
            class="shrink-0 text-body-sm text-ink/40 hover:text-accent transition-colors"
          >
            Svi ({{ entry.count }}) →
          </NuxtLink>
          <span v-else class="shrink-0 text-body-sm text-ink/40">{{ entry.count }} modela</span>
        </div>

        <NuxtLink :to="`/automobili/${entry.best.slug}`" class="group mt-3 flex items-center gap-4">
          <div class="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-sand to-sand-deep">
            <img
              v-if="entry.best.main_thumbnail_url" :src="entry.best.main_thumbnail_url" alt="" loading="lazy"
              class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div class="min-w-0">
            <p class="font-display font-bold uppercase text-xl leading-tight text-ink group-hover:text-accent transition-colors truncate">
              {{ entry.best.brand }} {{ entry.best.model }}
            </p>
            <p class="mt-0.5 text-body-sm text-ink/50 truncate">{{ entry.best.engine }}</p>
          </div>
        </NuxtLink>

        <div class="mt-auto pt-4">
          <div class="flex items-center justify-between border-t border-ink/10 pt-3">
            <span class="text-body-sm" :class="scoreTone(entry.best.overall_rating!).text">{{ scoreVerdict(entry.best.overall_rating!) }}</span>
            <span class="font-data text-data-lg font-semibold text-ink">
              {{ formatScore(entry.best.overall_rating!) }}<span class="text-data-sm font-normal text-ink/40">/10</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
