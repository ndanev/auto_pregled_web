<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const aSlug = computed(() => route.query.a as string | undefined)
const bSlug = computed(() => route.query.b as string | undefined)
const hasSelection = computed(() => !!aSlug.value && !!bSlug.value)

const { fetchCars, fetchCarBySlug } = useCarsApi()

// Lista svih automobila za birač
const { data: allCarsData } = await useAsyncData('compare-all-cars', () => fetchCars())
const allCars = computed(() => allCarsData.value?.data ?? [])

const pickerA = ref<string | undefined>(aSlug.value)
const pickerB = ref<string | undefined>(bSlug.value)

function handlePickerSubmit() {
  if (!pickerA.value || !pickerB.value || pickerA.value === pickerB.value) return
  router.push({ path: '/uporedi', query: { a: pickerA.value, b: pickerB.value } })
}

// Rezultati poređenja (samo kad je selekcija dostupna)
const { data: carAData } = await useAsyncData(
  'compare-a',
  () => (aSlug.value ? fetchCarBySlug(aSlug.value) : Promise.resolve(null)),
  { watch: [aSlug] }
)
const { data: carBData } = await useAsyncData(
  'compare-b',
  () => (bSlug.value ? fetchCarBySlug(bSlug.value) : Promise.resolve(null)),
  { watch: [bSlug] }
)

const carA = computed(() => carAData.value?.data)
const carB = computed(() => carBData.value?.data)
const bothLoaded = computed(() => !!carA.value && !!carB.value)

useSeoMeta({
  title: bothLoaded.value
    ? `${carA.value!.brand} ${carA.value!.model} vs ${carB.value!.brand} ${carB.value!.model}`
    : 'Uporedi automobile',
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 py-12">
    <span class="font-mono text-eyebrow text-steel">POREĐENJE</span>
    <h1 class="font-display font-extrabold uppercase text-display-lg mt-2 text-ink">
      <template v-if="bothLoaded">
        {{ carA!.brand }} {{ carA!.model }} <span class="text-ink/30">vs</span> {{ carB!.brand }} {{ carB!.model }}
      </template>
      <template v-else>Uporedi automobile</template>
    </h1>

    <!-- Birač -->
    <div v-if="!hasSelection" class="mt-10 border border-black/10 bg-white p-6">
      <p class="font-mono text-data-sm text-ink/60 mb-6">Izaberi dva automobila za poređenje.</p>
      <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        <div>
          <label class="block font-mono text-eyebrow text-ink/40 mb-2">PRVI AUTOMOBIL</label>
          <select
            v-model="pickerA"
            class="w-full bg-canvas border border-white/15 px-3 py-2.5 font-mono text-data-sm text-ink focus:outline-none focus:border-amber"
          >
            <option :value="undefined" disabled>Izaberi automobil</option>
            <option v-for="car in allCars" :key="car.slug" :value="car.slug" :disabled="car.slug === pickerB">
              {{ car.brand }} {{ car.model }} — {{ car.engine }}
            </option>
          </select>
        </div>

        <span class="hidden sm:block font-mono text-ink/30 text-center pb-3">vs</span>

        <div>
          <label class="block font-mono text-eyebrow text-ink/40 mb-2">DRUGI AUTOMOBIL</label>
          <select
            v-model="pickerB"
            class="w-full bg-canvas border border-white/15 px-3 py-2.5 font-mono text-data-sm text-ink focus:outline-none focus:border-amber"
          >
            <option :value="undefined" disabled>Izaberi automobil</option>
            <option v-for="car in allCars" :key="car.slug" :value="car.slug" :disabled="car.slug === pickerA">
              {{ car.brand }} {{ car.model }} — {{ car.engine }}
            </option>
          </select>
        </div>
      </div>

      <button
        @click="handlePickerSubmit"
        :disabled="!pickerA || !pickerB"
        class="mt-6 bg-amber text-white font-mono text-eyebrow px-5 py-2.5 hover:bg-amber/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Uporedi
      </button>
    </div>

    <!-- Rezultati -->
    <template v-else-if="bothLoaded">
      <div class="grid grid-cols-2 gap-8 mt-10 border-b border-black/10 pb-10">
        <div class="flex flex-col items-center">
          <RatingGauge :rating="carA!.overall_rating ?? 0" label="AI OCENA" :size="180" />
          <span class="font-mono text-data text-ink/60 mt-2">{{ carA!.engine }} · {{ carA!.power_hp }} KS</span>
        </div>
        <div class="flex flex-col items-center">
          <RatingGauge :rating="carB!.overall_rating ?? 0" label="AI OCENA" :size="180" />
          <span class="font-mono text-data text-ink/60 mt-2">{{ carB!.engine }} · {{ carB!.power_hp }} KS</span>
        </div>
      </div>

      <div class="mt-10">
        <SectionLabel text="SPECIFIKACIJE" />
        <div class="border border-black/10 divide-y divide-black/10">
          <div
            v-for="row in [
              { label: 'Generacija', a: carA!.generation, b: carB!.generation },
              { label: 'Godine', a: carA!.years, b: carB!.years },
              { label: 'Gorivo', a: carA!.fuel_type, b: carB!.fuel_type },
              { label: 'Snaga', a: `${carA!.power_hp} KS`, b: `${carB!.power_hp} KS` },
              { label: 'Menjač', a: carA!.transmission, b: carB!.transmission },
            ]"
            :key="row.label"
            class="grid grid-cols-3 px-5 py-3 bg-white items-center"
          >
            <span class="font-mono text-data-sm text-ink">{{ row.a }}</span>
            <span class="font-mono text-eyebrow text-ink/40 text-center">{{ row.label }}</span>
            <span class="font-mono text-data-sm text-ink text-right">{{ row.b }}</span>
          </div>
        </div>
      </div>

      <template v-if="carA!.analysis && carB!.analysis">
        <div class="mt-10">
          <SectionLabel text="POUZDANOST" />
          <div class="grid grid-cols-2 gap-6">
            <div class="border border-black/10 bg-white p-5 space-y-4">
              <ScoreBar label="MOTOR" :score="carA!.analysis.reliability.engine_reliability" />
              <ScoreBar label="MENJAČ" :score="carA!.analysis.reliability.transmission_reliability" />
              <ScoreBar label="ELEKTRONIKA" :score="carA!.analysis.reliability.electronics_reliability" />
            </div>
            <div class="border border-black/10 bg-white p-5 space-y-4">
              <ScoreBar label="MOTOR" :score="carB!.analysis.reliability.engine_reliability" />
              <ScoreBar label="MENJAČ" :score="carB!.analysis.reliability.transmission_reliability" />
              <ScoreBar label="ELEKTRONIKA" :score="carB!.analysis.reliability.electronics_reliability" />
            </div>
          </div>
        </div>

        <div class="mt-10">
          <SectionLabel text="POTROŠNJA GORIVA (KOMBINOVANO)" />
          <div class="grid grid-cols-2 gap-6">
            <div class="border border-black/10 bg-white p-5 text-center">
              <span class="font-mono text-data-xl text-ink">{{ carA!.analysis.fuel_consumption.combined }}</span>
            </div>
            <div class="border border-black/10 bg-white p-5 text-center">
              <span class="font-mono text-data-xl text-ink">{{ carB!.analysis.fuel_consumption.combined }}</span>
            </div>
          </div>
        </div>

        <div class="mt-10">
          <SectionLabel text="AI ZAKLJUČCI" />
          <div class="grid grid-cols-2 gap-6">
            <div class="border-l-2 border-amber bg-white p-5">
              <p class="text-body-sm text-ink/80">{{ carA!.analysis.ai_summary.final_verdict }}</p>
            </div>
            <div class="border-l-2 border-amber bg-white p-5">
              <p class="text-body-sm text-ink/80">{{ carB!.analysis.ai_summary.final_verdict }}</p>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="mt-10 text-ink/50 font-mono text-data">
        AI analiza nije dostupna za jedan ili oba automobila.
      </div>

      <div class="mt-8">
        <NuxtLink to="/uporedi" class="font-mono text-data-sm text-amber hover:underline">← Uporedi druge automobile</NuxtLink>
      </div>
    </template>
  </div>
</template>