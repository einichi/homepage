import Chakra from '../../components/chakra'
import { M_PLUS_Rounded_1c } from 'next/font/google'
import { ColorModeScript } from '@chakra-ui/react'
import config from '../../libs/theme-config'
import SiteLayout from '../../components/site-layout'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Client-side only model loader needs to be handled carefully in App Router


// Exposed as a CSS variable because libs/theme.js sets `fonts.heading` to
// var(--font-mplus). preload: false — the preloads were ~1.5 MB of font data
// blocking first paint on a page that never renders a heading above the fold.
const mplus = M_PLUS_Rounded_1c({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mplus',
  preload: false
})

const SITE_URL = 'https://ricky.burg.in'
const OG_IMAGE = '/images/ricky/ricky.jpg'
const OG_LOCALES = { en: 'en_US', ja: 'ja_JP' }

const hreflang = (path) => ({
  en: `/en${path}`,
  ja: `/ja${path}`,
  'x-default': `/en${path}`
})

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  const canonical = `/${locale}`
  const description = t('description')
  const title = t('title')

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    authors: [{ name: 'Ricky Burgin' }],
    icons: {
      icon: [
        { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
      ],
      shortcut: '/favicon/favicon.ico',
      apple: '/favicon/apple-touch-icon.png',
      other: [
        { rel: 'mask-icon', url: '/favicon/safari-pinned-tab.svg', color: '#5bbad5' },
        { rel: 'manifest', url: '/favicon/site.webmanifest' }
      ]
    },
    alternates: {
      canonical,
      languages: hreflang('')
    },
    openGraph: {
      type: 'website',
      siteName: t('site_name'),
      title,
      description,
      url: canonical,
      locale: OG_LOCALES[locale] ?? OG_LOCALES.en,
      images: [{ url: OG_IMAGE, alt: title }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE]
    }
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff'
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ja' }]
}

export default async function RootLayout({ children, params }) {
  const {locale} = await params;

  if (!['en', 'ja'].includes(locale)) {
    notFound();
  }

  // Opt into static rendering: without this the locale-less server APIs fall
  // back to reading headers and silently keep every route dynamic.
  setRequestLocale(locale)

  // Provide messages to the client-side via NextIntlClientProvider
  const messages = await getMessages({locale})

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${mplus.className} ${mplus.variable}`} suppressHydrationWarning>
        <ColorModeScript initialColorMode={config.initialColorMode} />
        <NextIntlClientProvider messages={messages}>
          <Chakra>
            <SiteLayout>{children}</SiteLayout>
          </Chakra>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
