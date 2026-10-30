<template>
  <!-- Poziv na poređenje: tamnoplavi blok između listi automobila na početnoj -->
  <section class="site-container">
    <div class="rounded-3xl bg-ink text-white">
      <div class="px-6 py-10 md:px-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <span class="font-data text-eyebrow text-accent-light">NEODLUČAN?</span>
          <h2 class="font-display font-bold uppercase text-display-sm text-white mt-1">
            Uporedi dva automobila jedan pored drugog
          </h2>
          <p class="text-body-sm text-white/70 mt-2 max-w-md">
            Pouzdanost, potrošnja i AI zaključak — sve na jednom ekranu, pre nego što odlučiš.
          </p>
        </div>
        <NuxtLink
          to="/uporedi"
          class="shrink-0 bg-accent text-white text-body-sm font-semibold rounded-full px-6 py-3 hover:bg-accent-dark transition-colors"
        >
          Uporedi automobile →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
