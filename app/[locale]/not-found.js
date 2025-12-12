'use client'

import NextLink from 'next/link'
import {
  Box,
  Heading,
  Text,
  Container,
  Button,
  ButtonGroup
} from '@chakra-ui/react'
import { ArrowBackIcon, EmailIcon } from '@chakra-ui/icons'
// Layout article isn't strictly needed for 404 but provides consistent spacing/animation
import Layout from '../../components/layouts/article' 

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
            <Button
              as={NextLink}
              href="/contact"
              leftIcon={<EmailIcon />}
              colorScheme="teal"
            >
              Let me know
            </Button>
            <Button
              as={NextLink}
              href="/"
              leftIcon={<ArrowBackIcon />}
              colorScheme="teal"
            >
              Back to main
            </Button>
          </ButtonGroup>
        </Box>
      </Container>
    </Layout>
  )
}

export default NotFound
