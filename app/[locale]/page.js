'use client'

import {
  Container,
  Button,
  Box,
  Heading,
  List,
  ListItem,
  ListIcon,
  Progress,
  Flex,
  Link,
  useColorModeValue
} from '@chakra-ui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import Section from '../../components/section'
import Paragraph from '../../components/paragraph'
import { ExperienceSection, ExperienceYears } from '../../components/experience'
import { SkillsSection, Skill } from '../../components/skills'
import { LanguagesSection, Language } from '../../components/languages'
import { TimeIcon } from '@chakra-ui/icons'
import { GoHeart } from 'react-icons/go'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiCube } from 'react-icons/hi'
import Layout from '../../components/layouts/article'
import { useTranslations } from 'next-intl'
import { EXPERIENCE, SKILLS, LANGUAGES, INTERESTS } from '../../lib/profile-data'

const Page = () => {
  const t = useTranslations('HomePage')
  const tProfile = useTranslations('Profile')
  return (
    <Layout>
      <Container>
        <Box
          borderRadius="lg"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
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
            <Link href="https://www.github.com/einichi" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<FaGithub />}
              >
                {t('links.github')}
              </Button>
            </Link>
            <Link
              href="https://www.printables.com/@einichi_862656/models"
              target="_blank"
            >
              <Button variant="ghost" colorScheme="teal" leftIcon={<HiCube />}>
                {t('links.designs')}
              </Button>
            </Link>
            <Link
              href="https://www.linkedin.com/in/rickyburgin/"
              target="_blank"
            >
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<FaLinkedin />}
              >
                {t('links.linkedin')}
              </Button>
            </Link>
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
          <Paragraph>
            {t('about.p1')}
          </Paragraph>
          <br />
          <Paragraph>
            {t('about.p2')}
          </Paragraph>
          <br />
          <Paragraph>
            {t('about.p3')}
          </Paragraph>
        </Section>

        <Section>
          <Heading as="h3" variant="section-title">
            {t('headers.experience')}
          </Heading>
          {EXPERIENCE.map((exp, index) => (
            <ExperienceSection key={index}>
              <ExperienceYears>{exp.years}</ExperienceYears>
              {tProfile(`Experience.${exp.titleKey}`)}
            </ExperienceSection>
          ))}
          <Box align="center" my={4}>
            <NextLink href="/work" passHref>
              <Button
                leftIcon={<TimeIcon />}
                colorScheme="teal"
                variant="outline"
              >
                {t('buttons.job_history')}
              </Button>
            </NextLink>
          </Box>
        </Section>
        <Section>
          <Heading as="h3" variant="section-title">
            {t('headers.technical_skills')}
          </Heading>
          <Heading as="h4" variant={'section-subtitle'}>
            {t('headers.infrastructure')}
          </Heading>
          {SKILLS.infrastructure.reduce((rows, key, index) => {
            if (index % 2 === 0) rows.push([])
            rows[rows.length - 1].push(key)
            return rows
          }, []).map((row, index) => (
            <Flex key={index}>
              {row.map((skill, i) => (
                <SkillsSection key={i} flex="1">
                  <Skill>{skill.name}</Skill>
                  <Progress value={skill.value} colorScheme="teal" />
                </SkillsSection>
              ))}
            </Flex>
          ))}
          
          <Heading as="h4" variant={'section-subtitle'}>
            {t('headers.programming')}
          </Heading>
          {SKILLS.programming.reduce((rows, key, index) => {
            if (index % 2 === 0) rows.push([])
            rows[rows.length - 1].push(key)
            return rows
          }, []).map((row, index) => (
            <Flex key={index}>
              {row.map((skill, i) => (
                <SkillsSection key={i} flex="1">
                  <Skill>{skill.name}</Skill>
                  <Progress value={skill.value} colorScheme="teal" />
                </SkillsSection>
              ))}
            </Flex>
          ))}
        </Section>
        <Section>
          <Heading as="h3" variant="section-title">
            {t('headers.languages')}
          </Heading>
          {LANGUAGES.map((lang, index) => (
            <LanguagesSection key={index}>
              <Language>{tProfile(`Levels.${lang.levelKey}`)}</Language>
              {tProfile(`Languages.${lang.nameKey}`)}
            </LanguagesSection>
          ))}
        </Section>
        <Section>
          <Heading as="h3" variant="section-title">
            {t('headers.interests')}
          </Heading>
          <List spacing={1}>
            {INTERESTS.map((interest, index) => (
              <ListItem key={index}>
                <ListIcon as={GoHeart} color={interest.color} />
                {tProfile(`Interests.${interest.nameKey}`)}
              </ListItem>
            ))}
          </List>
        </Section>
      </Container>
    </Layout>
  )
}

export default Page
