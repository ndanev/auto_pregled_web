<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const searchQuery = ref((route.query.q as string) ?? '')

const { fetchCars } = useCarsApi()
const { data, refresh } = await useAsyncData(
  'all-cars',
  () => fetchCars(searchQuery.value || undefined),
  { watch: [searchQuery] }
)
const cars = computed(() => data.value?.data ?? [])

// Drži URL query u sinhronizaciji sa unosom (bez reload-a stranice)
watch(searchQuery, (value) => {
  router.replace({ query: value ? { q: value } : {} })
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-12">
    <span class="font-mono text-xs tracking-[0.2em] text-steel">BAZA VOZILA</span>
    <h1 class="font-display font-extrabold uppercase text-4xl md:text-5xl mt-2 text-ink">Svi automobili</h1>

    <div class="mt-6 flex max-w-md border border-white/15 bg-surface">
      <input
        v-model="searchQuery"
        type="text" placeholder="Pretraži marku ili model..."
        class="flex-1 bg-transparent px-4 py-2.5 font-mono text-sm placeholder:text-ink/40 focus:outline-none text-ink"
      />
    </div>

    <div v-if="cars.length === 0" class="text-ink/50 font-mono text-sm mt-10">
      {{ searchQuery ? `Nema rezultata za "${searchQuery}".` : 'Trenutno nema objavljenih automobila.' }}
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
      <CarCard v-for="car in cars" :key="car.slug" :car="car" />
    </div>
  </div>
</template>