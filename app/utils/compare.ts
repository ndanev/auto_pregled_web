// Logika poređenja dva automobila (stranica /uporedi).
// Ovde se odlučuje ko je bolji u kom redu; komponente u components/compare/ samo prikazuju rezultat.

import type { CarDetail, CarSummary } from '~/types/car'
import { BODY_TYPE_CATEGORIES } from './bodyTypeCategories'
import { bodyTypeLabel, carName, extractFuel, formatScore, fuelLabel, sortByRating, transmissionLabel } from './carFormat'

/** Strana u poređenju: 'a' je levi (prvi) automobil, 'b' desni (drugi). */
export type Side = 'a' | 'b'

/** Jedan red tabele poređenja, npr. "Motor: 7,0 | 6,5". */
export interface CompareRowData {
  label: string
  a: string // vrednost za prikaz, levi automobil
  b: string // vrednost za prikaz, desni automobil
  winner: Side | null // null = nerešeno ili poređenje nema smisla (npr. godište)
  scores?: [number, number] // ocene 0–10; kad postoje, red prikazuje i trake
}

export interface CompareGroup {
  title: string
  rows: CompareRowData[]
}

// ---------------------------------------------------------------------------
// Ko je bolji
// ---------------------------------------------------------------------------

/** Razlike manje od ove smatramo nerešenim — 7,0 naspram 7,1 nije prava razlika. */
const TIE_MARGIN = 0.25

/**
 * Vraća koja strana je bolja, ili null ako je nerešeno / nema podatka.
 * Za ocene je veće bolje; za potrošnju i troškove prosledi `higherIsBetter = false`.
 */
export function pickWinner(a: number | null, b: number | null, higherIsBetter = true): Side | null {
  if (a === null || b === null) return null
  if (Math.abs(a - b) < TIE_MARGIN) return null

  const aIsBetter = higherIsBetter ? a > b : a < b
  return aIsBetter ? 'a' : 'b'
}

// ---------------------------------------------------------------------------
// Redovi poređenja
// ---------------------------------------------------------------------------

/** Nivo troškova održavanja: `rank` služi za poređenje (manji = jeftinije), `label` za prikaz. */
const COST_LEVELS = {
  low: { rank: 1, label: 'Niski' },
  medium: { rank: 2, label: 'Srednji' },
  high: { rank: 3, label: 'Visoki' },
} as const

/** Red sa ocenama 0–10 (veće je bolje, prikazuje se i traka). */
function scoreRow(label: string, a: number, b: number): CompareRowData {
  return { label, a: formatScore(a), b: formatScore(b), winner: pickWinner(a, b), scores: [a, b] }
}

/** Red sa tehničkim podatkom — bez pobednika, jer veća snaga ili novije godište nije uvek "bolje". */
function specRow(label: string, a: string, b: string): CompareRowData {
  return { label, a, b, winner: null }
}

/** Sve grupe redova. Grupe sa AI podacima se dodaju samo ako oba automobila imaju analizu. */
export function buildCompareGroups(carA: CarDetail, carB: CarDetail): CompareGroup[] {
  const groups: CompareGroup[] = []
  const a = carA.analysis
  const b = carB.analysis

  if (carA.overall_rating !== null && carB.overall_rating !== null) {
    groups.push({ title: 'Ukupna ocena', rows: [scoreRow('Ukupno', carA.overall_rating, carB.overall_rating)] })
  }

  if (a && b) {
    groups.push({
      title: 'Pouzdanost',
      rows: [
        scoreRow('Ukupna pouzdanost', a.reliability.score, b.reliability.score),
        scoreRow('Motor', a.reliability.engine_reliability, b.reliability.engine_reliability),
        scoreRow('Menjač', a.reliability.transmission_reliability, b.reliability.transmission_reliability),
        scoreRow('Elektronika', a.reliability.electronics_reliability, b.reliability.electronics_reliability),
      ],
    })

    groups.push({
      title: 'Za volanom',
      rows: [
        scoreRow('Udobnost', a.driving_experience.comfort, b.driving_experience.comfort),
        scoreRow('Performanse', a.driving_experience.performance, b.driving_experience.performance),
        scoreRow('Upravljivost', a.driving_experience.handling, b.driving_experience.handling),
        scoreRow('Zvučna izolacija', a.driving_experience.noise_level, b.driving_experience.noise_level),
      ],
    })

    // Potrošnja je u AI analizi slobodan tekst — poredimo samo ako je u oba teksta pronađen broj
    const fuelA = extractFuel(a.fuel_consumption.combined)
    const fuelB = extractFuel(b.fuel_consumption.combined)
    const costA = COST_LEVELS[a.maintenance.cost_level]
    const costB = COST_LEVELS[b.maintenance.cost_level]

    groups.push({
      title: 'Troškovi',
      rows: [
        {
          label: 'Potrošnja (kombinovano)',
          a: fuelA ? `${fuelA.value} l/100 km` : 'Nema podatka',
          b: fuelB ? `${fuelB.value} l/100 km` : 'Nema podatka',
          winner: pickWinner(fuelA?.average ?? null, fuelB?.average ?? null, false),
        },
        {
          label: 'Održavanje',
          a: costA.label,
          b: costB.label,
          winner: pickWinner(costA.rank, costB.rank, false),
        },
      ],
    })
  }

  groups.push({
    title: 'Tehnički podaci',
    rows: [
      specRow('Motor', carA.engine, carB.engine),
      specRow('Snaga', carA.power_hp ? `${carA.power_hp} KS` : '—', carB.power_hp ? `${carB.power_hp} KS` : '—'),
      specRow('Gorivo', fuelLabel(carA.fuel_type), fuelLabel(carB.fuel_type)),
      specRow('Menjač', transmissionLabel(carA.transmission), transmissionLabel(carB.transmission)),
      specRow('Karoserija', bodyTypeLabel(carA.body_type), bodyTypeLabel(carB.body_type)),
      specRow('Godine proizvodnje', carA.years, carB.years),
    ],
  })

  return groups
}

// ---------------------------------------------------------------------------
// Zaključak
// ---------------------------------------------------------------------------

/**
 * Rečenica za vrh rezultata, npr. "Toyota Corolla vodi u 6 od 8 poređenja."
 * Broje se samo redovi koji imaju pobednika (tehnički podaci nemaju).
 * Glagol "vodi" je namerno bez roda — iz naziva modela ne znamo da li je "bolji" ili "bolja".
 */
export function summarizeComparison(groups: CompareGroup[], carA: CarDetail, carB: CarDetail): string {
  const decidedRows = groups.flatMap((group) => group.rows).filter((row) => row.winner !== null)
  const winsA = decidedRows.filter((row) => row.winner === 'a').length
  const winsB = decidedRows.filter((row) => row.winner === 'b').length
  const total = decidedRows.length

  if (total === 0) return 'Za ova dva automobila nemamo dovoljno podataka za direktno poređenje.'
  if (winsA === winsB) return `Izjednačeni su — svaki je bolji u ${winsA} od ${total} poređenja.`
  if (winsA > winsB) return `${carName(carA)} vodi u ${winsA} od ${total} poređenja.`
  return `${carName(carB)} vodi u ${winsB} od ${total} poređenja.`
}

// ---------------------------------------------------------------------------
// Predlozi za birač
// ---------------------------------------------------------------------------

/**
 * Predložena poređenja: za svaku karoseriju, dva najbolje ocenjena modela.
 * Poređenje ima smisla samo između automobila iste klase.
 */
export function suggestPairs(cars: CarSummary[], limit = 4): [CarSummary, CarSummary][] {
  const pairs: [CarSummary, CarSummary][] = []

  for (const category of BODY_TYPE_CATEGORIES) {
    const [best, secondBest] = sortByRating(cars.filter((car) => car.body_type === category.value))
    if (best && secondBest) pairs.push([best, secondBest])
  }

  return pairs.slice(0, limit)
}
