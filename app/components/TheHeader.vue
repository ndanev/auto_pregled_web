<script setup lang="ts">
// Glavna navigacija. `active-class` ističe link stranice na kojoj je korisnik (i za podstranice, npr. /automobili/golf).
const links = [
  { to: '/automobili', label: 'Automobili' },
  { to: '/marke', label: 'Marke' },
  { to: '/uporedi', label: 'Uporedi' },
]
</script>

<template>
  <header class="sticky top-0 z-20 bg-page/85 backdrop-blur border-b border-ink/10">
    <div class="site-container h-16 flex items-center justify-between gap-4">
      <NuxtLink to="/" class="flex items-center gap-2 whitespace-nowrap font-display font-extrabold text-xl sm:text-display-sm text-ink">
        <span class="hidden sm:block h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true"></span>
        Auto Pregled
      </NuxtLink>
      <nav class="flex items-center sm:gap-2" aria-label="Glavna navigacija">
        <NuxtLink
          v-for="link in links" :key="link.to"
          :to="link.to"
          class="rounded-full px-2 sm:px-3 py-1.5 text-data-sm sm:text-body-sm font-medium text-ink/60 hover:text-ink hover:bg-ink/5 transition-colors"
          active-class="!text-ink bg-ink/5"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
