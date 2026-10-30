/**
 * HTTP klijent za backend API. Adresa se podešava preko NUXT_PUBLIC_API_BASE_URL (vidi nuxt.config.ts).
 * Ne koristi se direktno iz stranica — umesto toga koristi useCarsApi / useBrandsApi.
 */
export function useApi() {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
  })

  return { api }
}