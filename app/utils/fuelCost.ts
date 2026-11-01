// Računanje troška goriva za kalkulator na stranici automobila (components/car-detail/FuelCalculator.vue).

// ---------------------------------------------------------------------------
// Gorivo i početne vrednosti
// ---------------------------------------------------------------------------

/** Gorivo koje se sipa na pumpi. Hibridi i plug-in hibridi u ovom računu troše benzin. */
export type PumpFuel = 'benzin' | 'dizel'

/** Tip goriva iz API-ja → gorivo sa pumpe. Za elektro vraća null, jer se potrošnja ne meri u litrima. */
export function pumpFuelFor(fuelType: string): PumpFuel | null {
  if (fuelType === 'dizel') return 'dizel'
  if (fuelType === 'benzin' || fuelType === 'hibrid' || fuelType === 'plug_in_hibrid') return 'benzin'
  return null
}

/**
 * Početne cene u dinarima po litru. Korisnik ih menja u kalkulatoru, a izmena se pamti u browseru.
 * Cene na pumpama se menjaju svake nedelje — povremeno ažuriraj ove vrednosti.
 */
export const DEFAULT_FUEL_PRICES: Record<PumpFuel, number> = {
  benzin: 185,
  dizel: 195,
}

export const DEFAULT_KM_PER_YEAR = 15000

// ---------------------------------------------------------------------------
// Račun
// ---------------------------------------------------------------------------

/** Raspon troška u dinarima. Kad potrošnja nije raspon, `low` i `high` su isti. */
export interface CostRange {
  low: number
  high: number
}

/**
 * Godišnji trošak goriva: (kilometri / 100) × potrošnja na 100 km × cena litra.
 * Primer: 15.000 km, 4,4–5,0 l/100 km, 185 din/l → { low: 122.100, high: 138.750 }
 */
export function yearlyFuelCost(
  kmPerYear: number,
  consumption: { low: number; high: number }, // l/100 km, vidi extractFuel u utils/carFormat.ts
  pricePerLiter: number
): CostRange {
  const hundredsOfKm = kmPerYear / 100
  return {
    low: hundredsOfKm * consumption.low * pricePerLiter,
    high: hundredsOfKm * consumption.high * pricePerLiter,
  }
}

/** Godišnji iznos → mesečni. */
export function monthlyCost(yearly: CostRange): CostRange {
  return {
    low: yearly.low / 12,
    high: yearly.high / 12,
  }
}

// ---------------------------------------------------------------------------
// Prikaz
// ---------------------------------------------------------------------------

/** Zaokružuje na stotinu, da ne glumimo preciznost koju nemamo: 122137 → "122.100". */
function formatRoundedAmount(amount: number): string {
  const rounded = Math.round(amount / 100) * 100
  return rounded.toLocaleString('sr-Latn-RS')
}

/** { low: 122100, high: 138750 } → "122.100 – 138.800 din". Ako su zaokruženi iznosi isti, prikazuje jedan broj. */
export function formatCostRange(range: CostRange): string {
  const low = formatRoundedAmount(range.low)
  const high = formatRoundedAmount(range.high)
  if (low === high) return `${low} din`
  return `${low} – ${high} din`
}
