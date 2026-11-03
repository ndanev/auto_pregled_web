<script setup lang="ts">
// Hero početne stranice: tamna "izložbena" kartica sa pretragom, uvučena u svetlu stranicu.
//
// Raspored (sve je centrirano):
//   1. tekst i pretraga — gore
//   2. fotografija automobila sa narandžastim odsjajem ispod točkova — dole
//
// Fotografija je povučena naviše, ispod teksta. To je moguće jer je gornji deo fotografije potpuno crn
// (noćno nebo), pa tekst stoji preko crnog dela, a automobil ostaje ceo vidljiv. Detalji su u <style> ispod.
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
    <div class="relative isolate overflow-hidden rounded-3xl bg-black shadow-2xl shadow-ink/20">
      <!-- 1. Tekst i pretraga (z-10 da bude iznad fotografije) -->
      <div class="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-10 text-center sm:px-10 md:pt-14">
        <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-body-sm text-white/80 ring-1 ring-white/15 backdrop-blur-sm">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
          <template v-if="carCount > 0">{{ carCount }} modela analizirano</template>
          <template v-else>AI analiza polovnih automobila</template>
        </span>
        <h1 class="mt-4 font-display font-extrabold text-display-lg md:text-display-xl text-white">
          Da li je ovo <span class="text-accent-light">dobar izbor?</span>
        </h1>
        <p class="mt-4 max-w-2xl text-body-lg text-white/75">
          Pre nego što kreneš da gledaš polovnjak, saznaj koliko je pouzdan, koliko troši
          i šta mu najčešće otkazuje — jasno i na jednom mestu.
        </p>

        <form class="mt-7 flex w-full max-w-xl rounded-full bg-white p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.45)]" @submit.prevent="search">
          <input
            v-model="searchQuery"
            type="text" placeholder="Marka ili model, npr. Golf 7"
            aria-label="Pretraga automobila"
            class="flex-1 min-w-0 bg-transparent px-4 py-2.5 text-body placeholder:text-ink/55 focus:outline-none text-ink"
          />
          <button type="submit" class="rounded-full bg-accent px-6 text-body-sm font-semibold text-white hover:bg-accent-dark transition-colors shrink-0">
            Pretraži
          </button>
        </form>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span class="text-body-sm text-white/65 mr-1">Ili izaberi:</span>
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

      <!--
        2. Fotografija. Omotač određuje širinu slike, a -z-10 je stavlja iza teksta.
        Redosled unutar omotača: odsjaj (pozadi) → fotografija → crni prelaz na dnu (napred).
      -->
      <div class="relative -z-10 mx-auto w-full max-w-[820px] md:w-[80%] lg:w-[70%]">
        <div class="car-glow absolute inset-0" aria-hidden="true"></div>
        <img src="/images/hero-bg.jpg" alt="" class="car-photo relative block w-full" />
        <div class="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black to-transparent" aria-hidden="true"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
 * Fotografija automobila (public/images/hero-bg.jpg, 1920×1200).
 *
 * 1. Povlačenje naviše: negativna margina u procentima se računa od ŠIRINE roditelja (omotača),
 *    a omotač je širok kao slika — pa je -16% uvek 16% širine slike. Crno nebo na vrhu fotografije
 *    je visoko ~25% njene širine, pa se sa tekstom preklapa samo nebo, nikad automobil.
 * 2. Odsecanje praznog poda: odnos 20:11 umesto 16:10 prikazuje gornjih 88% fotografije (object-position: top).
 * 3. Leva i desna ivica fotografije se utapaju u crnu karticu (mask-image).
 * 4. mix-blend-mode: lighten pušta narandžasti odsjaj (.car-glow) da se vidi kroz crne delove slike.
 */
.car-photo {
  margin-top: -16%;
  aspect-ratio: 20 / 11;
  object-fit: cover;
  object-position: top;
  mask-image: linear-gradient(to right, transparent, black 18%, black 82%, transparent);
  mix-blend-mode: lighten;
}

@media (min-width: 768px) {
  .car-photo {
    margin-top: -23%; /* na širem ekranu tekst je niži u odnosu na sliku, pa je preklapanje veće */
  }
}

/* Narandžasti odsjaj na podu, ispod točkova (~87% visine prikazane fotografije). Boja je accent #D9530E. */
.car-glow {
  background: radial-gradient(ellipse 38% 11% at 50% 87%, rgba(232, 96, 24, 0.5), transparent);
}
</style>
