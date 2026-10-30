import type { CarDetail } from '~/types/car'

/**
 * SEO za stranicu automobila: meta tagovi za pretraživače/društvene mreže
 * i strukturirani podaci (JSON-LD) koje Google koristi za bogatije rezultate pretrage.
 */
export function useCarSeo(car: Ref<CarDetail>) {
  const name = computed(() => `${car.value.brand} ${car.value.model}`)
  const description = computed(() => car.value.meta_description || car.value.analysis?.ai_summary.short_description)
  const image = computed(() => car.value.images[0]?.url)

  useSeoMeta({
    title: () => car.value.meta_title || `${name.value} — AI Pregled`,
    description,
    ogTitle: () => car.value.meta_title || name.value,
    ogDescription: description,
    ogImage: image,
    ogType: 'website',
    twitterCard: 'summary_large_image',
  })

  // https://schema.org/Vehicle
  const vehicleSchema = computed(() =>
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Vehicle',
      name: `${name.value} ${car.value.generation}`,
      brand: { '@type': 'Brand', name: car.value.brand },
      model: car.value.model,
      vehicleEngine: {
        '@type': 'EngineSpecification',
        name: car.value.engine,
        fuelType: car.value.fuel_type,
      },
      vehicleTransmission: car.value.transmission,
      ...(image.value && { image: image.value }),
    })
  )

  // https://schema.org/FAQPage — prazan string znači da se tag ne prikazuje
  const faqSchema = computed(() => {
    const faq = car.value.analysis?.faq
    if (!faq?.length) return ''
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  })

  useHead({
    script: [
      { type: 'application/ld+json', innerHTML: vehicleSchema },
      { type: 'application/ld+json', innerHTML: faqSchema },
    ],
  })
}
