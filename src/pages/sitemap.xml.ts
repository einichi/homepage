import type { APIRoute } from 'astro'
export const GET: APIRoute = () => {
  const base = 'https://ricky.burg.in'
  const pages = ['', 'work/', 'contact/']
  const urls = pages.flatMap((page) =>
    ['en', 'ja'].map((locale) => {
      const alternates = ['en', 'ja', 'x-default']
        .map(
          (lang) =>
            `<xhtml:link rel="alternate" hreflang="${lang}" href="${base}/${lang === 'x-default' ? 'en' : lang}/${page}"/>`
        )
        .join('')
      return `<url><loc>${base}/${locale}/${page}</loc>${alternates}</url>`
    })
  )
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  )
}
