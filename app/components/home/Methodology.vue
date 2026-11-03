<script setup lang="ts">
// Sekcija "Metodologija" na početnoj: kratko objašnjenje kako nastaje AI analiza i četiri principa koje sajt poštuje.
// Detaljno objašnjenje je na /kako-ocenjujemo — ovde je samo sažetak i link ka toj stranici.
//
// Svaki princip mora da bude tačan za ceo sajt. Ako se način rada promeni, promeni i tekst ovde.

interface Principle {
  title: string
  text: string
  iconPath: string // `d` atribut SVG putanje (ikonica 24×24, samo linije)
}

const PRINCIPLES: Principle[] = [
  {
    title: 'Polazi od tehničkih podataka',
    text: 'Generacija, motor, menjač i snaga su osnova svake analize — ocena važi za tačno tu verziju.',
    iconPath: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  },
  {
    title: 'Procene su označene kao procene',
    text: 'Kad broj nije pouzdan, piše „procena“ — npr. kod potrošnje i cena popravki.',
    iconPath: 'M12 4v16M6 20h12M5 8h14M5 8l-2.5 6a2.5 2.5 0 005 0zM19 8l-2.5 6a2.5 2.5 0 005 0z',
  },
  {
    title: 'Ne izmišlja kad ne zna',
    text: 'Ako za neki deo nema dovoljno podataka, umesto odgovora stoji napomena.',
    iconPath: 'M12 3l8 3v6c0 4.5-3.4 7.8-8 9-4.6-1.2-8-4.5-8-9V6zM12 9v4M12 16.5v.01',
  },
  {
    title: 'Datum uz svaku analizu',
    text: 'Na dnu stranice automobila vidiš kada je analiza poslednji put ažurirana.',
    iconPath: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  },
]
</script>

<template>
  <section class="border-t border-ink/10 bg-sand">
    <div class="site-container py-16 md:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16 items-center">
        <!-- Levo: objašnjenje i link -->
        <div>
          <span class="font-data text-eyebrow text-steel">METODOLOGIJA</span>
          <h2 class="mt-2 font-display font-bold text-display-sm md:text-display-md text-ink">
            Kako nastaje AI analiza
          </h2>
          <p class="mt-4 text-body text-ink/70">
            Analizu piše AI jezički model, na osnovu tehničkih podataka o vozilu i opšte poznatih iskustava sa
            tim modelom — motorom, pouzdanošću i tipičnim kvarovima.
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <NuxtLink to="/kako-ocenjujemo" class="btn-primary">Kako ocenjujemo</NuxtLink>
            <NuxtLink to="/recnik" class="text-body-sm link-underline">Rečnik pojmova →</NuxtLink>
          </div>

          <!-- Iskrena napomena o ograničenjima -->
          <p class="mt-8 flex gap-3 rounded-2xl border border-ink/10 bg-page/70 p-4 text-body-sm text-ink/65">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0 text-accent-dark" aria-hidden="true">
              <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" />
            </svg>
            <span>
              Podaci ne dolaze iz servisa niti od vlasnika, a ocena važi za model, ne za konkretan primerak.
              Pre kupovine uvek odvedi auto na nezavisan pregled kod mehaničara.
            </span>
          </p>
        </div>

        <!-- Desno: principi -->
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <li
            v-for="principle in PRINCIPLES" :key="principle.title"
            class="rounded-2xl bg-white p-6 ring-1 ring-ink/5 shadow-sm shadow-ink/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5"
          >
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent-dark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path :d="principle.iconPath" />
              </svg>
            </span>
            <h3 class="mt-4 text-body font-semibold text-ink">{{ principle.title }}</h3>
            <p class="mt-1.5 text-body-sm text-ink/65">{{ principle.text }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
