<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const searchQuery = ref((route.query.q as string) ?? '')
const brandSlug = computed(() => route.query.brand_slug as string | undefined)
const modelSlug = ref((route.query.model_slug as string) ?? '')
const bodyType = ref((route.query.body_type as string) ?? '')
const fuelType = ref((route.query.fuel_type as string) ?? '')
const transmission = ref((route.query.transmission as string) ?? '')

const { fetchCars } = useCarsApi()
const { data } = await useAsyncData(
  'all-cars',
  () =>
    fetchCars({
      query: searchQuery.value || undefined,
      brandSlug: brandSlug.value,
      modelSlug: modelSlug.value || undefined,
      bodyType: bodyType.value || undefined,
      fuelType: fuelType.value || undefined,
      transmission: transmission.value || undefined,
    }),
  { watch: [searchQuery, modelSlug, bodyType, fuelType, transmission] }
)
const cars = computed(() => data.value?.data ?? [])

const activeFilterCount = computed(() => {
  return [bodyType.value, fuelType.value, transmission.value].filter(Boolean).length
})

function clearFilters() {
  bodyType.value = ''
  fuelType.value = ''
  transmission.value = ''
}

watch([searchQuery, bodyType, fuelType, transmission], () => {
  router.replace({
    query: {
      ...(brandSlug.value ? { brand_slug: brandSlug.value } : {}),
      ...(searchQuery.value ? { q: searchQuery.value } : {}),
      ...(bodyType.value ? { body_type: bodyType.value } : {}),
      ...(fuelType.value ? { fuel_type: fuelType.value } : {}),
      ...(transmission.value ? { transmission: transmission.value } : {}),
    },
  })
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-12">
    <span class="font-mono text-eyebrow text-steel">BAZA VOZILA</span>
    <h1 class="font-display font-extrabold uppercase text-display-md md:text-display-lg mt-2 text-ink">Svi automobili</h1>

    <div class="mt-6 flex max-w-md rounded-full border border-black/15 bg-canvas overflow-hidden">
      <input
        v-model="searchQuery"
        type="text" placeholder="Pretraži marku ili model..."
        class="flex-1 bg-transparent px-5 py-2.5 font-mono text-body-sm placeholder:text-ink/40 focus:outline-none text-ink"
      />
    </div>

    <div class="mt-5 flex flex-wrap items-center gap-3">
      <select
        v-model="bodyType"
        class="font-mono text-data-sm rounded-full border border-black/15 bg-canvas px-4 py-2 text-ink focus:outline-none focus:border-amber"
      >
        <option value="">Karoserija</option>
        <option v-for="cat in BODY_TYPE_CATEGORIES" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
      </select>

      <select
        v-model="fuelType"
        class="font-mono text-data-sm rounded-full border border-black/15 bg-canvas px-4 py-2 text-ink focus:outline-none focus:border-amber"
      >
        <option value="">Gorivo</option>
        <option v-for="opt in FUEL_TYPE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>

      <select
        v-model="transmission"
        class="font-mono text-data-sm rounded-full border border-black/15 bg-canvas px-4 py-2 text-ink focus:outline-none focus:border-amber"
      >
        <option value="">Menjač</option>
        <option v-for="opt in TRANSMISSION_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>

      <button
        v-if="activeFilterCount > 0"
        @click="clearFilters"
        class="font-mono text-data-sm text-ink/50 hover:text-ink underline decoration-amber decoration-2 underline-offset-4"
      >
        Ukloni filtere ({{ activeFilterCount }})
      </button>
    </div>

    <div v-if="cars.length === 0" class="text-ink/50 font-mono text-data mt-10">
      {{ searchQuery || activeFilterCount > 0 ? 'Nema rezultata za izabrane filtere.' : 'Trenutno nema objavljenih automobila.' }}
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-8">
      <CarCard v-for="car in cars" :key="car.slug" :car="car" />
    </div>
  </div>
</template>