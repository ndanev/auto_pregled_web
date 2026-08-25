export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const response = await $fetch<{ data: { slug: string }[] }>('/api/cars', {
    baseURL: config.public.apiBaseUrl,
  })

  const siteUrl = config.public.siteUrl || 'https://autopregled.rs'

  const staticUrls = [
    { loc: siteUrl, priority: '1.0' },
    { loc: `${siteUrl}/cars`, priority: '0.8' },
  ]

  const carUrls = response.data.map((car) => ({
    loc: `${siteUrl}/cars/${car.slug}`,
    priority: '0.9',
  }))

  const urls = [...staticUrls, ...carUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}
    </urlset>`

  setHeader(event, 'content-type', 'application/xml')
  return xml
})