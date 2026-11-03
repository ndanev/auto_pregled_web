<script setup lang="ts">
// Logo sajta: znak (lupa sa automobilom) + ime "Autoskop".
// Ime: auto + "skop" (kao mikroskop) — sajt "vidi kroz" automobil pre kupovine.
//
// Veličina prati veličinu fonta roditelja (znak je 1.15em), pa se logo menja samo klasom za tekst:
//   <AppLogo class="text-xl" />  ili  <AppLogo class="text-display-sm" />
// Delovi u `currentColor` uzimaju boju teksta (ink), a drška lupe i "skop" su u accent boji.
</script>

<template>
  <span class="inline-flex items-center gap-[0.3em] whitespace-nowrap font-display font-extrabold tracking-tight text-ink">
    <svg viewBox="0 0 40 40" fill="none" class="h-[1.15em] w-[1.15em] shrink-0" aria-hidden="true">
      <!-- Sočivo lupe -->
      <circle cx="17" cy="17" r="12.5" stroke="currentColor" stroke-width="3" />
      <!-- Drška lupe -->
      <path d="M26.2 26.2 35 35" class="stroke-accent" stroke-width="5" stroke-linecap="round" />
      <!-- Automobil u sočivu: karoserija, linija praga i točkovi -->
      <path
        d="M8.6 20.2v-2.3c0-.6.4-1.1 1-1.3l2.4-.7 2.6-2.9c.4-.4.9-.7 1.5-.7h3.6c.6 0 1.1.2 1.5.6l2.9 2.9 1.8.5c.6.2 1 .7 1 1.3v2.6"
        stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
      />
      <path d="M8.4 20.4h17.4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
      <circle cx="12.6" cy="20.8" r="2.3" fill="currentColor" />
      <circle cx="21.6" cy="20.8" r="2.3" fill="currentColor" />
    </svg>
    <span>Auto<span class="text-accent">skop</span></span>
  </span>
</template>
