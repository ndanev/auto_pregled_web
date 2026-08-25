import type { CarSummary, CarDetail } from '~/types/car'

export function useCarsApi() {
  const { api } = useApi()

  function fetchCars(query?: string) {
    return api<{ data: CarSummary[] }>('/api/cars', {
      params: query ? { q: query } : {},
    })
  }

  function fetchCarBySlug(slug: string) {
    return api<{ data: CarDetail }>(`/api/cars/${slug}`)
  }

  return { fetchCars, fetchCarBySlug }
}