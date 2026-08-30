<script setup lang="ts">
const { fetchCars } = useCarsApi()
const { fetchBrands } = useBrandsApi()

const { data: carsData } = await useAsyncData('home-cars', () => fetchCars())
const { data: brandsData } = await useAsyncData('home-brands', () => fetchBrands())

const cars = computed(() => carsData.value?.data ?? [])
const brands = computed(() => brandsData.value?.data ?? [])

const router = useRouter()
const searchQuery = ref('')

function handleSearch() {
  router.push({ path: '/automobili', query: searchQuery.value ? { q: searchQuery.value } : {} })
}

function handleBodyType(value: string) {
  router.push({ path: '/automobili', query: { body_type: value } })
}

const steps = [
  {
    title: 'Pretraži bazu',
    text: 'Pronađi marku, model ili generaciju koja te zanima među analiziranim vozilima.',
  },
  {
    title: 'Pročitaj AI pregled',
    text: 'Pouzdanost, potrošnja, najčešći kvarovi i troškovi održavanja — sve na jednom mestu.',
  },
  {
    title: 'Uporedi i odluči',
    text: 'Stavi dva vozila jedno pored drugog i donesi informisanu odluku pre kupovine.',
  },
]
</script>

<template>
  <div>
    <!-- Hero — centriran, crni band -->
    <section
      class="relative bg-ink text-canvas bg-cover bg-center"
      style="background-image: url('/images/hero-bg.jpg');"
    >
      <!-- Tamni overlay za čitljivost teksta -->
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40"></div>

      <div class="relative mx-auto max-w-3xl px-6 py-24 md:py-16 text-center">
        <span class="font-mono text-eyebrow text-canvas/70">AI ANALIZA VOZILA</span>
        <h1 class="font-display font-extrabold uppercase leading-[0.9] text-display-lg md:text-display-xl mt-4 text-canvas drop-shadow-lg">
          Da li je ovo<br /><span class="text-amber-light">dobar izbor?</span>
        </h1>
        <p class="mt-6 text-body-lg text-canvas/85 max-w-xl mx-auto drop-shadow">
          Pouzdanost, potrošnja, najčešći kvarovi i AI zaključak — strukturirano,
          na jednom mestu, pre nego što odlučiš.
        </p>

        <form class="mt-10 flex max-w-xl mx-auto rounded-full overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.4)]" @submit.prevent="handleSearch">
          <input
            v-model="searchQuery"
            type="text" placeholder="Pretraži marku ili model, npr. Golf 7"
            class="flex-1 bg-white px-6 py-4 font-mono text-body-sm placeholder:text-black/40 focus:outline-none text-black"
          />
          <button type="submit" class="bg-amber text-ink font-mono text-eyebrow font-semibold px-6 hover:bg-amber-dark transition-colors shrink-0">
            Pretraga
          </button>
        </form>

        <div class="mt-8 flex flex-wrap justify-center gap-2.5">
          <button
            v-for="cat in BODY_TYPE_CATEGORIES" :key="cat.value"
            @click="handleBodyType(cat.value)"
            class="font-mono text-data-sm px-4 py-2 rounded-full border border-canvas/30 bg-ink/20 backdrop-blur-sm text-canvas/85 hover:border-amber-light/70 hover:text-amber-light transition-colors"
          >
            {{ cat.label }}
          </button>
        </div>

        <p v-if="cars.length > 0" class="mt-8 font-mono text-data-sm text-canvas/60">
          {{ cars.length }} automobila analizirano AI tehnologijom
        </p>
      </div>
    </section>

    <!-- Marke -->
    <section v-if="brands.length > 0" class="border-b border-black/10">
      <div class="mx-auto max-w-6xl px-6 py-10">
        <span class="font-mono text-eyebrow text-steel">PRETRAŽI PO MARCI</span>
        <div class="mt-5 flex flex-wrap gap-3">
          <NuxtLink
            v-for="brand in brands" :key="brand.slug"
            :to="`/marke/${brand.slug}`"
            class="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2.5 hover:border-amber transition-colors"
          >
            <img v-if="brand.logo_url" :src="brand.logo_url" :alt="brand.name" class="w-5 h-5 object-contain" />
            <span class="font-mono text-data-sm text-ink">{{ brand.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Popularni modeli -->
    <section class="mx-auto max-w-6xl px-6 py-14">
      <div class="flex items-baseline justify-between mb-6">
        <div>
          <span class="font-mono text-eyebrow text-steel">IZDVOJENO</span>
          <h2 class="font-display font-bold uppercase text-display-sm text-ink mt-1">Popularni modeli</h2>
        </div>
        <NuxtLink to="/automobili" class="font-mono text-data-sm text-ink font-medium hover:text-amber-dark transition-colors underline decoration-amber decoration-2 underline-offset-4">
          Prikaži sve →
        </NuxtLink>
      </div>

      <div v-if="cars.length === 0" class="text-ink/50 font-mono text-data">Trenutno nema objavljenih automobila.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <CarCard v-for="car in cars.slice(0, 6)" :key="car.slug" :car="car" />
      </div>
    </section>

    <!-- Kako radi -->
    <section class="border-t border-black/10">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <span class="font-mono text-eyebrow text-steel">KAKO RADI</span>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          <div v-for="(step, index) in steps" :key="step.title" class="rounded-2xl bg-canvas border border-black/10 p-6">
            <span class="font-mono text-data-sm text-amber-dark font-semibold">0{{ index + 1 }}</span>
            <h3 class="font-display font-bold uppercase text-display-sm text-ink mt-2">{{ step.title }}</h3>
            <p class="text-body-sm text-ink/60 mt-2">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>