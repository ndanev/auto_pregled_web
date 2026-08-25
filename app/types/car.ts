export interface CarSummary {
  id: number
  slug: string
  brand: string
  model: string
  generation: string
  years: string
  engine: string
  power_hp: number | null
  fuel_type: string
  transmission: string
  body_type: string | null
  overall_rating: number | null
  main_image_url: string | null
  main_thumbnail_url: string | null
}

export interface CarAnalysis {
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
  reliability: {
    score: number
    engine_reliability: number
    transmission_reliability: number
    electronics_reliability: number
  }
  maintenance: {
    cost_level: 'low' | 'medium' | 'high'
    annual_estimate: string
    common_repairs: { problem: string; estimated_cost: string }[]
  }
  fuel_consumption: { city: string; highway: string; combined: string }
  driving_experience: { comfort: number; performance: number; handling: number; noise_level: number }
  buying_guide: { recommended_engines: string[]; engines_to_avoid: string[]; inspection_points: string[] }
  alternatives: { model: string; reason: string }[]
  seo: { title: string; description: string; keywords: string[] }
}

export interface CarDetail extends Omit<CarSummary, 'main_image_url' | 'main_thumbnail_url'> {
  displacement_cc: number | null
  torque_nm: number | null
  drivetrain: string | null
  meta_title: string | null
  meta_description: string | null
  analysis: CarAnalysis | null
  images: { url: string; thumbnail_url: string; is_main: boolean }[]
}