import type { CarSummary, CarDetail } from '~/types/car'

export function useCarsApi() {
  const { api } = useApi()

  function fetchCars(params?: {
    query?: string
    brandSlug?: string
    modelSlug?: string
    bodyType?: string
    fuelType?: string
    transmission?: string
  }) {
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

  function fetchCarBySlug(slug: string) {
    return api<{ data: CarDetail }>(`/api/cars/${slug}`)
  }

  return { fetchCars, fetchCarBySlug }
}