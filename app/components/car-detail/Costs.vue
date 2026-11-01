<script setup lang="ts">
// Sekcija "Troškovi": potrošnja goriva i održavanje.
// Potrošnja stiže kao slobodan tekst — ako u njemu nađemo broj, prikazujemo ga krupno,
// a ako nijedan red nema broj, prikazujemo tekst kao listu.
// Kad brojeva ima, ispod tabele je i kalkulator troška goriva (FuelCalculator).
import type { CarAnalysis } from '~/types/car'

const props = defineProps<{ analysis: CarAnalysis; fuelType: string }>()

const fuelRows = computed(() => {
  const fuel = props.analysis.fuel_consumption
  return [
    { label: 'Grad', text: fuel.city },
    { label: 'Otvoren put', text: fuel.highway },
    { label: 'Kombinovano', text: fuel.combined },
  ].map((row) => ({ ...row, parsed: extractFuel(row.text) }))
})
const fuelHasNumbers = computed(() => fuelRows.value.some((row) => row.parsed))
const pumpFuel = computed(() => pumpFuelFor(props.fuelType))

const COST_LEVELS = [
  { key: 'low', label: 'Niski' },
  { key: 'medium', label: 'Srednji' },
  { key: 'high', label: 'Visoki' },
] as const

const costLevelLabel = computed(() => COST_LEVELS.find((level) => level.key === props.analysis.maintenance.cost_level)?.label)
const annualCost = computed(() => extractCost(props.analysis.maintenance.annual_estimate))
</script>

<template>
  <ContentSection id="troskovi" title="Troškovi" intro="Koliko troši i koliko košta da ostane ispravan.">
    <!-- Potrošnja goriva -->
    <h3 class="mt-8 text-body font-semibold text-ink">Potrošnja goriva</h3>
    <div v-if="fuelHasNumbers" class="mt-4 grid grid-cols-3 rounded-xl border border-ink/10 divide-x divide-ink/10">
      <div v-for="row in fuelRows" :key="row.label" class="p-3 sm:p-5">
        <span class="block text-body-sm text-ink/60">{{ row.label }}</span>
        <template v-if="row.parsed">
          <span class="mt-1 block font-data text-data-lg sm:text-data-xl font-semibold text-ink">{{ row.parsed.value }}</span>
          <span class="mt-1 block text-body-sm text-ink/55">
            l/100 km<template v-if="row.parsed.estimate"> · procena</template>
          </span>
        </template>
        <span v-else class="mt-1 block text-body-sm text-ink/70">{{ row.text }}</span>
      </div>
    </div>
    <dl v-else class="mt-4 space-y-3">
      <div v-for="row in fuelRows" :key="row.label" class="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-4">
        <dt class="text-body-sm text-ink/60">{{ row.label }}</dt>
        <dd class="text-body text-ink/75">{{ capitalize(row.text) }}</dd>
      </div>
    </dl>
    <CarDetailFuelCalculator v-if="fuelHasNumbers && pumpFuel" :consumption="analysis.fuel_consumption" :fuel="pumpFuel" />
    <p v-if="!fuelHasNumbers || hasInsufficientData(analysis, 'fuel_consumption')" class="mt-3 text-body-sm text-ink/55">
      Precizni podaci o potrošnji za ovu verziju nisu dostupni.
    </p>

    <!-- Održavanje -->
    <h3 class="mt-10 text-body font-semibold text-ink">Održavanje</h3>
    <div class="mt-4 rounded-xl border border-ink/10 bg-white p-5">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <span class="text-body-sm text-ink/60">Troškovi u odnosu na klasu</span>
        <!-- Skala Niski / Srednji / Visoki sa istaknutim trenutnim nivoom -->
        <div class="flex rounded-full bg-ink/5 p-1" role="img" :aria-label="`Troškovi održavanja: ${costLevelLabel}`">
          <span
            v-for="level in COST_LEVELS" :key="level.key"
            class="rounded-full px-3.5 py-1 text-body-sm transition-colors"
            :class="level.key === analysis.maintenance.cost_level ? 'bg-ink text-page font-medium' : 'text-ink/55'"
          >{{ level.label }}</span>
        </div>
      </div>
      <div class="mt-5 border-t border-ink/10 pt-4">
        <span class="block text-body-sm text-ink/60">Godišnje, okvirno</span>
        <span v-if="annualCost" class="mt-1 block font-data text-data-lg font-semibold text-ink">{{ annualCost.value }}</span>
        <p v-else class="mt-1 text-body text-ink/75">{{ capitalize(analysis.maintenance.annual_estimate) }}</p>
      </div>
    </div>
  </ContentSection>
</template>
