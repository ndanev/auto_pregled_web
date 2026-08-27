export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const [carsResponse, brandsResponse] = await Promise.all([
    $fetch<{ data: { slug: string }[] }>('/api/cars', { baseURL: config.public.apiBaseUrl }),
    $fetch<{ data: { slug: string }[] }>('/api/brands', { baseURL: config.public.apiBaseUrl }),
  ])

  const siteUrl = config.public.siteUrl || 'https://autopregled.rs'

  const staticUrls = [
    { loc: siteUrl, priority: '1.0' },
    { loc: `${siteUrl}/automobili`, priority: '0.8' },
    { loc: `${siteUrl}/marke`, priority: '0.7' },
    { loc: `${siteUrl}/uporedi`, priority: '0.6' },
  ]

  const carUrls = carsResponse.data.map((car) => ({
    loc: `${siteUrl}/automobili/${car.slug}`,
    priority: '0.9',
  }))

  const brandUrls = brandsResponse.data.map((brand) => ({
    loc: `${siteUrl}/marke/${brand.slug}`,
    priority: '0.6',
  }))

  const urls = [...staticUrls, ...carUrls, ...brandUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml')
  return xml
})