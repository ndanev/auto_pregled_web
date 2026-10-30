<script setup lang="ts">
// Poređenje dva automobila. Izbor se čuva u URL-u (?a=slug&b=slug) da bi link mogao da se podeli.
// Bez oba parametra prikazuje se birač; sa njima — tabela poređenja.
import type { CarDetail } from '~/types/car'

const route = useRoute()
const router = useRouter()
const { fetchCars, fetchCarBySlug } = useCarsApi()

const slugA = computed(() => route.query.a as string | undefined)
const slugB = computed(() => route.query.b as string | undefined)
const hasSelection = computed(() => !!slugA.value && !!slugB.value)

// --- Birač -----------------------------------------------------------------

const { data: allCarsData } = await useAsyncData('compare-all-cars', () => fetchCars())
const allCars = computed(() => allCarsData.value?.data ?? [])

// picked[0] je prvi, picked[1] drugi automobil
const picked = ref<(string | undefined)[]>([slugA.value, slugB.value])
const pickerLabels = ['PRVI AUTOMOBIL', 'DRUGI AUTOMOBIL']
const canCompare = computed(() => !!picked.value[0] && !!picked.value[1] && picked.value[0] !== picked.value[1])

function startComparison() {
  if (!canCompare.value) return
  router.push({ path: '/uporedi', query: { a: picked.value[0], b: picked.value[1] } })
}

// --- Rezultati -------------------------------------------------------------

const { data: comparedData } = await useAsyncData(
  'compare-cars',
  async () => {
    if (!slugA.value || !slugB.value) return null
    const [a, b] = await Promise.all([fetchCarBySlug(slugA.value), fetchCarBySlug(slugB.value)])
    return [a.data, b.data] as [CarDetail, CarDetail]
  },
  { watch: [slugA, slugB] }
)

const cars = computed(() => comparedData.value ?? null)
const bothHaveAnalysis = computed(() => !!cars.value?.every((car) => car.analysis))

const specRows = computed(() => {
  if (!cars.value) return []
  const [a, b] = cars.value
  return [
    { label: 'Generacija', a: a.generation, b: b.generation },
    { label: 'Godine', a: a.years, b: b.years },
    { label: 'Gorivo', a: fuelLabel(a.fuel_type), b: fuelLabel(b.fuel_type) },
    { label: 'Snaga', a: `${a.power_hp} KS`, b: `${b.power_hp} KS` },
    { label: 'Menjač', a: transmissionLabel(a.transmission), b: transmissionLabel(b.transmission) },
  ]
})

function carName(car: CarDetail): string {
  return `${car.brand} ${car.model}`
}

useSeoMeta({
  title: () => (cars.value ? `${carName(cars.value[0])} vs ${carName(cars.value[1])}` : 'Uporedi automobile'),
})
</script>

<template>
  <div class="site-container py-12">
    <span class="font-data text-eyebrow text-steel">POREĐENJE</span>
    <h1 class="font-display font-extrabold uppercase text-display-lg mt-2 text-ink">
      <template v-if="cars">
        {{ carName(cars[0]) }} <span class="text-ink/30">vs</span> {{ carName(cars[1]) }}
      </template>
      <template v-else>Uporedi automobile</template>
    </h1>

    <!-- Birač -->
    <div v-if="!hasSelection" class="mt-10 border border-ink/10 p-6">
      <p class="font-data text-data-sm text-ink/60 mb-6">Izaberi dva automobila za poređenje.</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div v-for="(label, index) in pickerLabels" :key="label">
          <label :for="`picker-${index}`" class="block font-data text-eyebrow text-ink/40 mb-2">{{ label }}</label>
          <select
            :id="`picker-${index}`"
            v-model="picked[index]"
            class="w-full bg-white border border-ink/15 px-3 py-2.5 font-data text-data-sm text-ink focus:outline-none focus:border-accent"
          >
            <option :value="undefined" disabled>Izaberi automobil</option>
            <!-- Auto izabran u drugom biraču je onemogućen, da ne bi poredili isti auto sa samim sobom -->
            <option v-for="car in allCars" :key="car.slug" :value="car.slug" :disabled="car.slug === picked[1 - index]">
              {{ car.brand }} {{ car.model }} — {{ car.engine }}
            </option>
          </select>
        </div>
      </div>

      <button
        type="button"
        @click="startComparison"
        :disabled="!canCompare"
        class="mt-6 bg-accent text-white font-data text-eyebrow px-5 py-2.5 hover:bg-accent-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Uporedi
      </button>
    </div>

    <!-- Rezultati -->
    <template v-else-if="cars">
      <div class="grid grid-cols-2 gap-8 mt-10 border-b border-ink/10 pb-10">
        <div v-for="car in cars" :key="car.slug" class="flex flex-col items-center">
          <RatingGauge :rating="car.overall_rating ?? 0" label="AI OCENA" :size="180" />
          <span class="font-data text-data text-ink/60 mt-2">{{ car.engine }} · {{ car.power_hp }} KS</span>
        </div>
      </div>

      <div class="mt-10">
        <SectionLabel text="SPECIFIKACIJE" />
        <div class="border border-ink/10 divide-y divide-ink/10">
          <div v-for="row in specRows" :key="row.label" class="grid grid-cols-3 px-5 py-3 bg-white items-center">
            <span class="font-data text-data-sm text-ink">{{ row.a }}</span>
            <span class="font-data text-eyebrow text-ink/40 text-center">{{ row.label }}</span>
            <span class="font-data text-data-sm text-ink text-right">{{ row.b }}</span>
          </div>
        </div>
      </div>

      <template v-if="bothHaveAnalysis">
        <div class="mt-10">
          <SectionLabel text="POUZDANOST" />
          <div class="grid grid-cols-2 gap-6">
            <div v-for="car in cars" :key="car.slug" class="border border-ink/10 bg-white p-5 space-y-4">
              <ScoreBar label="Motor" :score="car.analysis!.reliability.engine_reliability" />
              <ScoreBar label="Menjač" :score="car.analysis!.reliability.transmission_reliability" />
              <ScoreBar label="Elektronika" :score="car.analysis!.reliability.electronics_reliability" />
            </div>
          </div>
        </div>

        <div class="mt-10">
          <SectionLabel text="POTROŠNJA GORIVA (KOMBINOVANO)" />
          <div class="grid grid-cols-2 gap-6">
            <div v-for="car in cars" :key="car.slug" class="border border-ink/10 bg-white p-5 text-center">
              <CompareFuelValue :text="car.analysis!.fuel_consumption.combined" />
            </div>
          </div>
        </div>

        <div class="mt-10">
          <SectionLabel text="AI ZAKLJUČCI" />
          <div class="grid grid-cols-2 gap-6">
            <div v-for="car in cars" :key="car.slug" class="border-l-2 border-accent bg-white p-5">
              <p class="text-body-sm text-ink/80">{{ car.analysis!.ai_summary.final_verdict }}</p>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="mt-10 text-ink/50 font-data text-data">
        AI analiza nije dostupna za jedan ili oba automobila.
      </div>

      <div class="mt-8">
        <NuxtLink to="/uporedi" class="font-data text-data-sm text-accent hover:underline">← Uporedi druge automobile</NuxtLink>
      </div>
    </template>
  </div>
</template>
