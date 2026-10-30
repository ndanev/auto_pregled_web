import type { BrandSummary, BrandDetail } from '~/types/brand'

/** Pozivi ka /api/brands. */
export function useBrandsApi() {
  const { api } = useApi()

  function fetchBrands() {
    return api<{ data: BrandSummary[] }>('/api/brands')
  }

  function fetchBrandBySlug(slug: string) {
    return api<{ data: BrandDetail }>(`/api/brands/${slug}`)
  }

  return { fetchBrands, fetchBrandBySlug }
}