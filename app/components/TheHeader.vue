<script setup lang="ts">
// Glavna navigacija.
// - Desktop (lg+): svi linkovi u jednom redu.
// - Telefon i tablet: dugme ☰ otvara meni ispod headera (6 linkova ne staje u jedan red).
// - Pretraga (HeaderSearch) je uvek vidljiva: kao polje na desktopu, kao ikonica na telefonu.
// `active-class` ističe link stranice na kojoj je korisnik (i za podstranice, npr. /automobili/golf).

interface NavLink {
  to: string
  label: string
  shortLabel?: string // kraći naziv za desktop red, kad pun naziv ne staje
}

interface NavGroup {
  title: string // naslov grupe u meniju na telefonu
  links: NavLink[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Automobili',
    links: [
      { to: '/automobili', label: 'Automobili' },
      { to: '/marke', label: 'Marke' },
      { to: '/uporedi', label: 'Uporedi' },
    ],
  },
  {
    title: 'Vodiči',
    links: [
      { to: '/vodic', label: 'Vodič za kupovinu', shortLabel: 'Vodič' },
      { to: '/recnik', label: 'Rečnik' },
      { to: '/kako-ocenjujemo', label: 'Kako ocenjujemo' },
    ],
  },
]

const isMenuOpen = ref(false)

// Meni se zatvara čim korisnik ode na drugu stranicu
const route = useRoute()
watch(() => route.fullPath, () => {
  isMenuOpen.value = false
})
</script>

<template>
  <header class="sticky top-0 z-20 bg-page/85 backdrop-blur border-b border-ink/10" @keydown.esc="isMenuOpen = false">
    <div class="site-container h-16 flex items-center justify-between gap-4">
      <NuxtLink to="/" class="flex items-center gap-2 whitespace-nowrap font-display font-extrabold text-xl sm:text-display-sm text-ink">
        <span class="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true"></span>
        Auto Pregled
      </NuxtLink>

      <div class="flex items-center gap-1 lg:gap-4">
        <!-- Desktop -->
        <nav class="hidden lg:flex items-center gap-1" aria-label="Glavna navigacija">
          <template v-for="group in NAV_GROUPS" :key="group.title">
            <NuxtLink
              v-for="link in group.links" :key="link.to"
              :to="link.to"
              class="rounded-full px-3 py-1.5 text-body-sm font-medium text-ink/60 hover:text-ink hover:bg-ink/5 transition-colors whitespace-nowrap"
              active-class="!text-ink bg-ink/5"
            >
              {{ link.shortLabel ?? link.label }}
            </NuxtLink>
          </template>
        </nav>

        <HeaderSearch />

        <!-- Telefon i tablet: dugme za meni -->
        <button
          type="button"
          class="lg:hidden -mr-2 flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 transition-colors"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="isMenuOpen ? 'Zatvori meni' : 'Otvori meni'"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg v-if="!isMenuOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Telefon i tablet: otvoren meni -->
    <nav
      v-if="isMenuOpen"
      id="mobile-menu"
      class="lg:hidden border-t border-ink/10 bg-page shadow-lg shadow-ink/5"
      aria-label="Glavna navigacija"
    >
      <div class="site-container py-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div v-for="group in NAV_GROUPS" :key="group.title">
          <p class="px-3 font-data text-eyebrow text-steel">{{ group.title.toUpperCase() }}</p>
          <ul class="mt-2">
            <li v-for="link in group.links" :key="link.to">
              <NuxtLink
                :to="link.to"
                @click="isMenuOpen = false"
                class="block rounded-lg px-3 py-2.5 text-body font-medium text-ink/75 hover:bg-ink/5 hover:text-ink transition-colors"
                active-class="!text-accent-dark bg-accent/5"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
