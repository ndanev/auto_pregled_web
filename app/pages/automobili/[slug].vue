<script setup lang="ts">
// Stranica jednog automobila. Ova stranica samo učitava podatke i slaže sekcije —
// sav prikaz je u komponentama iz `components/car-detail/`.
const route = useRoute()
const slug = route.params.slug as string

const { fetchCarBySlug } = useCarsApi()
const { data, error } = await useAsyncData(`car-${slug}`, () => fetchCarBySlug(slug))

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Automobil nije pronađen' })
}

const car = computed(() => data.value!.data)
const analysis = computed(() => car.value.analysis)

useCarSeo(car)

// Stavke lepljive navigacije. Sekcije bez podataka se ne prikazuju, pa ih izostavljamo i ovde.
// `id` mora da odgovara `id`-ju u odgovarajućoj CarDetail* komponenti.
const navItems = computed(() => {
  const a = analysis.value
  if (!a) return []
  return [
    { id: 'ukratko', label: 'Ukratko' },
    { id: 'pouzdanost', label: 'Pouzdanost' },
    { id: 'troskovi', label: 'Troškovi' },
    ...(a.maintenance.common_repairs.length > 0 ? [{ id: 'kvarovi', label: 'Poznati problemi' }] : []),
    { id: 'pregled', label: 'Pre kupovine' },
    ...(a.alternatives.length > 0 ? [{ id: 'alternative', label: 'Alternative' }] : []),
    ...(a.faq?.length ? [{ id: 'pitanja', label: 'Pitanja' }] : []),
  ]
})

const updatedAt = computed(() => formatDate(analysis.value?.meta?.generated_at))
</script>

<template>
  <div>
    <CarDetailHero :car="car" />

    <SectionNav v-if="navItems.length > 0" :items="navItems" />

    <div class="site-container py-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_360px] gap-12 lg:gap-16 xl:gap-24">
      <article class="min-w-0">
        <p v-if="!analysis" class="rounded-xl border border-ink/10 p-6 text-body text-ink/60">
          Analiza za ovaj automobil još nije gotova. Tehnički podaci su dostupni sa strane, a detaljan pregled stiže uskoro.
        </p>

        <div v-else class="space-y-16 md:space-y-20">
          <CarDetailSummary :analysis="analysis" />
          <CarDetailReliability :analysis="analysis" />
          <CarDetailCosts :analysis="analysis" :fuel-type="car.fuel_type" />
          <CarDetailKnownIssues v-if="analysis.maintenance.common_repairs.length > 0" :repairs="analysis.maintenance.common_repairs" />
          <CarDetailBuyingGuide
            :guide="analysis.buying_guide"
            :car-slug="car.slug"
            :checklist-title="`Pregled: ${carName(car)} ${car.engine}`"
          />
          <CarDetailAlternatives v-if="analysis.alternatives.length > 0" :alternatives="analysis.alternatives" />
          <ContentSection v-if="analysis.faq?.length" id="pitanja" title="Česta pitanja">
            <FaqAccordion :items="analysis.faq" class="mt-4" />
          </ContentSection>

          <footer class="rounded-xl bg-sand p-5 text-body-sm text-ink/60">
            <p>
              Ovaj pregled je napravljen uz pomoć veštačke inteligencije, na osnovu tehničkih podataka i opšte poznatih
              iskustava sa modelom. Gde podaci nisu bili dovoljni, to smo i naznačili. Pre kupovine uvek odvedi auto na
              nezavisan pregled kod mehaničara.
              <NuxtLink to="/kako-ocenjujemo" class="link-underline">Kako ocenjujemo →</NuxtLink>
            </p>
            <p v-if="updatedAt" class="mt-2 text-ink/50">Poslednje ažurirano: {{ updatedAt }}</p>
          </footer>
        </div>
      </article>

      <CarDetailSpecsAside :car="car" />
    </div>
  </div>
</template>
