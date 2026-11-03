<script setup lang="ts">
// Početna stranica. Veći blokovi su u `components/home/`.
//
// Redosled sekcija prati put korisnika:
//   1. zna šta traži        → pretraga (hero) i marke
//   2. razgleda             → najbolje ocenjeni automobili
//   3. ne zna odakle da krene → upitnik, pa najbolji po kategoriji
//   4. ima kandidate        → poređenje, pa ostali automobili
//   5. ide da gleda auto    → spisak za pregled
//   6. pita se da li da veruje → kako radi i metodologija
const { fetchCars } = useCarsApi()
const { fetchBrands } = useBrandsApi()

const { data: carsData } = await useAsyncData('home-cars', () => fetchCars())
const { data: brandsData } = await useAsyncData('home-brands', () => fetchBrands())

const cars = computed(() => carsData.value?.data ?? [])
const brands = computed(() => brandsData.value?.data ?? [])

const topRated = computed(() => sortByRating(cars.value).slice(0, 3))

// API vraća automobile od najnovijeg ka najstarijem. Preskačemo one koji su već u "Najbolje ocenjeno",
// da se isti automobili ne ponavljaju jedan ispod drugog.
const latestCars = computed(() => {
  const shownAbove = new Set(topRated.value.map((car) => car.slug))
  return cars.value.filter((car) => !shownAbove.has(car.slug)).slice(0, 8)
})
</script>

<template>
  <div>
    <!-- 1. Zna šta traži -->
    <HomeHero :car-count="cars.length" />

    <section v-if="brands.length > 0" class="border-b border-ink/10">
      <div class="site-container py-10 text-center">
        <span class="font-data text-eyebrow text-steel">PRETRAŽI PO MARCI</span>
        <div class="mt-5 flex flex-wrap justify-center gap-3">
          <NuxtLink
            v-for="brand in brands" :key="brand.slug"
            :to="`/marke/${brand.slug}`"
            class="flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2.5 hover:border-accent transition-colors bg-white"
          >
            <img v-if="brand.logo_url" :src="brand.logo_url" alt="" class="w-5 h-5 object-contain" />
            <span class="font-data text-data-sm text-ink">{{ brand.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 2. Razgleda -->
    <section v-if="topRated.length > 0" class="site-container py-14">
      <SectionHeading eyebrow="TOP OCENA" title="Najbolje ocenjeno">
        <NuxtLink to="/automobili" class="font-data text-data-sm link-underline">
          Svi automobili →
        </NuxtLink>
      </SectionHeading>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <CarCard v-for="car in topRated" :key="car.slug" :car="car" />
      </div>
    </section>

    <!-- 3. Ne zna odakle da krene -->
    <HomeCarFinder :cars="cars" />

    <HomeBestFor :cars="cars" />

    <!-- 4. Ima kandidate -->
    <HomeCompareCta />

    <section v-if="latestCars.length > 0" class="site-container py-14">
      <SectionHeading eyebrow="SVEŽE" title="Poslednje dodato">
        <NuxtLink to="/automobili" class="font-data text-data-sm link-underline">
          Prikaži sve →
        </NuxtLink>
      </SectionHeading>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <CarCard v-for="car in latestCars" :key="car.slug" :car="car" />
      </div>
    </section>

    <!-- 5. Ide da gleda auto -->
    <HomeInspectionGuide />

    <!-- 6. Pita se da li da veruje -->
    <HomeHowItWorks />

    <HomeMethodology />
  </div>
</template>
