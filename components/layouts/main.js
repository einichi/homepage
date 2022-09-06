import Head from 'next/head'
import Navbar from '../navbar.js'
import { Box, Container } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import ModelLoader from '../model-loader'
import Footer from '../footer.js'

const LazyModel = dynamic(() => import('../3d-model'), {
  ssr: false,
  loading: () => <ModelLoader />
})

const Main = ({ children, router }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Ricky Burgin" />
        <title>Ricky Burgin - Homepage</title>
      </Head>

      <Navbar path={router.asPath} />

      <Container maxW="container.md" pt={14}>
        <LazyModel />
        {children}
      </Container>
      <Footer />
    </Box>
  )
}

export default Main
