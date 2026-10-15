const SITE_URL = 'https://ricky.burg.in'

const ROUTES = ['', '/work', '/contact']

// Static routes only, so no `lastModified: new Date()` here — that would
// change the output on every build.
export default function sitemap() {
  return ROUTES.flatMap((route) => [
    {
      url: `${SITE_URL}/en${route}`,
      alternates: {
        languages: {
          en: `${SITE_URL}/en${route}`,
          ja: `${SITE_URL}/ja${route}`
        }
      }
    },
    {
      url: `${SITE_URL}/ja${route}`,
      alternates: {
        languages: {
          en: `${SITE_URL}/en${route}`,
          ja: `${SITE_URL}/ja${route}`
        }
      }
    }
  ])
}
