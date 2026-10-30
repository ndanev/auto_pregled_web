<script setup lang="ts">
// Vrh stranice automobila: putanja, galerija levo, naziv + ocena + ključni podaci desno.
import type { CarDetail } from '~/types/car'

const props = defineProps<{ car: CarDetail }>()

const fullName = computed(() => `${props.car.brand} ${props.car.model}`)

const keyFacts = computed(() => [
  { label: 'Motor', value: props.car.engine },
  { label: 'Snaga', value: props.car.power_hp ? `${props.car.power_hp} KS` : '—' },
  { label: 'Menjač', value: transmissionLabel(props.car.transmission) },
  { label: 'Gorivo', value: fuelLabel(props.car.fuel_type) },
])
</script>

<template>
  <section class="site-container pt-6 pb-10 md:pb-14">
    <nav class="text-body-sm text-ink/50" aria-label="Putanja">
      <NuxtLink to="/automobili" class="hover:text-ink transition-colors">Automobili</NuxtLink>
      <span class="mx-2 text-ink/25">/</span>
      <NuxtLink :to="{ path: '/automobili', query: { q: car.brand } }" class="hover:text-ink transition-colors">{{ car.brand }}</NuxtLink>
      <span class="mx-2 text-ink/25">/</span>
      <span class="text-ink/80">{{ car.model }}</span>
    </nav>

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-12">
      <CarGallery v-if="car.images.length > 0" :images="car.images" :alt="fullName" />
      <div v-else class="aspect-[16/10] rounded-xl bg-gradient-to-br from-sand to-sand-deep flex items-center justify-center">
        <span class="text-body-sm text-ink/40">Fotografija uskoro</span>
      </div>

      <div class="flex flex-col">
        <div class="flex items-center gap-2 text-body-sm text-ink/60">
          <img v-if="car.brand_logo_url" :src="car.brand_logo_url" alt="" class="h-5 w-5 object-contain opacity-90" />
          <span>{{ car.generation }}</span>
          <span class="text-ink/25">·</span>
          <span>{{ car.years }}</span>
        </div>

        <h1 class="mt-2 font-display font-extrabold uppercase text-display-lg md:text-display-xl text-ink">
          {{ car.brand }}<br />{{ car.model }}
        </h1>

        <div v-if="car.overall_rating" class="mt-6 flex items-end gap-4">
          <span class="font-data text-[4rem] leading-none font-semibold text-ink tracking-tight">
            {{ formatScore(car.overall_rating) }}
          </span>
          <div class="pb-1.5">
            <span class="block text-body-lg font-medium" :class="scoreTone(car.overall_rating).text">
              {{ scoreVerdict(car.overall_rating) }}
            </span>
            <span class="block text-body-sm text-ink/50">ukupna ocena od 10</span>
          </div>
        </div>

        <p v-if="car.analysis" class="mt-5 text-body text-ink/70">
          {{ car.analysis.ai_summary.short_description }}
        </p>

        <dl class="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink/10 pt-5">
          <div v-for="fact in keyFacts" :key="fact.label">
            <dt class="text-body-sm text-ink/45">{{ fact.label }}</dt>
            <dd class="text-body font-medium text-ink">{{ fact.value }}</dd>
          </div>
        </dl>

        <div class="mt-auto pt-7 flex flex-wrap items-center gap-3">
          <!-- Vodi do sekcije "Pre kupovine" (id="pregled") -->
          <a
            v-if="car.analysis" href="#pregled"
            class="rounded-full bg-accent px-5 py-2.5 text-body-sm font-medium text-white hover:bg-accent-dark transition-colors"
          >
            Šta proveriti pre kupovine
          </a>
          <CompareToggleButton :slug="car.slug" :label="fullName" />
        </div>
      </div>
    </div>
  </section>
</template>
