export interface BrandSummary {
  name: string
  slug: string
  logo_url: string | null
  cars_count: number
}

export interface BrandModel {
  name: string
  slug: string
  cars_count: number
}

export interface BrandDetail {
  name: string
  slug: string
  logo_url: string | null
  models: BrandModel[]
}