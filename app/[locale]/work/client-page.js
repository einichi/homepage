'use client'

import { Container, Button, Box, Heading, Flex, Spacer } from '@chakra-ui/react'
import NextLink from 'next/link'
import {
  WorkSection,
  WorkCompany,
  WorkTitle,
  WorkDate,
  WorkDetails
} from '../../../components/work'
import Section from '../../../components/section'
import { ChatIcon } from '@chakra-ui/icons'
import Layout from '../../../components/layouts/article'
import { useTranslations } from 'next-intl'

const Work = () => {
  const t = useTranslations('Work')
  
  const jobs = [
    'marigold_sre',
    'cheetah_security',
    'cheetah_it',
    'cheetah_devops',
    'experian_uk',
    'appliansys',
    'exoware'
  ]

  return (
    <Layout>
      <Container>
        <Section>
          <Heading as="h3" variant="section-title">
            {t('title')}
          </Heading>

          <Box align="center" my={4}>
            <Button
              as={NextLink}
              href="/contact?hireme"
              leftIcon={<ChatIcon />}
              colorScheme="teal"
              variant="outline"
            >
              {t('hire_me')}
            </Button>
          </Box>

          {jobs.map((jobKey) => (
            <WorkSection key={jobKey}>
              <Flex>
                <WorkTitle>{t(`jobs.${jobKey}.title`)}</WorkTitle>
                <Spacer />
                <WorkCompany>{t(`jobs.${jobKey}.company`)}</WorkCompany>
              </Flex>
              <WorkDate>{t(`jobs.${jobKey}.date`)}</WorkDate>
              <WorkDetails>
                {t(`jobs.${jobKey}.details`)}
              </WorkDetails>
            </WorkSection>
          ))}

          <Box align="center" my={4}>
            <Button
              as={NextLink}
              href="/contact?hireme"
              leftIcon={<ChatIcon />}
              colorScheme="teal"
              variant="outline"
            >
              {t('hire_me')}
            </Button>
          </Box>
        </Section>
      </Container>
    </Layout>
  )
}

export default Work
