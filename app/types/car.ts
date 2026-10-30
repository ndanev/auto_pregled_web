// Tipovi odgovora backend API-ja (/api/cars). Imena polja prate API, zato su u snake_case.

/** Automobil u listi (kartice na početnoj, /automobili, /marke/[slug]). */
export interface CarSummary {
  id: number
  slug: string
  brand: string
  model: string
  generation: string
  years: string
  engine: string
  power_hp: number | null
  fuel_type: string // vrednost iz FUEL_TYPE_OPTIONS, npr. 'dizel'
  transmission: string // vrednost iz TRANSMISSION_OPTIONS, npr. 'dsg_cvt'
  body_type: string | null // vrednost iz BODY_TYPE_CATEGORIES, npr. 'hecbek'
  overall_rating: number | null // 0–10; null dok analiza nije gotova
  main_image_url: string | null
  main_thumbnail_url: string | null
  brand_logo_url: string | null
}

/**
 * AI analiza automobila.
 *
 * Pažnja: polja koja izgledaju kao brojevi (potrošnja, cene) su zapravo slobodan tekst
 * koji generiše AI — nekad "4.5–5.6 L/100km", nekad cela rečenica. Za prikaz koristi
 * extractFuel / extractCost iz utils/carFormat.ts, koji vraćaju null kad broja nema.
 */
export interface CarAnalysis {
  /** Sekcije za koje AI nije imao dovoljno podataka. Slobodan tekst, npr. "reliability" ili "Obrtni moment (Nm)…". */
  data_quality: { insufficient_sections: string[] }
  ai_summary: {
    short_description: string
    overall_rating: number
    market_position: string
    final_verdict: string
  }
  target_audience: { ideal_for: string[]; not_recommended_for: string[] }
  strengths: { title: string; description: string }[]
  weaknesses: { title: string; description: string }[]
  /** Ocene 0–10. */
  reliability: {
    score: number
    engine_reliability: number
    transmission_reliability: number
    electronics_reliability: number
  }
  maintenance: {
    cost_level: 'low' | 'medium' | 'high'
    annual_estimate: string // slobodan tekst
    common_repairs: { problem: string; estimated_cost: string }[] // estimated_cost je slobodan tekst
  }
  fuel_consumption: { city: string; highway: string; combined: string } // slobodan tekst
  /** Ocene 0–10. */
  driving_experience: { comfort: number; performance: number; handling: number; noise_level: number }
  buying_guide: { recommended_engines: string[]; engines_to_avoid: string[]; inspection_points: string[] }
  alternatives: { model: string; reason: string }[]
  seo: { title: string; description: string; keywords: string[] }
  faq: { question: string; answer: string }[]
  meta?: { generated_at: string }
}

export interface CarImage {
  url: string
  thumbnail_url: string
  is_main: boolean
}

/** Automobil na stranici detalja (/automobili/[slug]). */
export interface CarDetail extends Omit<CarSummary, 'main_image_url' | 'main_thumbnail_url'> {
  displacement_cc: number | null
  torque_nm: number | null
  drivetrain: string | null
  meta_title: string | null
  meta_description: string | null
  analysis: CarAnalysis | null // null dok analiza nije generisana
  images: CarImage[]
}
