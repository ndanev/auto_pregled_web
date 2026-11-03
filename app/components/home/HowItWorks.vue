<script setup lang="ts">
// Sekcija "Kako radi" na početnoj: tri koraka, svaki sa malom ilustracijom, naslovom, tekstom i linkom.
// Ilustracije su posebne komponente (HomeStepIllustrationSearch / Review / Compare), napravljene od običnih
// HTML elemenata u bojama sajta. Samo su ukras — zato imaju aria-hidden, a sav smisao je u naslovu i tekstu ispod.

interface Step {
  illustration: 'search' | 'review' | 'compare' // koja ilustracija se prikazuje iznad teksta
  title: string
  text: string
  link: { to: string; label: string }
}

const STEPS: Step[] = [
  {
    illustration: 'search',
    title: 'Pronađi model',
    text: 'Pretraži po marki, modelu ili motoru, ili filtriraj po karoseriji i gorivu.',
    link: { to: '/automobili', label: 'Pogledaj automobile' },
  },
  {
    illustration: 'review',
    title: 'Pročitaj AI pregled',
    text: 'Pouzdanost, potrošnja, najčešći kvarovi i troškovi održavanja — sve na jednom mestu.',
    link: { to: '/kako-ocenjujemo', label: 'Šta znače ocene' },
  },
  {
    illustration: 'compare',
    title: 'Uporedi i odluči',
    text: 'Stavi dva modela jedan pored drugog i vidi koji je bolji u čemu, pre nego što kreneš da gledaš auto.',
    link: { to: '/uporedi', label: 'Uporedi automobile' },
  },
]
</script>

<template>
  <section class="border-t border-ink/10">
    <div class="site-container py-16 md:py-20">
      <div class="mx-auto max-w-2xl text-center">
        <span class="font-data text-eyebrow text-steel">KAKO RADI</span>
        <h2 class="mt-2 font-display font-bold text-display-sm md:text-display-md text-ink">
          Od pretrage do odluke u tri koraka
        </h2>
        <p class="mt-3 text-body text-ink/65">
          Sve što treba da znaš o modelu, pre nego što pozoveš prodavca.
        </p>
      </div>

      <ol class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <li
          v-for="(step, index) in STEPS" :key="step.title"
          class="group flex flex-col rounded-3xl border border-ink/10 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-xl hover:shadow-ink/5"
        >
          <!-- Ilustracija na bež pozadini sa blagim narandžastim sjajem odozdo -->
          <div class="illustration-glow flex h-60 items-center justify-center overflow-hidden rounded-2xl bg-sand px-6" aria-hidden="true">
            <!-- Ilustracija se blago uveća kad je miš iznad kartice (`group` je na <li>) -->
            <div class="flex w-full justify-center transition-transform duration-300 group-hover:scale-[1.03]">
              <HomeStepIllustrationSearch v-if="step.illustration === 'search'" />
              <HomeStepIllustrationReview v-else-if="step.illustration === 'review'" />
              <HomeStepIllustrationCompare v-else />
            </div>
          </div>

          <!-- Tekst -->
          <div class="flex flex-1 flex-col px-3 pb-3 pt-5">
            <div class="flex items-center gap-3">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-display font-bold text-white">
                {{ index + 1 }}
              </span>
              <h3 class="font-display text-data-lg font-bold text-ink">{{ step.title }}</h3>
            </div>
            <p class="mt-3 text-body-sm text-ink/65">{{ step.text }}</p>
            <!-- mt-auto gura link na dno, pa su linkovi u ravni i kad su tekstovi različite dužine -->
            <NuxtLink :to="step.link.to" class="mt-auto self-start pt-5 text-body-sm font-medium link-underline">
              {{ step.link.label }} →
            </NuxtLink>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
/* Blagi narandžasti sjaj odozdo iza ilustracije. Boja je accent #D9530E sa malom providnošću. */
.illustration-glow {
  background-image: radial-gradient(circle at 50% 120%, rgba(217, 83, 14, 0.14), transparent 60%);
}
</style>
