<script setup lang="ts">
// Metodologija: šta znače ocene, odakle podaci i šta AI analiza ne može da zna.
// Tabela nivoa ocena dolazi iz SCORE_LEVELS (utils/carFormat.ts) — isti pragovi koje koristi ceo sajt.

const navItems = [
  { id: 'skala', label: 'Šta znači ocena' },
  { id: 'sta-ocenjujemo', label: 'Šta ocenjujemo' },
  { id: 'izvori', label: 'Odakle podaci' },
  { id: 'ogranicenja', label: 'Šta ne znamo' },
  { id: 'kako-koristiti', label: 'Kako da koristiš ocene' },
]

/** Raspon za prikaz, npr. "7,5 – 8,4". Gornja granica je za 0,1 manja od donje granice nivoa iznad. */
const levels = computed(() =>
  SCORE_LEVELS.map((level, index) => {
    const above = SCORE_LEVELS[index - 1]
    const range = above ? `${formatScore(level.min)} – ${formatScore(above.min - 0.1)}` : `${formatScore(level.min)} i više`
    return { ...level, range, tone: scoreTone(level.min) }
  })
)

const RATED_AREAS = [
  { title: 'Pouzdanost', text: 'Ukupna ocena i posebne ocene za motor, menjač i elektroniku, na osnovu poznatih kvarova za tu generaciju i motor.' },
  { title: 'Troškovi', text: 'Okvirna potrošnja goriva, nivo troškova održavanja u odnosu na klasu i cene najčešćih popravki.' },
  { title: 'Za volanom', text: 'Udobnost, performanse, upravljivost i zvučna izolacija — kako se auto ponaša u svakodnevnoj vožnji.' },
  { title: 'Za koga je', text: 'Kome auto odgovara, a kome ne, i koje verzije motora preporučujemo ili savetujemo da se zaobiđu.' },
]

const LIMITATIONS = [
  { title: 'Ne znamo stanje konkretnog automobila', text: 'Ocena važi za model i motor, ne za primerak koji gledaš. Loše održavan "pouzdan" auto može biti gori izbor od dobro održavanog prosečnog.' },
  { title: 'AI može da pogreši', text: 'Analizu pravi veštačka inteligencija. Trudimo se da jasno odvoji činjenice od procena, ali greške su moguće — posebno kod ređih modela.' },
  { title: 'Cene su okvirne', text: 'Iznosi popravki i održavanja su orijentacioni i zavise od servisa, delova i regiona.' },
  { title: 'Gde nema dovoljno podataka, to i piše', text: 'Ako za neki deo analize nije bilo dovoljno pouzdanih informacija, na stranici automobila stoji napomena umesto izmišljenog odgovora.' },
]

const HOW_TO_USE = [
  'Koristi ocene da suziš izbor na nekoliko modela i motora — i da znaš kojih da se kloniš.',
  'Uporedi finaliste jedan pored drugog na stranici za poređenje.',
  'Za konkretan auto koji gledaš, prođi spisak „Pre kupovine“ sa stranice tog modela.',
  'Pre uplate, uvek odvedi auto na nezavisan pregled kod mehaničara.',
]

useSeoMeta({
  title: 'Kako ocenjujemo automobile',
  description: 'Šta znače ocene od 1 do 10, odakle dolaze podaci u AI analizama i šta analiza ne može da zna o konkretnom polovnom automobilu.',
})
</script>

<template>
  <div>
    <PageHeader
      eyebrow="METODOLOGIJA"
      title="Kako ocenjujemo automobile"
      intro="Ocena na našem sajtu ti govori koliko je jedan model i motor dobar izbor kao polovan automobil — koliko je pouzdan, koliko košta da ga održavaš i na šta da paziš. Evo kako nastaje i kako da je čitaš."
    />

    <SectionNav :items="navItems" />

    <div class="site-container py-12">
      <div class="max-w-4xl space-y-16 md:space-y-20">
        <ContentSection id="skala" title="Šta znači ocena" intro="Svaki automobil dobija ocenu od 1 do 10, a uz nju i opis rečima, da ne moraš da pamtiš šta je dobro a šta loše.">
          <div class="mt-6 overflow-hidden rounded-xl border border-ink/10 bg-white divide-y divide-ink/10">
            <div v-for="level in levels" :key="level.verdict" class="grid grid-cols-[110px_1fr] sm:grid-cols-[140px_200px_1fr] gap-x-6 gap-y-1 px-5 py-4 items-baseline">
              <span class="font-display font-bold text-data-lg" :class="level.tone.text">{{ level.range }}</span>
              <span class="text-body font-semibold text-ink">{{ level.verdict }}</span>
              <span class="col-start-2 sm:col-start-auto text-body-sm text-ink/70">{{ level.meaning }}</span>
            </div>
          </div>
          <p class="mt-4 text-body-sm text-ink/60">
            Boje prate isti princip svuda na sajtu: <span class="font-semibold text-positive">zeleno</span> je dobro,
            <span class="font-semibold text-caution">žuto</span> traži oprez, <span class="font-semibold text-negative">crveno</span> je slabost.
          </p>
        </ContentSection>

        <ContentSection id="sta-ocenjujemo" title="Šta ocenjujemo" intro="Ukupna ocena je sažetak, a na stranici svakog automobila nalaze se i detalji po oblastima.">
          <InfoCardGrid :items="RATED_AREAS" class="mt-6" />
        </ContentSection>

        <ContentSection id="izvori" title="Odakle podaci">
          <div class="mt-4 space-y-4 text-body text-ink/75">
            <p>
              Analizu piše AI jezički model. Kao polaznu tačku dobija tehničke podatke o vozilu — generaciju, motor,
              menjač, snagu — a ostalo zaključuje iz opšteg znanja o tom modelu koje je stekao iz javno dostupnih izvora.
            </p>
            <p>
              Ne prikupljamo podatke direktno od servisa niti od vlasnika. Zato analizu shvati kao dobro informisan
              pregled poznatih prednosti i slabosti modela, a ne kao proveru konkretnog automobila.
            </p>
            <p>
              Rezultat je strukturirana analiza: ocene, prednosti i mane, poznati problemi i saveti pre kupovine.
              Uz svaku analizu stoji datum poslednjeg ažuriranja.
            </p>
          </div>
        </ContentSection>

        <ContentSection id="ogranicenja" title="Šta ne znamo" intro="Važno je da znaš i šta ocena ne može da ti kaže.">
          <InfoCardGrid :items="LIMITATIONS" variant="sand" class="mt-6" />
        </ContentSection>

        <ContentSection id="kako-koristiti" title="Kako da koristiš ocene">
          <NumberedList :items="HOW_TO_USE" class="mt-6" />

          <div class="mt-10 flex flex-wrap gap-3">
            <NuxtLink to="/automobili" class="btn-primary">Pogledaj automobile</NuxtLink>
            <NuxtLink to="/vodic" class="btn-secondary">Vodič za kupovinu</NuxtLink>
          </div>
        </ContentSection>
      </div>
    </div>
  </div>
</template>
