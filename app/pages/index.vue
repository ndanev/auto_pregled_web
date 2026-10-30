<script setup lang="ts">
// Početna stranica. Veći blokovi (hero, poziv na poređenje) su u `components/home/`.
const { fetchCars } = useCarsApi()
const { fetchBrands } = useBrandsApi()

const { data: carsData } = await useAsyncData('home-cars', () => fetchCars())
const { data: brandsData } = await useAsyncData('home-brands', () => fetchBrands())

const cars = computed(() => carsData.value?.data ?? [])
const brands = computed(() => brandsData.value?.data ?? [])

const topRated = computed(() =>
  cars.value
    .filter((car) => car.overall_rating !== null)
    .sort((a, b) => (b.overall_rating ?? 0) - (a.overall_rating ?? 0))
    .slice(0, 3)
)

// API vraća automobile od najnovijeg ka najstarijem
const latestCars = computed(() => cars.value.slice(0, 8))

const steps = [
  { title: 'Pretraži bazu', text: 'Pronađi marku, model ili generaciju koja te zanima među analiziranim vozilima.' },
  { title: 'Pročitaj AI pregled', text: 'Pouzdanost, potrošnja, najčešći kvarovi i troškovi održavanja — sve na jednom mestu.' },
  { title: 'Uporedi i odluči', text: 'Stavi dva vozila jedno pored drugog i donesi informisanu odluku pre kupovine.' },
]
</script>

<template>
  <div>
    <HomeHero :car-count="cars.length" />

    <!-- Marke -->
    <section v-if="brands.length > 0" class="border-b border-ink/10">
      <div class="site-container py-10">
        <span class="font-data text-eyebrow text-steel">PRETRAŽI PO MARCI</span>
        <div class="mt-5 flex flex-wrap gap-3">
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

    <!-- Najbolje ocenjeno -->
    <section v-if="topRated.length > 0" class="site-container py-14">
      <SectionHeading eyebrow="TOP OCENA" title="Najbolje ocenjeno" />
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <CarCard v-for="car in topRated" :key="car.slug" :car="car" />
      </div>
    </section>

    <HomeCompareCta />

    <!-- Poslednje dodato -->
    <section class="site-container py-14">
      <SectionHeading eyebrow="SVEŽE" title="Poslednje dodato">
        <NuxtLink to="/automobili" class="font-data text-data-sm text-ink font-medium hover:text-accent-dark transition-colors underline decoration-accent decoration-2 underline-offset-4">
          Prikaži sve →
        </NuxtLink>
      </SectionHeading>

      <div v-if="latestCars.length === 0" class="text-ink/50 font-data text-data">Trenutno nema objavljenih automobila.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <CarCard v-for="car in latestCars" :key="car.slug" :car="car" />
      </div>
    </section>

    <!-- Kako radi -->
    <section class="border-t border-ink/10">
      <div class="site-container py-14">
        <span class="font-data text-eyebrow text-steel">KAKO RADI</span>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div v-for="(step, index) in steps" :key="step.title" class="rounded-2xl border border-ink/10 bg-white p-6">
            <span class="font-data text-data-sm text-accent-dark font-semibold">0{{ index + 1 }}</span>
            <h3 class="font-display font-bold uppercase text-display-sm text-ink mt-2">{{ step.title }}</h3>
            <p class="text-body-sm text-ink/60 mt-2">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- O AI analizi -->
    <section class="border-t border-ink/10 bg-sand">
      <div class="mx-auto max-w-3xl px-6 py-14 text-center">
        <span class="font-data text-eyebrow text-steel">METODOLOGIJA</span>
        <h2 class="font-display font-bold uppercase text-display-sm text-ink mt-2">Kako nastaje AI analiza</h2>
        <p class="text-body-sm text-ink/60 mt-4 leading-relaxed">
          Svaka analiza generiše se na osnovu tehničkih specifikacija vozila i opšte poznatih
          informacija o modelu — motoru, pouzdanosti i tipičnim problemima. AI jasno razdvaja
          proverene činjenice od procena, a kada za neki segment nema dovoljno pouzdanih podataka,
          to je i naznačeno umesto da se izmišlja odgovor.
        </p>
      </div>
    </section>
  </div>
</template>
