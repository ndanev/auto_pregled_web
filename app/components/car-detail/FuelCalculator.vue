<script setup lang="ts">
// Kalkulator troška goriva: korisnik unese koliko vozi i koliko plaća gorivo,
// a mi iz potrošnje iz AI analize računamo mesečni i godišnji trošak (račun je u utils/fuelCost.ts).
// Prikazuje se samo kad u analizi postoji potrošnja u l/100 km (vidi CarDetailCosts).
// Kilometraža i cene se pamte u browseru, pa važe i kad korisnik otvori drugi automobil.
import type { CarAnalysis } from '~/types/car'

const props = defineProps<{
  consumption: CarAnalysis['fuel_consumption']
  fuel: PumpFuel
}>()

// ---------------------------------------------------------------------------
// Način vožnje: grad, kombinovano ili otvoren put
// ---------------------------------------------------------------------------

type DrivingStyle = 'city' | 'combined' | 'highway' // isti ključevi kao u analysis.fuel_consumption

const DRIVING_STYLES: { key: DrivingStyle; label: string }[] = [
  { key: 'city', label: 'Po gradu' },
  { key: 'combined', label: 'Kombinovano' },
  { key: 'highway', label: 'Otvoren put' },
]

/** Samo načini vožnje za koje analiza ima broj, zajedno sa tim brojem. */
const availableStyles = computed(() => {
  const styles: { key: DrivingStyle; label: string; parsed: ParsedFuel }[] = []
  for (const style of DRIVING_STYLES) {
    const parsed = extractFuel(props.consumption[style.key])
    if (parsed) styles.push({ ...style, parsed })
  }
  return styles
})

/** Na početku je izabrano "Kombinovano"; ako za njega nema broja, prvi način koji ima. */
function defaultDrivingStyle(): DrivingStyle {
  const hasCombined = availableStyles.value.some((style) => style.key === 'combined')
  if (hasCombined) return 'combined'
  return availableStyles.value[0]?.key ?? 'combined'
}

const drivingStyle = ref<DrivingStyle>(defaultDrivingStyle())
const selectedStyle = computed(() => availableStyles.value.find((style) => style.key === drivingStyle.value))

// ---------------------------------------------------------------------------
// Unos korisnika i rezultat
// ---------------------------------------------------------------------------

const kmPerYear = ref(DEFAULT_KM_PER_YEAR)
const prices = ref({ ...DEFAULT_FUEL_PRICES }) // cene za oba goriva, da se pamte i kad korisnik pređe na drugi auto

/** null kad nema dovoljno podataka za račun (npr. korisnik je obrisao cenu). */
const yearly = computed(() => {
  const consumption = selectedStyle.value?.parsed
  const price = prices.value[props.fuel]
  // Prazno number polje daje '' umesto broja, pa proveravamo tip
  const hasValidPrice = typeof price === 'number' && price > 0
  if (!consumption || !hasValidPrice) return null
  return yearlyFuelCost(kmPerYear.value, consumption, price)
})

const monthly = computed(() => (yearly.value ? monthlyCost(yearly.value) : null))

// ---------------------------------------------------------------------------
// Pamćenje unosa u browseru (localStorage)
// Učitavamo tek u onMounted, jer localStorage ne postoji na serveru.
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'fuel-calculator'

function loadSavedInputs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    if (typeof saved.kmPerYear === 'number') kmPerYear.value = saved.kmPerYear
    if (typeof saved.prices?.benzin === 'number') prices.value.benzin = saved.prices.benzin
    if (typeof saved.prices?.dizel === 'number') prices.value.dizel = saved.prices.dizel
  } catch {}
}

function saveInputs() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ kmPerYear: kmPerYear.value, prices: prices.value }))
  } catch {}
}

onMounted(loadSavedInputs)
watch([kmPerYear, prices], saveInputs, { deep: true })

// Jedinstveni id-jevi za povezivanje <label for> sa poljima
const kmInputId = useId()
const priceInputId = useId()
</script>

<template>
  <div class="mt-6 rounded-xl border border-ink/10 bg-white">
    <div class="p-5 sm:p-6">
      <h4 class="font-display text-data-lg font-bold text-ink">Koliko će te koštati gorivo?</h4>
      <p class="mt-1 text-body-sm text-ink/60">Upiši koliko voziš i koliko plaćaš {{ fuel }} — račun se menja odmah.</p>

      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Kilometraža -->
        <div>
          <div class="flex items-baseline justify-between gap-4">
            <label :for="kmInputId" class="text-body-sm font-medium text-ink">Kilometara godišnje</label>
            <span class="font-data text-data font-semibold text-ink">{{ kmPerYear.toLocaleString('sr-Latn-RS') }} km</span>
          </div>
          <input
            :id="kmInputId" v-model.number="kmPerYear"
            type="range" min="3000" max="50000" step="1000"
            class="mt-3 w-full accent-accent"
          >
          <div class="mt-1 flex justify-between text-data-sm text-ink/50">
            <span>3.000</span>
            <span>50.000</span>
          </div>
        </div>

        <!-- Cena goriva -->
        <div>
          <label :for="priceInputId" class="text-body-sm font-medium text-ink">Cena goriva ({{ fuel }})</label>
          <div class="mt-2 flex items-center rounded-full border border-ink/15 bg-white focus-within:border-accent">
            <input
              :id="priceInputId" v-model.number="prices[fuel]"
              type="number" min="1" step="1" inputmode="numeric"
              class="w-full rounded-full bg-transparent px-4 py-2 font-data text-data text-ink focus:outline-none"
            >
            <span class="pr-4 text-body-sm text-ink/55 whitespace-nowrap">din/l</span>
          </div>
          <p class="mt-1 text-data-sm text-ink/50">Upiši cenu sa pumpe na kojoj sipaš.</p>
        </div>
      </div>

      <!-- Način vožnje: samo ako analiza ima više od jednog broja -->
      <fieldset v-if="availableStyles.length > 1" class="mt-6">
        <legend class="text-body-sm font-medium text-ink">Kako najviše voziš?</legend>
        <div class="mt-2 flex flex-wrap gap-2">
          <button
            v-for="style in availableStyles" :key="style.key"
            type="button"
            class="rounded-full border px-4 py-1.5 text-body-sm transition-colors"
            :class="style.key === drivingStyle ? 'border-ink bg-ink text-page font-medium' : 'border-ink/15 text-ink/70 hover:border-ink/40 hover:text-ink'"
            :aria-pressed="style.key === drivingStyle"
            @click="drivingStyle = style.key"
          >{{ style.label }}</button>
        </div>
      </fieldset>
    </div>

    <!-- Rezultat -->
    <div class="rounded-b-xl bg-sand p-5 sm:p-6" aria-live="polite">
      <div v-if="yearly && monthly && selectedStyle" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <span class="block text-body-sm text-ink/60">Mesečno</span>
          <span class="mt-1 block font-display text-display-sm font-bold text-ink">{{ formatCostRange(monthly) }}</span>
        </div>
        <div>
          <span class="block text-body-sm text-ink/60">Godišnje</span>
          <span class="mt-1 block font-display text-display-sm font-bold text-ink">{{ formatCostRange(yearly) }}</span>
        </div>
        <p class="sm:col-span-2 text-body-sm text-ink/60">
          Računato sa potrošnjom {{ selectedStyle.parsed.value }} l/100 km<template v-if="selectedStyle.parsed.estimate"> (procena iz AI analize)</template>.
          Stvarna potrošnja zavisi od stila vožnje i stanja automobila. Održavanje, registracija i osiguranje nisu uračunati.
        </p>
      </div>
      <p v-else class="text-body-sm text-ink/60">Upiši cenu goriva da bismo izračunali trošak.</p>
    </div>
  </div>
</template>
