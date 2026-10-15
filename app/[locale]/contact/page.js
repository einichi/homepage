import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import Contact from './client-page'

const SITE_URL = 'https://ricky.burg.in'

export async function generateMetadata({ params }, parent) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  const canonical = `/${locale}/contact`
  const title = t('contact_title')
  const description = t('contact_description')
  const { openGraph } = await parent

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: '/en/contact',
        ja: '/ja/contact',
        'x-default': '/en/contact'
      }
    },
    openGraph: {
      ...openGraph,
      type: 'website',
      title,
      description,
      url: canonical
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/ricky/ricky.jpg`]
    }
  }
}

// client-page.js reads useSearchParams(); without a Suspense boundary the
// whole route opts out of static rendering.
export default function Page() {
  return (
    <Suspense>
      <Contact />
    </Suspense>
  )
}
