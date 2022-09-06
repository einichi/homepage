import NextLink from 'next/link'
import {
  Box,
  Heading,
  Text,
  Container,
  Button,
  ButtonGroup
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import { ArrowBackIcon, EmailIcon } from '@chakra-ui/icons'

const NotFound = () => {
  return (
    <Layout>
      <Container>
        <Heading as="h1">Page not found</Heading>

        <Text>The page you&apos;ve landed on was not found.</Text>
        <Text>
          If you think something should&apos;ve been here, please feel free to
          let me know.
        </Text>
        <Box my={6} align="center">
          <ButtonGroup gap="2">
            <NextLink href="/contact">
              <Button leftIcon={<EmailIcon />} colorScheme="teal">
                Let me know
              </Button>
            </NextLink>
            <NextLink href="/">
              <Button leftIcon={<ArrowBackIcon />} colorScheme="teal">
                Back to main
              </Button>
            </NextLink>
          </ButtonGroup>
        </Box>
      </Container>
    </Layout>
  )
}

export default NotFound
