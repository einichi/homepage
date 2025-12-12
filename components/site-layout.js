'use client'

import { Box, Container } from '@chakra-ui/react'
import Navbar from './navbar'
import Footer from './footer'
import LazyModel from './lazy-model'
import PageTransition from './page-transition'
import { usePathname } from '../i18n/routing'

// SiteLayout handles Client-Side Chakra UI rendering to prevent hydration mismatches
// that occur when using Chakra components directly in the Server Component RootLayout.
const SiteLayout = ({ children }) => {
  const pathname = usePathname()

  return (
    <Box as="main" pb={8}>
      <Navbar path={pathname} />
      
      <Container maxW="container.md" pt={{ base: 12, md: 16 }}>
        <LazyModel />
        <PageTransition>{children}</PageTransition>
      </Container>
      <Footer />
    </Box>
  )
}

export default SiteLayout
