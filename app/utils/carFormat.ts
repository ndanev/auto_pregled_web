// Pomoćne funkcije za prikaz podataka o automobilu.
// Nuxt automatski uvozi sve iz `utils/`, pa se ove funkcije koriste u komponentama bez importa.

import type { CarAnalysis } from '~/types/car'
import { BODY_TYPE_CATEGORIES } from './bodyTypeCategories'
import { FUEL_TYPE_OPTIONS, TRANSMISSION_OPTIONS } from './carFilters'

// ---------------------------------------------------------------------------
// Tekst i oznake
// ---------------------------------------------------------------------------

/** Pun naziv za prikaz: "Renault Kadjar". Radi i za CarSummary i za CarDetail. */
export function carName(car: { brand: string; model: string }): string {
  return `${car.brand} ${car.model}`
}

/** "dizel" → "Dizel". Prazna vrednost → "—". */
export function capitalize(value: string | null | undefined): string {
  if (!value) return '—'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** Pretvara API vrednost u čitljivu oznaku iz liste opcija, npr. 'dsg_cvt' → 'DSG/CVT'. */
function labelFrom(options: { value: string; label: string }[], value: string | null | undefined): string {
  if (!value) return '—'
  return options.find((o) => o.value === value)?.label ?? capitalize(value)
}

export const fuelLabel = (value: string | null | undefined) => labelFrom(FUEL_TYPE_OPTIONS, value)
export const transmissionLabel = (value: string | null | undefined) => labelFrom(TRANSMISSION_OPTIONS, value)
export const bodyTypeLabel = (value: string | null | undefined) => labelFrom(BODY_TYPE_CATEGORIES, value)

// ---------------------------------------------------------------------------
// Ocene (0–10)
// ---------------------------------------------------------------------------

/** 7.2 → "7,2" (srpski decimalni zarez). */
export function formatScore(score: number): string {
  return score.toFixed(1).replace('.', ',')
}

/**
 * Nivoi ocene, od najboljeg ka najslabijem. `min` je najniža ocena koja ulazi u nivo.
 * Koristi ih scoreVerdict, a stranica /kako-ocenjujemo iz njih pravi tabelu —
 * zato se pragovi menjaju samo ovde.
 */
export const SCORE_LEVELS = [
  { min: 8.5, verdict: 'Odličan izbor', meaning: 'Pouzdan model sa malo poznatih problema. Teško se greši uz redovno održavanje.' },
  { min: 7.5, verdict: 'Vrlo dobar izbor', meaning: 'Dobar model sa nekoliko poznatih slabosti koje se lako proveravaju pre kupovine.' },
  { min: 6.5, verdict: 'Dobar, uz oprez', meaning: 'Solidan izbor, ali ima kvarove na koje treba obratiti pažnju — istorija servisa je presudna.' },
  { min: 5, verdict: 'Prosečan', meaning: 'Više poznatih problema ili skuplje održavanje. Kupuj samo uz detaljan pregled.' },
  { min: 0, verdict: 'Ispod proseka', meaning: 'Česti ili skupi kvarovi. Ima boljih izbora u istoj klasi.' },
] as const

/** Ocena rečima, za korisnike kojima broj sam po sebi ne govori mnogo. */
export function scoreVerdict(score: number): string {
  return SCORE_LEVELS.find((level) => score >= level.min)?.verdict ?? 'Ispod proseka'
}

/**
 * Samo ocenjeni automobili, od najbolje ka najslabijoj oceni. Ne menja originalnu listu.
 * Primer: sortByRating(cars)[0] je najbolje ocenjen automobil.
 */
export function sortByRating<Car extends { overall_rating: number | null }>(cars: Car[]): Car[] {
  return cars
    .filter((car) => car.overall_rating !== null)
    .sort((a, b) => (b.overall_rating ?? 0) - (a.overall_rating ?? 0))
}

/**
 * Tailwind klase za boju ocene (zeleno / žuto / crveno).
 * Klase su napisane u celosti jer Tailwind ne prepoznaje klase sastavljene u runtime-u.
 */
export function scoreTone(score: number): { text: string; bg: string } {
  if (score >= 7.5) return { text: 'text-positive', bg: 'bg-positive' }
  if (score >= 5.5) return { text: 'text-caution', bg: 'bg-caution' }
  return { text: 'text-negative', bg: 'bg-negative' }
}

// ---------------------------------------------------------------------------
// Čitanje brojeva iz AI teksta
// AI analiza nekad vrati "4.5–5.6 L/100km", a nekad celu rečenicu bez broja.
// Funkcije ispod vraćaju null kada broj ne postoji — tada komponenta prikazuje originalni tekst.
// ---------------------------------------------------------------------------

export interface ParsedValue {
  value: string // formatirana vrednost za prikaz, npr. "4,4–5,0" ili "300–800 €"
  estimate: boolean // true ako je AI naglasio da je u pitanju procena
}

const ESTIMATE_WORDS = /procena|približno|oko|cca|otprilike/i

function toDecimalComma(value: string): string {
  return value.replace('.', ',')
}

export interface ParsedFuel extends ParsedValue {
  average: number // srednja vrednost u l/100 km, za poređenje dva automobila (4,4–5,0 → 4,7)
}

/** "procena: 4.4–5.0 L/100km" → { value: "4,4–5,0", estimate: true, average: 4.7 } */
export function extractFuel(text: string): ParsedFuel | null {
  // broj, opciono "– drugi broj", pa "l/100km" (razmaci i velika/mala slova su dozvoljeni)
  const match = text.match(/(\d+(?:[.,]\d+)?)(?:\s*[–-]\s*(\d+(?:[.,]\d+)?))?\s*l\s*\/\s*100\s*km/i)
  if (!match) return null
  const [, from = '', to] = match
  const value = to ? `${toDecimalComma(from)}–${toDecimalComma(to)}` : toDecimalComma(from)

  const low = Number(from.replace(',', '.'))
  const high = to ? Number(to.replace(',', '.')) : low
  return { value, estimate: ESTIMATE_WORDS.test(text), average: (low + high) / 2 }
}

/** "procena 300-800 EUR" → { value: "300–800 €", estimate: true } */
export function extractCost(text: string): ParsedValue | null {
  // broj, opciono "– drugi broj", pa "eur" ili "€"
  const match = text.match(/(\d[\d.]*)(?:\s*[–-]\s*(\d[\d.]*))?\s*(?:eur|€)/i)
  if (!match) return null
  const [, from = '', to] = match
  const value = to ? `${from}–${to} €` : `${from} €`
  return { value, estimate: ESTIMATE_WORDS.test(text) }
}

/**
 * Da li je AI označio sekciju kao nedovoljno pokrivenu podacima.
 * `insufficient_sections` je slobodan tekst, pa tražimo ključ bilo gde u stringu
 * (npr. 'reliability' pogađa i "reliability" i "Reliability (procena)").
 */
export function hasInsufficientData(analysis: CarAnalysis, section: string): boolean {
  return analysis.data_quality.insufficient_sections.some((s) => s.toLowerCase().includes(section))
}

// ---------------------------------------------------------------------------
// Datumi
// ---------------------------------------------------------------------------

/** "2026-08-26T07:22:44Z" → "26. avgust 2026." */
export function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('sr-Latn-RS', { day: 'numeric', month: 'long', year: 'numeric' })
}
