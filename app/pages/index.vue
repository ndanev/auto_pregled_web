<script setup lang="ts">
const { fetchCars } = useCarsApi()
const { data } = await useAsyncData('home-cars', () => fetchCars())
const cars = computed(() => data.value?.data ?? [])

const quickPicks = ['Renault Kadjar', 'Volkswagen Golf 7', 'Škoda Octavia']

const router = useRouter()
const searchQuery = ref('')

function handleSearch() {
  router.push({ path: '/cars', query: searchQuery.value ? { q: searchQuery.value } : {} })
}

function handleQuickPick(pick: string) {
  router.push({ path: '/cars', query: { q: pick } })
}
</script>

<template>
  <div>
    <section class="relative border-b border-white/10 overflow-hidden">
      <div class="pointer-events-none absolute inset-0" style="background: radial-gradient(600px circle at 50% 0%, rgba(232,163,61,0.12), transparent 70%);"></div>
      <div class="relative mx-auto max-w-4xl px-6 py-20 md:py-28 text-center">
        <span class="font-mono text-eyebrow text-steel">AI ANALIZA VOZILA</span>
        <h1 class="font-display font-extrabold uppercase leading-[0.9] text-display-lg md:text-display-xl mt-4 text-ink">
          Da li je ovo<br /><span class="text-amber">dobar izbor?</span>
        </h1>
        <p class="mt-6 text-body-lg text-ink/70 max-w-xl mx-auto">
          Pouzdanost, potrošnja, najčešći kvarovi i AI zaključak — strukturirano,
          na jednom mestu, pre nego što odlučiš.
        </p>

        <form class="mt-8 flex mx-auto max-w-lg border border-white/15 bg-surface" @submit.prevent="handleSearch">
          <input
            v-model="searchQuery"
            type="text" placeholder="Pretraži marku ili model, npr. Golf 7"
            class="flex-1 bg-transparent px-4 py-3 font-mono text-body-sm placeholder:text-ink/40 focus:outline-none text-ink"
          />
          <button type="submit" class="bg-amber text-canvas font-mono text-eyebrow px-5 hover:bg-amber/90 transition-colors">
            Pretraga
          </button>
        </form>

        <div class="mt-4 flex flex-wrap justify-center gap-2">
          <button
            v-for="pick in quickPicks" :key="pick"
            @click="handleQuickPick(pick)"
            class="font-mono text-data-sm px-3 py-1.5 border border-white/10 rounded-full text-ink/60 hover:border-amber/50 hover:text-ink transition-colors"
          >
            {{ pick }}
          </button>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-14">
      <div class="flex items-baseline justify-between mb-6">
        <div>
          <span class="font-mono text-eyebrow text-steel">IZDVOJENO</span>
          <h2 class="font-display font-bold uppercase text-display-sm text-ink mt-1">Popularni modeli</h2>
        </div>
        <NuxtLink to="/cars" class="font-mono text-data-sm text-amber hover:underline">Prikaži sve →</NuxtLink>
      </div>

      <div v-if="cars.length === 0" class="text-ink/50 font-mono text-data">Trenutno nema objavljenih automobila.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <CarCard v-for="car in cars" :key="car.slug" :car="car" />
      </div>
    </section>
  </div>
</template>