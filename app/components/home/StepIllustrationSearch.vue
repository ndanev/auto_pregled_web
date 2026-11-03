<!--
  Ilustracija za korak "Pronađi model" u sekciji Kako radi (HomeHowItWorks):
  polje za pretragu sa upitom i padajuća lista sa jednim pogotkom. Samo ukras, bez pravih podataka.
-->
<template>
  <div class="w-full max-w-[260px]">
    <!-- Polje za pretragu sa trepćućim kursorom -->
    <div class="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm ring-1 ring-ink/10">
      <SearchIcon :size="16" class="text-ink/45" />
      <span class="text-body-sm text-ink">golf 7</span>
      <span class="-ml-1.5 h-4 w-px animate-pulse bg-accent"></span>
    </div>

    <!-- Padajuća lista: označen pogodak + jedan red "kostura" (sive trake umesto teksta) -->
    <div class="mt-2 rounded-2xl bg-white p-1.5 shadow-lg shadow-ink/10 ring-1 ring-ink/10">
      <div class="flex items-center gap-3 rounded-xl bg-accent/10 px-2.5 py-2">
        <span class="h-7 w-9 rounded-md bg-gradient-to-br from-sand to-sand-deep"></span>
        <span class="flex-1 text-left text-data-sm font-semibold text-ink">Volkswagen Golf 7</span>
        <span class="text-data-sm text-ink/40">→</span>
      </div>
      <div class="flex items-center gap-3 px-2.5 py-2">
        <span class="h-7 w-9 rounded-md bg-sand"></span>
        <span class="h-2 flex-1 rounded-full bg-ink/10"></span>
        <span class="h-2 w-5 rounded-full bg-ink/10"></span>
      </div>
    </div>
  </div>
</template>
