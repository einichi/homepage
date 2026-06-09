import {
  Container,
  Box,
  Heading,
  List,
  ListItem,
  Progress,
  Flex,
  Text
} from '@chakra-ui/react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import {
  EXPERIENCE,
  SKILLS,
  LANGUAGES,
  INTERESTS
} from '../../lib/profile-data'
import {
  ExternalIconButton,
  HeartListIcon,
  InternalIconButton
} from '../../components/icon-actions'

const chunkPairs = (items) =>
  items.reduce((rows, item, index) => {
    if (index % 2 === 0) rows.push([])
    rows[rows.length - 1].push(item)
    return rows
  }, [])

const Section = ({ children }) => (
  <Box as="section" mb={6}>
    {children}
  </Box>
)

const Paragraph = ({ children }) => (
  <Text as="p" textAlign="justify">
    {children}
  </Text>
)

const ProfileLine = ({ label, children }) => (
  <Box pl="3.4em" textIndent="-1.5em" textAlign="justify">
    <Box as="span" fontWeight="bold" mr="1em" display="inline-block">
      {label}
    </Box>
    {children}
  </Box>
)

const SkillLine = ({ name, value }) => (
  <Box flex="1" pl="3.4em" textIndent="-1.5em">
    <Box as="span" mr="1em" display="inline-block">
      {name}
    </Box>
    <Progress value={value} colorScheme="teal" />
  </Box>
)

const Page = async () => {
  const t = await getTranslations('HomePage')
  const tProfile = await getTranslations('Profile')

  return (
    <Box as="article" position="relative">
      <Container>
        <Box
          borderRadius="lg"
          bg="heroBg"
          p={3}
          mb={6}
          align="center"
        >
          {t('hero_text')}
        </Box>

        <Box display={{ md: 'flex' }}>
          <Box flexGrow={1}>
            <Heading as="h2" variant="page-title">
              {t('title')}
            </Heading>
            <p>{t('role')}</p>
            <ExternalIconButton
              href="https://www.github.com/einichi"
              icon="github"
            >
              {t('links.github')}
            </ExternalIconButton>
            <ExternalIconButton
              href="https://www.printables.com/@einichi_862656/models"
              icon="designs"
            >
              {t('links.designs')}
            </ExternalIconButton>
            <ExternalIconButton
              href="https://www.linkedin.com/in/rickyburgin/"
              icon="linkedin"
            >
              {t('links.linkedin')}
            </ExternalIconButton>
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            ml={{ md: 6 }}
            align="center"
          >
            <Box
              borderColor="whiteAlpha.800"
              borderWidth={2}
              borderStyle="solid"
              w="100px"
              h="100px"
              display="inline-block"
              borderRadius="full"
              overflow="hidden"
            >
              <Image
                src="/images/ricky/ricky.jpg"
                alt="Ricky Burgin"
                width="100"
                height="100"
                priority
              />
            </Box>
          </Box>
        </Box>
        <Section>
          <Heading as="h3" variant="section-title">
            {t('about.title')}
          </Heading>
          <Paragraph>{t('about.intro')}</Paragraph>
          <br />
          <Paragraph>{t('about.p1')}</Paragraph>
          <br />
          <Paragraph>{t('about.p2')}</Paragraph>
          <br />
          <Paragraph>{t('about.p3')}</Paragraph>
        </Section>

        <Section>
          <Heading as="h3" variant="section-title">
            {t('headers.experience')}
          </Heading>
          {EXPERIENCE.map((exp, index) => (
            <ProfileLine key={index} label={exp.years}>
              {tProfile(`Experience.${exp.titleKey}`)}
            </ProfileLine>
          ))}
          <Box align="center" my={4}>
            <InternalIconButton href="/work" icon="time">
              {t('buttons.job_history')}
            </InternalIconButton>
          </Box>
        </Section>
        <Section>
          <Heading as="h3" variant="section-title">
            {t('headers.technical_skills')}
          </Heading>
          <Heading as="h4" variant={'section-subtitle'}>
            {t('headers.infrastructure')}
          </Heading>
          {chunkPairs(SKILLS.infrastructure).map((row, index) => (
            <Flex key={index}>
              {row.map((skill) => (
                <SkillLine key={skill.name} name={skill.name} value={skill.value} />
              ))}
            </Flex>
          ))}

          <Heading as="h4" variant={'section-subtitle'}>
            {t('headers.programming')}
          </Heading>
          {chunkPairs(SKILLS.programming).map((row, index) => (
            <Flex key={index}>
              {row.map((skill) => (
                <SkillLine key={skill.name} name={skill.name} value={skill.value} />
              ))}
            </Flex>
          ))}
        </Section>
        <Section>
          <Heading as="h3" variant="section-title">
            {t('headers.languages')}
          </Heading>
          {LANGUAGES.map((lang, index) => (
            <ProfileLine
              key={index}
              label={tProfile(`Levels.${lang.levelKey}`)}
            >
              {tProfile(`Languages.${lang.nameKey}`)}
            </ProfileLine>
          ))}
        </Section>
        <Section>
          <Heading as="h3" variant="section-title">
            {t('headers.interests')}
          </Heading>
          <List spacing={1}>
            {INTERESTS.map((interest, index) => (
              <ListItem key={index}>
                <HeartListIcon color={interest.color} />
                {tProfile(`Interests.${interest.nameKey}`)}
              </ListItem>
            ))}
          </List>
        </Section>
      </Container>
    </Box>
  )
}

export default Page
