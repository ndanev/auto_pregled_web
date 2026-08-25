import type { CarSummary, CarDetail } from '~/types/car'

export function useCarsApi() {
  const { api } = useApi()

  function fetchCars() {
    return api<{ data: CarSummary[] }>('/api/cars')
  }

  function fetchCarBySlug(slug: string) {
    return api<{ data: CarDetail }>(`/api/cars/${slug}`)
  }

  return { fetchCars, fetchCarBySlug }
}