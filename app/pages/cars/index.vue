<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const searchQuery = ref((route.query.q as string) ?? '')
const brandSlug = computed(() => route.query.brand_slug as string | undefined)
const modelSlug = computed(() => route.query.model_slug as string | undefined)

const { fetchCars } = useCarsApi()
const { data, refresh } = await useAsyncData(
  'all-cars',
  () => fetchCars({ query: searchQuery.value || undefined, brandSlug: brandSlug.value, modelSlug: modelSlug.value }),
  { watch: [searchQuery, brandSlug, modelSlug] }
)
const cars = computed(() => data.value?.data ?? [])

watch(searchQuery, (value) => {
  router.replace({ query: { ...route.query, q: value || undefined } })
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-12">
    <span class="font-mono text-eyebrow text-steel">BAZA VOZILA</span>
    <h1 class="font-display font-extrabold uppercase text-display-md md:text-display-lg mt-2 text-ink">Svi automobili</h1>

    <div class="mt-6 flex max-w-md border border-white/15 bg-surface">
      <input
        v-model="searchQuery"
        type="text" placeholder="Pretraži marku ili model..."
        class="flex-1 bg-transparent px-4 py-2.5 font-mono text-body-sm placeholder:text-ink/40 focus:outline-none text-ink"
      />
    </div>

    <div v-if="cars.length === 0" class="text-ink/50 font-mono text-data mt-10">
      {{ searchQuery ? `Nema rezultata za "${searchQuery}".` : 'Trenutno nema objavljenih automobila.' }}
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
      <CarCard v-for="car in cars" :key="car.slug" :car="car" />
    </div>
  </div>
</template>