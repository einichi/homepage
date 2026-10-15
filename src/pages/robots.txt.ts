import type { APIRoute } from 'astro'

export const GET: APIRoute = () =>
  new Response(
    import.meta.env.PUBLIC_SITE_MODE === 'production'
      ? 'User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://ricky.burg.in/sitemap.xml\n'
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'content-type': 'text/plain; charset=utf-8' } }
  )
