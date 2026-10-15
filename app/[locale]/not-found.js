'use client'

import { Link as NextLink } from '../../i18n/routing'
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
import { useTranslations } from 'next-intl'

const NotFound = () => {
  const t = useTranslations('NotFound')

  return (
    <Layout>
      <Container>
        <Heading as="h1">{t('title')}</Heading>

        <Text>{t('body')}</Text>
        <Text>{t('body_action')}</Text>
        <Box my={6} align="center">
          <ButtonGroup gap="2">
            <Button
              as={NextLink}
              href="/contact"
              leftIcon={<EmailIcon />}
              colorScheme="teal"
            >
              {t('contact_cta')}
            </Button>
            <Button
              as={NextLink}
              href="/"
              leftIcon={<ArrowBackIcon />}
              colorScheme="teal"
            >
              {t('back_cta')}
            </Button>
          </ButtonGroup>
        </Box>
      </Container>
    </Layout>
  )
}

export default NotFound
