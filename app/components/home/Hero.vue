<script setup lang="ts">
// Hero početne stranice: tamna "izložbena" kartica sa pretragom, uvučena u svetlu stranicu.
//
// Kako je složena (od pozadine ka napred):
//   1. narandžasti odsjaj na podu ispod automobila (radial-gradient)
//   2. fotografija automobila — na telefonu ispod teksta, na desktopu desno-dole
//   3. prelaz u crno sa leve strane, da tekst ostane čitljiv preko fotografije
//   4. tekst i pretraga
defineProps<{ carCount: number }>()

const router = useRouter()
const searchQuery = ref('')

function search() {
  router.push({ path: '/automobili', query: searchQuery.value ? { q: searchQuery.value } : {} })
}

function filterByBodyType(value: string) {
  router.push({ path: '/automobili', query: { body_type: value } })
}
</script>

<template>
  <section class="site-container pt-4 sm:pt-6">
    <div class="relative isolate overflow-hidden rounded-3xl bg-black shadow-2xl shadow-ink/20 md:min-h-[620px]">
      <!-- 1. Odsjaj (rgba je accent boja #D9530E sa providnošću) -->
      <div
        class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_22%_at_50%_92%,rgba(232,96,24,0.42),transparent)] md:bg-[radial-gradient(ellipse_36%_16%_at_68%_91%,rgba(232,96,24,0.42),transparent)]"
        aria-hidden="true"
      ></div>

      <!-- 4. Tekst i pretraga (z-10 da bude iznad fotografije i prelaza) -->
      <div class="relative z-10 px-6 pt-12 sm:px-10 md:px-14 md:py-20 md:max-w-[520px]">
        <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-body-sm text-white/80 ring-1 ring-white/15 backdrop-blur-sm">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
          <template v-if="carCount > 0">{{ carCount }} modela analizirano</template>
          <template v-else>AI analiza polovnih automobila</template>
        </span>
        <h1 class="mt-5 font-display font-extrabold uppercase leading-[0.9] text-display-lg md:text-display-xl text-white">
          Da li je ovo<br /><span class="text-accent-light">dobar izbor?</span>
        </h1>
        <p class="mt-5 text-body-lg text-white/75 max-w-lg">
          Pre nego što kreneš da gledaš polovnjak, saznaj koliko je pouzdan, koliko troši
          i šta mu najčešće otkazuje — jasno i na jednom mestu.
        </p>

        <form class="mt-8 flex max-w-xl rounded-full bg-white p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.45)]" @submit.prevent="search">
          <input
            v-model="searchQuery"
            type="text" placeholder="Marka ili model, npr. Golf 7"
            aria-label="Pretraga automobila"
            class="flex-1 min-w-0 bg-transparent px-4 py-2.5 text-body placeholder:text-ink/40 focus:outline-none text-ink"
          />
          <button type="submit" class="rounded-full bg-accent px-6 text-body-sm font-semibold text-white hover:bg-accent-dark transition-colors shrink-0">
            Pretraži
          </button>
        </form>

        <div class="mt-5 flex flex-wrap items-center gap-2">
          <span class="text-body-sm text-white/50 mr-1">Ili izaberi:</span>
          <button
            v-for="category in BODY_TYPE_CATEGORIES" :key="category.value"
            type="button"
            @click="filterByBodyType(category.value)"
            class="text-body-sm px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/85 backdrop-blur-sm hover:border-white/60 hover:text-white transition-colors"
          >
            {{ category.label }}
          </button>
        </div>
      </div>

      <!-- 2. Fotografija. mix-blend-lighten pušta odsjaj da se vidi kroz crne delove slike. -->
      <img
        src="/images/hero-bg.jpg" alt=""
        class="-z-10 w-full mix-blend-lighten md:absolute md:bottom-0 md:-right-[8%] md:w-[80%]"
      />
      <!-- 3. Prelaz u crno (samo desktop, gde je tekst preko fotografije) -->
      <div class="absolute inset-y-0 left-0 hidden w-3/5 bg-gradient-to-r from-black from-40% to-transparent md:block" aria-hidden="true"></div>
    </div>
  </section>
</template>
