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

useSeoMeta({
  title: car.value.meta_title || `${car.value.brand} ${car.value.model}`,
  description: car.value.meta_description || analysis.value?.ai_summary.short_description,
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative border-b border-white/10 overflow-hidden">
      <div class="pointer-events-none absolute inset-0" style="background: radial-gradient(500px circle at 80% 0%, rgba(232,163,61,0.10), transparent 70%);"></div>
      <div class="relative mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start">
          <div>
            <span class="font-mono text-xs tracking-[0.2em] text-steel">
              {{ (car.body_type ?? car.fuel_type).toUpperCase() }} · {{ car.fuel_type.toUpperCase() }}
            </span>
            <h1 class="font-display font-extrabold uppercase leading-[0.9] text-5xl md:text-7xl mt-2 text-ink">
              {{ car.brand }} {{ car.model }}
            </h1>
            <p class="font-mono text-sm text-ink/60 mt-3">
              {{ car.generation }} · {{ car.years }} · {{ car.engine }} · {{ car.power_hp }} KS
            </p>
            <p v-if="analysis" class="mt-6 text-lg leading-relaxed max-w-xl text-ink/70">
              {{ analysis.ai_summary.short_description }}
            </p>
          </div>
          <RatingGauge v-if="car.overall_rating" :rating="car.overall_rating" label="AI OCENA" :size="200" />
        </div>

        <div class="mt-10 grid grid-cols-2 sm:grid-cols-4 border-t border-white/10 pt-6 gap-6">
          <div v-for="spec in [
            { label: 'GORIVO', value: car.fuel_type },
            { label: 'SNAGA', value: `${car.power_hp} KS` },
            { label: 'MENJAČ', value: car.transmission },
            { label: 'GENERACIJA', value: car.years },
          ]" :key="spec.label">
            <span class="block font-mono text-xs tracking-widest text-ink/40">{{ spec.label }}</span>
            <span class="block font-mono text-base text-ink mt-1">{{ spec.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <div v-if="car.images.length > 0" class="mx-auto max-w-5xl px-6 pt-10">
      <CarGallery :images="car.images" />
    </div>

    <div v-if="!analysis" class="mx-auto max-w-5xl px-6 py-14 text-ink/50 font-mono text-sm">
      AI analiza za ovaj automobil još nije generisana.
    </div>

    <div v-else class="mx-auto max-w-5xl px-6 py-14 space-y-16">
      <!-- Ciljna publika -->
      <section>
        <SectionLabel text="ZA KOGA JE" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="border border-white/10 bg-surface p-5">
            <span class="font-mono text-xs tracking-widest text-diagnostic">IDEALNO ZA</span>
            <ul class="mt-3 space-y-1.5 text-sm text-ink/70">
              <li v-for="item in analysis.target_audience.ideal_for" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div class="border border-white/10 bg-surface p-5">
            <span class="font-mono text-xs tracking-widest text-rust">NIJE PREPORUČLJIVO ZA</span>
            <ul class="mt-3 space-y-1.5 text-sm text-ink/70">
              <li v-for="item in analysis.target_audience.not_recommended_for" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Prednosti / Mane -->
      <section>
        <SectionLabel text="PREDNOSTI I MANE" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="border border-white/10 bg-surface p-5">
            <span class="font-mono text-xs tracking-widest text-diagnostic">PREDNOSTI</span>
            <ul class="mt-3 space-y-3">
              <li v-for="item in analysis.strengths" :key="item.title">
                <span class="block text-ink font-medium">{{ item.title }}</span>
                <span class="block text-sm text-ink/60 mt-0.5">{{ item.description }}</span>
              </li>
            </ul>
          </div>
          <div class="border border-white/10 bg-surface p-5">
            <span class="font-mono text-xs tracking-widest text-rust">MANE</span>
            <ul class="mt-3 space-y-3">
              <li v-for="item in analysis.weaknesses" :key="item.title">
                <span class="block text-ink font-medium">{{ item.title }}</span>
                <span class="block text-sm text-ink/60 mt-0.5">{{ item.description }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Pouzdanost -->
      <section>
        <SectionLabel text="POUZDANOST" />
        <p v-if="isInsufficient('reliability')" class="font-mono text-xs text-amber mb-3">
          Podaci o pouzdanosti su procena zasnovana na ograničenim informacijama.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center border border-white/10 bg-surface p-6">
          <RatingGauge :rating="analysis.reliability.score" label="POUZDANOST" :size="160" />
          <div class="space-y-4 w-full">
            <ScoreBar label="MOTOR" :score="analysis.reliability.engine_reliability" />
            <ScoreBar label="MENJAČ" :score="analysis.reliability.transmission_reliability" />
            <ScoreBar label="ELEKTRONIKA" :score="analysis.reliability.electronics_reliability" />
          </div>
        </div>
      </section>

      <!-- Potrošnja i troškovi -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SectionLabel text="POTROŠNJA GORIVA" />
          <div class="border border-white/10 bg-surface p-5 grid grid-cols-3 gap-4">
            <div v-for="row in [
              { label: 'GRAD', value: analysis.fuel_consumption.city },
              { label: 'PUT', value: analysis.fuel_consumption.highway },
              { label: 'KOMBINOVANO', value: analysis.fuel_consumption.combined },
            ]" :key="row.label">
              <span class="block font-mono text-[10px] tracking-widest text-ink/40">{{ row.label }}</span>
              <span class="block font-mono text-lg text-ink mt-1">{{ row.value }}</span>
            </div>
          </div>
        </div>

        <div>
          <SectionLabel text="TROŠKOVI ODRŽAVANJA" />
          <div class="border border-white/10 bg-surface p-5">
            <div class="flex items-baseline justify-between">
              <span class="font-mono text-xs text-ink/50">Nivo troškova</span>
              <span class="font-mono text-sm text-amber">{{ costLevelLabels[analysis.maintenance.cost_level] }}</span>
            </div>
            <div class="flex items-baseline justify-between mt-2">
              <span class="font-mono text-xs text-ink/50">Godišnja procena</span>
              <span class="font-mono text-sm text-ink">{{ analysis.maintenance.annual_estimate }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Najčešći kvarovi -->
      <section v-if="analysis.maintenance.common_repairs.length > 0">
        <SectionLabel text="NAJČEŠĆI KVAROVI" />
        <div class="border border-white/10 divide-y divide-white/10">
          <div v-for="repair in analysis.maintenance.common_repairs" :key="repair.problem" class="flex items-center justify-between px-5 py-3 bg-surface">
            <span class="text-ink">{{ repair.problem }}</span>
            <span class="font-mono text-sm text-ink/60">{{ repair.estimated_cost }}</span>
          </div>
        </div>
      </section>

      <!-- Kupovni vodič -->
      <section>
        <SectionLabel text="KUPOVNI VODIČ" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span class="font-mono text-xs tracking-widest text-diagnostic">PREPORUČENI MOTORI</span>
            <ul class="mt-3 space-y-1.5 text-sm text-ink/70">
              <li v-for="e in analysis.buying_guide.recommended_engines" :key="e">{{ e }}</li>
            </ul>
          </div>
          <div>
            <span class="font-mono text-xs tracking-widest text-rust">IZBEGAVATI</span>
            <ul class="mt-3 space-y-1.5 text-sm text-ink/70">
              <li v-for="e in analysis.buying_guide.engines_to_avoid" :key="e">{{ e }}</li>
            </ul>
          </div>
          <div>
            <span class="font-mono text-xs tracking-widest text-steel">PROVERITI PRE KUPOVINE</span>
            <ul class="mt-3 space-y-1.5 text-sm text-ink/70">
              <li v-for="p in analysis.buying_guide.inspection_points" :key="p">{{ p }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Alternative -->
      <section v-if="analysis.alternatives.length > 0">
        <SectionLabel text="ALTERNATIVE" />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="alt in analysis.alternatives" :key="alt.model" class="border border-white/10 bg-surface p-4">
            <span class="font-display font-bold uppercase text-lg text-ink">{{ alt.model }}</span>
            <p class="text-sm text-ink/60 mt-1">{{ alt.reason }}</p>
          </div>
        </div>
      </section>

      <!-- AI zaključak -->
      <section>
        <SectionLabel text="AI ZAKLJUČAK" />
        <div class="border-l-2 border-amber bg-surface p-6">
          <p class="text-lg leading-relaxed text-ink/85">{{ analysis.ai_summary.final_verdict }}</p>
        </div>
      </section>
    </div>
  </div>
</template>