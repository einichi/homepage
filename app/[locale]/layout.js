import { cookies } from 'next/headers'
import Chakra from '../../components/chakra'
import { M_PLUS_Rounded_1c } from 'next/font/google'
import { ColorModeScript } from '@chakra-ui/react'
import config from '../../libs/theme-config'
import SiteLayout from '../../components/site-layout'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Client-side only model loader needs to be handled carefully in App Router


const mplus = M_PLUS_Rounded_1c({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata = {
  metadataBase: new URL('https://ricky.burg.in'),
  title: 'Ricky Burgin バーギン　リッキー | Homepage',
  description: "Ricky's homepage",
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
    canonical: './',
    languages: {
      en: '/en',
      ja: '/ja'
    }
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff'
}

export default async function RootLayout({ children, params }) {
  const {locale} = await params;
  
  if (!['en', 'ja'].includes(locale)) {
    notFound();
  }

  // Provide messages to the client-side via NextIntlClientProvider
  const messages = await getMessages();
  const cookieStore = await cookies()
  const colorMode = cookieStore.get('chakra-ui-color-mode')?.value
  // cookieStorageManagerSSR expects a cookie string, not just the value
  const cookieString = colorMode ? `chakra-ui-color-mode=${colorMode}` : ''

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={mplus.className} suppressHydrationWarning>
        <ColorModeScript initialColorMode={config.initialColorMode} />
        <NextIntlClientProvider messages={messages}>
          <Chakra cookies={cookieString}>
            <SiteLayout>{children}</SiteLayout>
          </Chakra>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
