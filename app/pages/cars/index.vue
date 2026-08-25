<script setup lang="ts">
const { fetchCars } = useCarsApi()
const { data } = await useAsyncData('all-cars', () => fetchCars())
const cars = computed(() => data.value?.data ?? [])
</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-12">
    <span class="font-mono text-xs tracking-[0.2em] text-steel">BAZA VOZILA</span>
    <h1 class="font-display font-extrabold uppercase text-4xl md:text-5xl mt-2 text-ink">Svi automobili</h1>

    <div v-if="cars.length === 0" class="text-ink/50 font-mono text-sm mt-10">Trenutno nema objavljenih automobila.</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
      <CarCard v-for="car in cars" :key="car.slug" :car="car" />
    </div>
  </div>
</template>