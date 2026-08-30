<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { fetchBrandBySlug } = useBrandsApi()
const { fetchCars } = useCarsApi()

const { data, error } = await useAsyncData(`brand-${slug}`, () => fetchBrandBySlug(slug))

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Marka nije pronađena' })
}

const brand = computed(() => data.value!.data)

const { data: carsData } = await useAsyncData(`brand-cars-${slug}`, () => fetchCars({ brandSlug: slug }))
const cars = computed(() => carsData.value?.data ?? [])

useSeoMeta({
  title: `${brand.value.name} — svi modeli`,
  description: `Pregled svih ${brand.value.name} modela sa AI analizom pouzdanosti, troškova i najčešćih kvarova.`,
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-12">
    <div class="flex items-center gap-5">
      <div v-if="brand.logo_url" class="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl border border-black/10 bg-canvas p-2">
        <img :src="brand.logo_url" :alt="brand.name" class="w-full h-full object-contain" />
      </div>
      <div>
        <span class="font-mono text-eyebrow text-steel">MARKA</span>
        <h1 class="font-display font-extrabold uppercase text-display-lg md:text-display-xl text-ink leading-none mt-1">
          {{ brand.name }}
        </h1>
      </div>
    </div>

    <p class="font-mono text-data-sm text-ink/50 mt-6">{{ cars.length }} automobila</p>

    <div v-if="cars.length === 0" class="text-ink/50 font-mono text-data mt-10">
      Trenutno nema objavljenih automobila za ovu marku.
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
      <CarCard v-for="car in cars" :key="car.slug" :car="car" />
    </div>
  </div>
</template>