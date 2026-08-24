export interface MockAnalysis {
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
  final_verdict: string
}

export function getMockAnalysis(): MockAnalysis {
  return {
    strengths: [
      { title: 'Pouzdan dizel motor', description: 'Motor 1.5 dCi je jedan od najizdržljivijih Renault-Nissan agregata, poznat po prelasku preko 300.000 km uz redovno održavanje.' },
      { title: 'Niska potrošnja goriva', description: 'Kombinovana potrošnja od oko 4.5 l/100km čini ga ekonomičnim izborom za dnevnu vožnju.' },
      { title: 'Prostran enterijer', description: 'Za klasu kompaktnih SUV vozila, nudi iznenađujuće prostoran prtljažnik i zadnja sedišta.' },
    ],
    weaknesses: [
      { title: 'EGR ventil', description: 'Poznat problem kod visokih kilometraža — začepljenje EGR ventila usled DPF filtera i kratkih vožnji.' },
      { title: 'Kvalitet plastike u enterijeru', description: 'Neki delovi enterijera deluju jeftinije u odnosu na konkurenciju iz VW grupe.' },
    ],
    reliability: {
      score: 7.9,
      engine_reliability: 8.5,
      transmission_reliability: 7.8,
      electronics_reliability: 7.2,
    },
    maintenance: {
      cost_level: 'medium',
      annual_estimate: '250–400 €',
      common_repairs: [
        { problem: 'Zamena EGR ventila', estimated_cost: '150–250 €' },
        { problem: 'DPF filter čišćenje', estimated_cost: '100–180 €' },
        { problem: 'Kvačilo (na višim kilometražama)', estimated_cost: '400–600 €' },
      ],
    },
    fuel_consumption: { city: '5.8 l/100km', highway: '4.2 l/100km', combined: '4.8 l/100km' },
    driving_experience: { comfort: 7.5, performance: 6.8, handling: 7.0, noise_level: 6.5 },
    buying_guide: {
      recommended_engines: ['1.5 dCi 115 KS', '1.3 TCe 140 KS'],
      engines_to_avoid: ['1.6 dCi (rane godine proizvodnje, pre 2017)'],
      inspection_points: [
        'Proveriti istoriju servisiranja EGR/DPF sistema',
        'Testirati rad kvačila pri kretanju uzbrdo',
        'Proveriti tragove korozije na donjem delu karoserije',
      ],
    },
    alternatives: [
      { model: 'Nissan Qashqai', reason: 'Isti motor i platforma, nešto veći prtljažnik' },
      { model: 'Peugeot 3008', reason: 'Kvalitetniji enterijer, slična pouzdanost' },
    ],
    final_verdict:
      'Renault Kadjar 1.5 dCi je razuman izbor za kupca kome je prioritet niska potrošnja i dokazan motor. EGR/DPF sistem zahteva pažnju na vozilima korišćenim pretežno u gradu — insistirati na servisnoj knjižici.',
  }
}