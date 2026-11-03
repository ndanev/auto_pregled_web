<!--
  Ilustracija za korak "Uporedi i odluči" u sekciji Kako radi (HomeHowItWorks):
  dve kartice automobila sa "vs" između; levi je bolji (zeleni okvir i oznaka). Brojevi su primer.
-->
<template>
  <div class="flex w-full max-w-[280px] items-center gap-2">
    <!-- Bolji automobil -->
    <div class="flex-1 rounded-2xl bg-white p-3 shadow-lg shadow-ink/10 ring-2 ring-positive/60">
      <span class="block h-12 rounded-lg bg-gradient-to-br from-sand to-sand-deep"></span>
      <span class="mt-2 block h-2 w-3/4 rounded-full bg-ink/15"></span>
      <span class="mt-2 block font-display text-data-lg font-bold text-positive">8,0</span>
      <span class="mt-1 inline-block rounded-full bg-positive/10 px-2 py-0.5 text-data-sm font-medium text-positive">✓ Bolji</span>
    </div>

    <VsBadge />

    <!-- Slabiji automobil -->
    <div class="flex-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-ink/10">
      <span class="block h-12 rounded-lg bg-sand"></span>
      <span class="mt-2 block h-2 w-2/3 rounded-full bg-ink/15"></span>
      <span class="mt-2 block font-display text-data-lg font-bold text-caution">6,8</span>
      <!-- Nevidljiva kopija oznake, da obe kartice budu iste visine -->
      <span class="invisible mt-1 inline-block px-2 py-0.5 text-data-sm">✓ Bolji</span>
    </div>
  </div>
</template>
