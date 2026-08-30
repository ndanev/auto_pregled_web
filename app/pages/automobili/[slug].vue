<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { fetchCarBySlug } = useCarsApi()
const { data, error } = await useAsyncData(`car-${slug}`, () => fetchCarBySlug(slug))

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Automobil nije pronađen' })
}

const car = computed(() => data.value!.data)
const analysis = computed(() => car.value.analysis)

const costLevelLabels: Record<string, string> = { low: 'Nizak', medium: 'Srednji', high: 'Visok' }

function isInsufficient(section: string): boolean {
  return analysis.value?.data_quality.insufficient_sections.includes(section) ?? false
}

const ogImage = computed(() => car.value.images[0]?.url)

useSeoMeta({
  title: car.value.meta_title || `${car.value.brand} ${car.value.model} — AI Pregled`,
  description: car.value.meta_description || analysis.value?.ai_summary.short_description,
  ogTitle: car.value.meta_title || `${car.value.brand} ${car.value.model}`,
  ogDescription: car.value.meta_description || analysis.value?.ai_summary.short_description,
  ogImage: ogImage.value,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Vehicle',
          name: `${car.value.brand} ${car.value.model} ${car.value.generation}`,
          brand: { '@type': 'Brand', name: car.value.brand },
          model: car.value.model,
          vehicleEngine: {
            '@type': 'EngineSpecification',
            name: car.value.engine,
            fuelType: car.value.fuel_type,
          },
          vehicleTransmission: car.value.transmission,
          ...(ogImage.value && { image: ogImage.value }),
        })
      ),
    },
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
        if (!analysis.value?.faq || analysis.value.faq.length === 0) return ''
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: analysis.value.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        })
      }),
    },
  ],
})
</script>

<template>
  <div>
    <section class="relative border-b border-black/10 overflow-hidden">
      <div class="relative mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start">
          <div>
            <span class="font-mono text-eyebrow text-steel">
              {{ (car.body_type ?? car.fuel_type).toUpperCase() }} · {{ car.fuel_type.toUpperCase() }}
            </span>
            <h1 class="font-display font-extrabold uppercase leading-[0.9] text-display-lg md:text-display-xl mt-2 text-ink">
              {{ car.brand }} {{ car.model }}
            </h1>
            <p class="font-mono text-data text-ink/60 mt-3">
              {{ car.generation }} · {{ car.years }} · {{ car.engine }} · {{ car.power_hp }} KS
            </p>
            <p v-if="analysis" class="mt-6 text-body-lg text-ink/70 max-w-xl">
              {{ analysis.ai_summary.short_description }}
            </p>
          </div>
          <RatingGauge v-if="car.overall_rating" :rating="car.overall_rating" label="AI OCENA" :size="200" />
        </div>

        <div class="mt-10 grid grid-cols-2 sm:grid-cols-4 border-t border-black/10 pt-6 gap-6">
          <div v-for="spec in [
            { label: 'GORIVO', value: car.fuel_type },
            { label: 'SNAGA', value: `${car.power_hp} KS` },
            { label: 'MENJAČ', value: car.transmission },
            { label: 'GENERACIJA', value: car.years },
          ]" :key="spec.label">
            <span class="block font-mono text-eyebrow text-ink/40">{{ spec.label }}</span>
            <span class="block font-mono text-data text-ink mt-1">{{ spec.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <div v-if="car.images.length > 0" class="mx-auto max-w-5xl px-6 pt-10">
      <CarGallery :images="car.images" />
    </div>

    <section class="mx-auto max-w-5xl px-6 pt-10">
      <SectionLabel text="SPECIFIKACIJE" />
      <div class="rounded-2xl border border-black/10 overflow-hidden">
        <div class="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 divide-black/10">
          <div class="divide-y divide-black/10">
            <div class="flex items-center justify-between px-5 py-3">
              <span class="font-mono text-data-sm text-ink/50">Marka</span>
              <span class="font-mono text-data-sm text-ink">{{ car.brand }}</span>
            </div>
            <div class="flex items-center justify-between px-5 py-3">
              <span class="font-mono text-data-sm text-ink/50">Model</span>
              <span class="font-mono text-data-sm text-ink">{{ car.model }}</span>
            </div>
            <div class="flex items-center justify-between px-5 py-3">
              <span class="font-mono text-data-sm text-ink/50">Generacija</span>
              <span class="font-mono text-data-sm text-ink">{{ car.generation }}</span>
            </div>
            <div class="flex items-center justify-between px-5 py-3">
              <span class="font-mono text-data-sm text-ink/50">Godina proizvodnje</span>
              <span class="font-mono text-data-sm text-ink">{{ car.years }}</span>
            </div>
            <div class="flex items-center justify-between px-5 py-3">
              <span class="font-mono text-data-sm text-ink/50">Karoserija</span>
              <span class="font-mono text-data-sm text-ink">{{ car.body_type ?? '—' }}</span>
            </div>
          </div>

          <div class="divide-y divide-black/10">
            <div class="flex items-center justify-between px-5 py-3">
              <span class="font-mono text-data-sm text-ink/50">Motor</span>
              <span class="font-mono text-data-sm text-ink">{{ car.engine }}</span>
            </div>
            <div class="flex items-center justify-between px-5 py-3">
              <span class="font-mono text-data-sm text-ink/50">Gorivo</span>
              <span class="font-mono text-data-sm text-ink">{{ car.fuel_type }}</span>
            </div>
            <div class="flex items-center justify-between px-5 py-3">
              <span class="font-mono text-data-sm text-ink/50">Zapremina</span>
              <span class="font-mono text-data-sm text-ink">{{ car.displacement_cc ? `${car.displacement_cc} cm³` : '—' }}</span>
            </div>
            <div class="flex items-center justify-between px-5 py-3">
              <span class="font-mono text-data-sm text-ink/50">Snaga</span>
              <span class="font-mono text-data-sm text-ink">{{ car.power_hp ? `${car.power_hp} KS` : '—' }}</span>
            </div>
            <div class="flex items-center justify-between px-5 py-3">
              <span class="font-mono text-data-sm text-ink/50">Obrtni moment</span>
              <span class="font-mono text-data-sm text-ink">{{ car.torque_nm ? `${car.torque_nm} Nm` : '—' }}</span>
            </div>
            <div class="flex items-center justify-between px-5 py-3">
              <span class="font-mono text-data-sm text-ink/50">Menjač</span>
              <span class="font-mono text-data-sm text-ink">{{ car.transmission }}</span>
            </div>
            <div class="flex items-center justify-between px-5 py-3">
              <span class="font-mono text-data-sm text-ink/50">Pogon</span>
              <span class="font-mono text-data-sm text-ink">{{ car.drivetrain ?? '—' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="!analysis" class="mx-auto max-w-5xl px-6 py-14 text-ink/50 font-mono text-data">
      AI analiza za ovaj automobil još nije generisana.
    </div>

    <div v-else class="mx-auto max-w-5xl px-6 py-14 space-y-16">
      <section>
        <SectionLabel text="ZA KOGA JE" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="border border-black/10 rounded-2xl p-5">
            <span class="font-mono text-eyebrow text-diagnostic">IDEALNO ZA</span>
            <ul class="mt-3 space-y-1.5 text-body-sm text-ink/70">
              <li v-for="item in analysis.target_audience.ideal_for" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div class="border border-black/10 rounded-2xl p-5">
            <span class="font-mono text-eyebrow text-rust">NIJE PREPORUČLJIVO ZA</span>
            <ul class="mt-3 space-y-1.5 text-body-sm text-ink/70">
              <li v-for="item in analysis.target_audience.not_recommended_for" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <SectionLabel text="PREDNOSTI I MANE" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="border border-black/10 rounded-2xl p-5">
            <span class="font-mono text-eyebrow text-diagnostic">PREDNOSTI</span>
            <ul class="mt-3 space-y-3">
              <li v-for="item in analysis.strengths" :key="item.title">
                <span class="block text-body text-ink font-medium">{{ item.title }}</span>
                <span class="block text-body-sm text-ink/60 mt-0.5">{{ item.description }}</span>
              </li>
            </ul>
          </div>
          <div class="border border-black/10 rounded-2xl p-5">
            <span class="font-mono text-eyebrow text-rust">MANE</span>
            <ul class="mt-3 space-y-3">
              <li v-for="item in analysis.weaknesses" :key="item.title">
                <span class="block text-body text-ink font-medium">{{ item.title }}</span>
                <span class="block text-body-sm text-ink/60 mt-0.5">{{ item.description }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <SectionLabel text="POUZDANOST" />
        <p v-if="isInsufficient('reliability')" class="font-mono text-data-sm text-amber mb-3">
          Podaci o pouzdanosti su procena zasnovana na ograničenim informacijama.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center border border-black/10 rounded-2xl p-6">
          <RatingGauge :rating="analysis.reliability.score" label="POUZDANOST" :size="160" />
          <div class="space-y-4 w-full">
            <ScoreBar label="MOTOR" :score="analysis.reliability.engine_reliability" />
            <ScoreBar label="MENJAČ" :score="analysis.reliability.transmission_reliability" />
            <ScoreBar label="ELEKTRONIKA" :score="analysis.reliability.electronics_reliability" />
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SectionLabel text="POTROŠNJA GORIVA" />
          <div class="border border-black/10 rounded-2xl p-5 grid grid-cols-3 gap-4">
            <div v-for="row in [
              { label: 'GRAD', value: analysis.fuel_consumption.city },
              { label: 'PUT', value: analysis.fuel_consumption.highway },
              { label: 'KOMBINOVANO', value: analysis.fuel_consumption.combined },
            ]" :key="row.label">
              <span class="block font-mono text-eyebrow text-ink/40">{{ row.label }}</span>
              <span class="block font-mono text-data-lg text-ink mt-1">{{ row.value }}</span>
            </div>
          </div>
        </div>

        <div>
          <SectionLabel text="TROŠKOVI ODRŽAVANJA" />
          <div class="border border-black/10 rounded-2xl p-5">
            <div class="flex items-baseline justify-between">
              <span class="font-mono text-data-sm text-ink/50">Nivo troškova</span>
              <span class="font-mono text-data text-amber">{{ costLevelLabels[analysis.maintenance.cost_level] }}</span>
            </div>
            <div class="flex items-baseline justify-between mt-2">
              <span class="font-mono text-data-sm text-ink/50">Godišnja procena</span>
              <span class="font-mono text-data text-ink">{{ analysis.maintenance.annual_estimate }}</span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="analysis.maintenance.common_repairs.length > 0">
        <SectionLabel text="NAJČEŠĆI KVAROVI" />
        <div class="rounded-2xl border border-black/10 divide-y divide-black/10 overflow-hidden">
          <div v-for="repair in analysis.maintenance.common_repairs" :key="repair.problem" class="flex items-center justify-between px-5 py-3">
            <span class="text-body text-ink">{{ repair.problem }}</span>
            <span class="font-mono text-data-sm text-ink/60">{{ repair.estimated_cost }}</span>
          </div>
        </div>
      </section>

      <section>
        <SectionLabel text="KUPOVNI VODIČ" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span class="font-mono text-eyebrow text-diagnostic">PREPORUČENI MOTORI</span>
            <ul class="mt-3 space-y-1.5 text-body-sm text-ink/70">
              <li v-for="e in analysis.buying_guide.recommended_engines" :key="e">{{ e }}</li>
            </ul>
          </div>
          <div>
            <span class="font-mono text-eyebrow text-rust">IZBEGAVATI</span>
            <ul class="mt-3 space-y-1.5 text-body-sm text-ink/70">
              <li v-for="e in analysis.buying_guide.engines_to_avoid" :key="e">{{ e }}</li>
            </ul>
          </div>
          <div>
            <span class="font-mono text-eyebrow text-steel">PROVERITI PRE KUPOVINE</span>
            <ul class="mt-3 space-y-1.5 text-body-sm text-ink/70">
              <li v-for="p in analysis.buying_guide.inspection_points" :key="p">{{ p }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section v-if="analysis.alternatives.length > 0">
        <SectionLabel text="ALTERNATIVE" />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="alt in analysis.alternatives" :key="alt.model" class="border border-black/10 p-4">
            <span class="font-display font-bold uppercase text-display-sm text-ink">{{ alt.model }}</span>
            <p class="text-body-sm text-ink/60 mt-1">{{ alt.reason }}</p>
          </div>
        </div>
      </section>

      <section>
        <SectionLabel text="AI ZAKLJUČAK" />
        <div class="rounded-2xl border-l-4 border-amber p-6">
          <p class="text-body-lg text-ink/85">{{ analysis.ai_summary.final_verdict }}</p>
        </div>
      </section>

      <section v-if="analysis.faq && analysis.faq.length > 0">
        <SectionLabel text="ČESTA PITANJA" />
        <FaqAccordion :items="analysis.faq" />
      </section>
    </div>
  </div>
</template>