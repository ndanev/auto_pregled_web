import type { CarSummary, CarDetail } from '~/types/car'

export function useCarsApi() {
  const { api } = useApi()

  function fetchCars(params?: { query?: string; brandSlug?: string; modelSlug?: string }) {
    return api<{ data: CarSummary[] }>('/api/cars', {
      params: {
        q: params?.query || undefined,
        brand_slug: params?.brandSlug || undefined,
        model_slug: params?.modelSlug || undefined,
      },
    })
  }

  function fetchCarBySlug(slug: string) {
    return api<{ data: CarDetail }>(`/api/cars/${slug}`)
  }

  return { fetchCars, fetchCarBySlug }
}