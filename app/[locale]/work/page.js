import { Container, Button, Box, Heading, Flex, Spacer } from '@chakra-ui/react'
import { Link as NextLink } from '../../../i18n/routing'
import { getTranslations } from 'next-intl/server'

export const metadata = {
  title: 'Work - Ricky Burgin'
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
    <NextLink href="/contact?hireme" passHref>
      <Button colorScheme="teal" variant="outline">
        {children}
      </Button>
    </NextLink>
  </Box>
)

export default async function Page() {
  const t = await getTranslations('Work')

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
