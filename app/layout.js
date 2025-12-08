import { cookies } from 'next/headers'
import Chakra from '../components/chakra'
import { M_PLUS_Rounded_1c } from 'next/font/google'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { Box, Container, ColorModeScript } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import ModelLoader from '../components/model-loader'
import PageTransition from '../components/page-transition'
import config from '../libs/theme-config'
import LazyModel from '../components/lazy-model'

// Client-side only model loader needs to be handled carefully in App Router


const mplus = M_PLUS_Rounded_1c({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata = {
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
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff'
}

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const colorModeCookie = cookieStore.get('chakra-ui-color-mode')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={mplus.className} suppressHydrationWarning>
        <ColorModeScript initialColorMode={config.initialColorMode} />
        <Chakra cookies={colorModeCookie?.value}>
          <Box as="main" pb={8}>
            <Navbar path="" /> 
            {/* Note: Navbar uses path prop for highlighting active link. 
                In App Router, we should use usePathname hook inside Navbar. 
                But for now we'll update Navbar to use usePathname if path prop is missing.
            */}
            
            <Container maxW="container.md" pt={{ base: 12, md: 16 }}>
              <LazyModel />
              <PageTransition>{children}</PageTransition>
            </Container>
            <Footer />
          </Box>
        </Chakra>
      </body>
    </html>
  )
}
