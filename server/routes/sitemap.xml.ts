import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://ikikelam.org.tr').replace(/\/+$/, '')

  // 1. Static public routes
  const staticPages = [
    { loc: `${siteUrl}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${siteUrl}/hakkimizda`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${siteUrl}/activities`, changefreq: 'daily', priority: '0.9' },
    { loc: `${siteUrl}/gallery`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${siteUrl}/schedule`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${siteUrl}/contact`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${siteUrl}/donation`, changefreq: 'monthly', priority: '0.8' },
  ]

  // 2. Dynamic Categories
  let categoryPages: Array<{ loc: string; changefreq: string; priority: string; lastmod?: string }> = []
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })
    categoryPages = categories.map((cat) => ({
      loc: `${siteUrl}/activities/${cat.slug}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: cat.updatedAt.toISOString().split('T')[0],
    }))
  } catch (err) {
    console.error('[Sitemap Category Fetch Error]:', err)
  }

  // 3. Dynamic Published Posts
  let postPages: Array<{ loc: string; changefreq: string; priority: string; lastmod?: string }> = []
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      select: {
        slug: true,
        updatedAt: true,
        category: {
          select: { slug: true },
        },
      },
      orderBy: { publishedAt: 'desc' },
    })
    postPages = posts
      .filter((p) => p.category?.slug)
      .map((p) => ({
        loc: `${siteUrl}/activities/${p.category!.slug}/${p.slug}`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: p.updatedAt.toISOString().split('T')[0],
      }))
  } catch (err) {
    console.error('[Sitemap Post Fetch Error]:', err)
  }

  const allUrls = [...staticPages, ...categoryPages, ...postPages]

  const xmlEntries = allUrls
    .map((url) => {
      const lastmodTag = url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''
      return `  <url>
    <loc>${url.loc}</loc>${lastmodTag}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    })
    .join('\n')

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=14400')

  return sitemapXml
})
