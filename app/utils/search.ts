// Pretraga automobila u browseru (pretraga u zaglavlju, components/HeaderSearch.vue).

import type { CarSummary } from '~/types/car'
import { bodyTypeLabel, fuelLabel } from './carFormat'

/**
 * Tekst za poređenje: mala slova, bez kvačica i crtica.
 * Tako "skoda" pronalazi "Škoda", a "c3" pronalazi "C-3".
 */
export function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/đ/g, 'dj')
    .normalize('NFD') // "š" → "s" + kvačica…
    .replace(/[\u0300-\u036f]/g, '') // …pa kvačicu brišemo
    .replace(/[-_.]/g, '')
}

type SearchableCar = Pick<CarSummary, 'brand' | 'model' | 'generation' | 'engine' | 'fuel_type' | 'body_type'>

/**
 * Sav tekst o automobilu po kome se pretražuje, spojen i normalizovan, bez razmaka.
 * Razmake brišemo jer je isti model nekad upisan kao "C 3", a korisnik kuca "c3".
 * Primer: Citroen C 3, 1.6 BlueHDi, dizel, hečbek → "citroenc3mk316bluehdidizelhecbek"
 */
function searchableText(car: SearchableCar): string {
  const fields = [car.brand, car.model, car.generation, car.engine, fuelLabel(car.fuel_type), bodyTypeLabel(car.body_type)]
  return normalizeForSearch(fields.join(' ')).replace(/\s+/g, '')
}

/**
 * Da li automobil odgovara upitu: svaka reč iz upita mora da se nađe u tekstu o automobilu.
 * "golf tdi" pronalazi "Volkswagen Golf 7 1.6 TDI", a "dizel karavan" sve dizel karavane.
 */
export function carMatchesSearch(car: SearchableCar, query: string): boolean {
  const words = normalizeForSearch(query).split(/\s+/).filter((word) => word !== '')
  if (words.length === 0) return false

  const carText = searchableText(car)
  return words.every((word) => carText.includes(word))
}
