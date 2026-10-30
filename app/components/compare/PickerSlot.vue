<script setup lang="ts">
// Jedna kartica u biraču: pregled izabranog automobila (slika, naziv, ocena) i padajući meni.
// Vrednost (`v-model`) je slug izabranog automobila.
import type { CarSummary } from '~/types/car'

const props = defineProps<{
  title: string // npr. "Prvi automobil"
  cars: CarSummary[]
  disabledSlug?: string // auto izabran u drugoj kartici — ne može se porediti sam sa sobom
}>()

const selectedSlug = defineModel<string | undefined>()

const selectedCar = computed(() => props.cars.find((car) => car.slug === selectedSlug.value))

// Jedinstven id po kartici, da <label> bude povezan sa svojim <select>-om
const selectId = useId()
</script>

<template>
  <div
    class="flex flex-col rounded-2xl border bg-white p-5 transition-colors"
    :class="selectedCar ? 'border-ink/15' : 'border-dashed border-ink/25'"
  >
    <label :for="selectId" class="font-data text-eyebrow text-steel">{{ title.toUpperCase() }}</label>

    <div class="mt-4 aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-sand to-sand-deep">
      <img v-if="selectedCar?.main_thumbnail_url" :src="selectedCar.main_thumbnail_url" alt="" class="h-full w-full object-cover" />
      <div v-else class="flex h-full items-center justify-center text-body-sm text-ink/55">
        {{ selectedCar ? 'Bez fotografije' : 'Izaberi automobil ispod' }}
      </div>
    </div>

    <div class="mt-4 min-h-[4.5rem]">
      <template v-if="selectedCar">
        <p class="font-display font-bold text-display-sm text-ink">{{ carName(selectedCar) }}</p>
        <p class="mt-1 text-body-sm text-ink/60">
          {{ selectedCar.engine }} · {{ selectedCar.years }}
          <template v-if="selectedCar.overall_rating">
            · <span class="font-semibold" :class="scoreTone(selectedCar.overall_rating).text">{{ formatScore(selectedCar.overall_rating) }}</span>
          </template>
        </p>
      </template>
    </div>

    <select
      :id="selectId"
      v-model="selectedSlug"
      class="mt-4 w-full rounded-full border border-ink/15 bg-page px-4 py-2.5 text-body-sm text-ink focus:outline-none focus:border-accent"
    >
      <option :value="undefined" disabled>Izaberi automobil</option>
      <option v-for="car in cars" :key="car.slug" :value="car.slug" :disabled="car.slug === disabledSlug">
        {{ carName(car) }} — {{ car.engine }}
      </option>
    </select>
  </div>
</template>
