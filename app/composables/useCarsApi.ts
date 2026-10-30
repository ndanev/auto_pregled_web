import type { CarSummary, CarDetail } from '~/types/car'

export interface CarFilters {
  query?: string
  brandSlug?: string
  modelSlug?: string
  bodyType?: string
  fuelType?: string
  transmission?: string
}

/** Pozivi ka /api/cars. Koristi se zajedno sa useAsyncData u stranicama. */

export function useCarsApi() {
  const { api } = useApi()

  /** Lista automobila. Prazni filteri ('' ili undefined) se ne šalju API-ju. */
  function fetchCars(params?: CarFilters) {
    return api<{ data: CarSummary[] }>('/api/cars', {
      params: {
        q: params?.query || undefined,
        brand_slug: params?.brandSlug || undefined,
        model_slug: params?.modelSlug || undefined,
        body_type: params?.bodyType || undefined,
        fuel_type: params?.fuelType || undefined,
        transmission: params?.transmission || undefined,
      },
    })
  }

  /** Jedan automobil sa kompletnom AI analizom. API vraća 404 ako slug ne postoji. */
  function fetchCarBySlug(slug: string) {
    return api<{ data: CarDetail }>(`/api/cars/${slug}`)
  }

  return { fetchCars, fetchCarBySlug }
}