<script setup lang="ts">
// Lista svih automobila sa pretragom i filterima.
// Filteri se čuvaju u URL-u (npr. ?body_type=suv&q=golf) da bi rezultati mogli da se podele linkom.
const route = useRoute()
const router = useRouter()

/** Čita jedan query parametar kao string ('' ako ga nema). */
function queryParam(name: string): string {
  return (route.query[name] as string) ?? ''
}

// Ovi parametri stižu samo spolja (linkovi sa stranice marke), korisnik ih ne menja ovde.
const brandSlug = computed(() => queryParam('brand_slug'))
const modelSlug = computed(() => queryParam('model_slug'))

// Ovo korisnik menja kroz polje za pretragu i filtere.
const searchQuery = ref(queryParam('q'))
const bodyType = ref(queryParam('body_type'))
const fuelType = ref(queryParam('fuel_type'))
const transmission = ref(queryParam('transmission'))

const { fetchCars } = useCarsApi()
const { data } = await useAsyncData(
  'all-cars',
  () =>
    fetchCars({
      query: searchQuery.value,
      brandSlug: brandSlug.value,
      modelSlug: modelSlug.value,
      bodyType: bodyType.value,
      fuelType: fuelType.value,
      transmission: transmission.value,
    }),
  { watch: [searchQuery, bodyType, fuelType, transmission] }
)
const cars = computed(() => data.value?.data ?? [])

const activeFilterCount = computed(() => [bodyType.value, fuelType.value, transmission.value].filter(Boolean).length)

function clearFilters() {
  bodyType.value = ''
  fuelType.value = ''
  transmission.value = ''
}

// Upisuje trenutne filtere u URL; prazne vrednosti izostavljamo da adresa ostane čista.
watch([searchQuery, bodyType, fuelType, transmission], () => {
  const params = {
    brand_slug: brandSlug.value,
    model_slug: modelSlug.value,
    q: searchQuery.value,
    body_type: bodyType.value,
    fuel_type: fuelType.value,
    transmission: transmission.value,
  }
  router.replace({ query: Object.fromEntries(Object.entries(params).filter(([, value]) => value)) })
})
</script>

<template>
  <div class="site-container py-12">
    <span class="font-data text-eyebrow text-steel">BAZA VOZILA</span>
    <h1 class="font-display font-extrabold text-display-md md:text-display-lg mt-2 text-ink">Svi automobili</h1>

    <div class="mt-6 flex max-w-md rounded-full border border-ink/15 bg-white overflow-hidden">
      <input
        v-model="searchQuery"
        type="text" placeholder="Pretraži marku ili model..."
        aria-label="Pretraga automobila"
        class="flex-1 bg-transparent px-5 py-2.5 font-data text-body-sm placeholder:text-ink/55 focus:outline-none text-ink"
      />
    </div>

    <div class="mt-5 flex flex-wrap items-center gap-3">
      <FilterSelect v-model="bodyType" placeholder="Karoserija" :options="BODY_TYPE_CATEGORIES" />
      <FilterSelect v-model="fuelType" placeholder="Gorivo" :options="FUEL_TYPE_OPTIONS" />
      <FilterSelect v-model="transmission" placeholder="Menjač" :options="TRANSMISSION_OPTIONS" />

      <button
        v-if="activeFilterCount > 0"
        type="button"
        @click="clearFilters"
        class="font-data text-data-sm text-ink/60 hover:text-ink underline decoration-accent decoration-2 underline-offset-4"
      >
        Ukloni filtere ({{ activeFilterCount }})
      </button>
    </div>

    <div v-if="cars.length === 0" class="text-ink/60 font-data text-data mt-10">
      {{ searchQuery || activeFilterCount > 0 ? 'Nema rezultata za izabrane filtere.' : 'Trenutno nema objavljenih automobila.' }}
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
      <CarCard v-for="car in cars" :key="car.slug" :car="car" />
    </div>
  </div>
</template>
