export interface MockCar {
  slug: string
  brand: string
  model: string
  generation: string
  years: string
  engine: string
  power: number
  fuelType: string
  transmission: string
  bodyType: string
  rating: number
  shortDescription: string
}

export function getMockCars(): MockCar[] {
  return [
    {
      slug: 'renault-kadjar-i-1-5-dci-manuelni',
      brand: 'Renault',
      model: 'Kadjar',
      generation: 'I generacija (facelift)',
      years: '2015–2022',
      engine: '1.5 dCi',
      power: 115,
      fuelType: 'Dizel',
      transmission: 'Manuelni',
      bodyType: 'Kompaktni SUV',
      rating: 7.8,
      shortDescription:
        'Kompaktni SUV sa dokazanim dizel motorom i niskim troškovima održavanja — solidan izbor za porodičnu svakodnevicu.',
    },
    {
      slug: 'volkswagen-golf-mk7-2-0-tdi-manuelni',
      brand: 'Volkswagen',
      model: 'Golf',
      generation: 'MK7',
      years: '2012–2020',
      engine: '2.0 TDI',
      power: 150,
      fuelType: 'Dizel',
      transmission: 'Manuelni',
      bodyType: 'Hečbek',
      rating: 8.7,
      shortDescription:
        'Jedan od najpouzdanijih hečbekova u klasi — snažan i ekonomičan dizel uz proveren kvalitet izrade.',
    },
    {
      slug: 'skoda-octavia-iii-1-6-tdi-dsg',
      brand: 'Škoda',
      model: 'Octavia',
      generation: 'III generacija',
      years: '2013–2020',
      engine: '1.6 TDI',
      power: 115,
      fuelType: 'Dizel',
      transmission: 'DSG',
      bodyType: 'Limuzina',
      rating: 8.2,
      shortDescription:
        'Prostrana limuzina sa odličnim odnosom cene i kvaliteta — omiljena među taksistima zbog izdržljivosti.',
    },
  ]
}