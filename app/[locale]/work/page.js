import { Container, Box, Heading, Flex, Spacer } from '@chakra-ui/react'
import { getTranslations } from 'next-intl/server'
import { InternalIconButton } from '../../../components/icon-actions'

const SITE_URL = 'https://ricky.burg.in'

export async function generateMetadata({ params }, parent) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  const canonical = `/${locale}/work`
  const title = t('work_title')
  const description = t('work_description')
  const { openGraph } = await parent

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: '/en/work',
        ja: '/ja/work',
        'x-default': '/en/work'
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

const jobs = [
  'marigold_sre',
  'cheetah_security',
  'cheetah_it',
  'cheetah_devops',
  'experian_uk',
  'appliansys',
  'exoware'
]

const HireMeButton = ({ children }) => (
  <Box align="center" my={4}>
    <InternalIconButton href="/contact?hireme" icon="chat">
      {children}
    </InternalIconButton>
  </Box>
)

export default async function Page({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Work' })

  return (
    <Box as="article" position="relative">
      <Container>
        <Box as="section" mb={6}>
          <Heading as="h3" variant="section-title">
            {t('title')}
          </Heading>

          <HireMeButton>{t('hire_me')}</HireMeButton>

          {jobs.map((jobKey) => (
            <Box key={jobKey} pl="3.4em" mt="2em">
              <Flex>
                <Heading as="h4" fontWeight="bold" fontSize="18px">
                  {t(`jobs.${jobKey}.title`)}
                </Heading>
                <Spacer />
                <Box
                  as="span"
                  fontWeight="bold"
                  fontSize="14px"
                  mr="1em"
                  display="inline-block"
                >
                  {t(`jobs.${jobKey}.company`)}
                </Box>
              </Flex>
              <Box as="span" fontStyle="italic" mr="1em" display="inline-block">
                {t(`jobs.${jobKey}.date`)}
              </Box>
              <Box as="p" mt="1em" mb="1em">
                {t(`jobs.${jobKey}.details`)}
              </Box>
            </Box>
          ))}

          <HireMeButton>{t('hire_me')}</HireMeButton>
        </Box>
      </Container>
    </Box>
  )
}
