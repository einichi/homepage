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
import Section from '../components/section'
import Paragraph from '../components/paragraph'
import { ExperienceSection, ExperienceYears } from '../components/experience'
import { SkillsSection, Skill } from '../components/skills'
import { LanguagesSection, Language } from '../components/languages'
import { TimeIcon } from '@chakra-ui/icons'
import { GoHeart } from 'react-icons/go'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiCube } from 'react-icons/hi'
import Layout from '../components/layouts/article'
import { EXPERIENCE, SKILLS, LANGUAGES, INTERESTS } from '../lib/profile-data'

const Page = () => {
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
          Hi there! I&apos;m an SRE Manager based in Japan.
        </Box>

        <Box display={{ md: 'flex' }}>
          <Box flexGrow={1}>
            <Heading as="h2" variant="page-title">
              Ricky Burgin
            </Heading>
            <p>SRE Manager 🇬🇧→🇯🇵</p>
            <Link href="https://www.github.com/einichi" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<FaGithub />}
              >
                GitHub
              </Button>
            </Link>
            <Link
              href="https://www.printables.com/@einichi_862656/models"
              target="_blank"
            >
              <Button variant="ghost" colorScheme="teal" leftIcon={<HiCube />}>
                3D Designs
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
                LinkedIn
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
            About Ricky
          </Heading>
          <Paragraph>SRE Manager, Leader and Engineer.</Paragraph>
          <br />
          <Paragraph>
            With a robust background in IT Infrastructure and DevOps,
            complemented by leadership and team management experience, as well
            as significant exposure to security and corporate IT, I bring a
            broad range of expertise to cross-functional organizations. My
            holistic approach brings about an environment where teams are
            empowered to excel, operational efficiency is driven, and creates a
            culture of self-improvement and collaboration. My strong passion for
            team mentoring, combined with a proven track record in ensuring
            employee satisfaction, significantly contributes to the retention of
            high-performing team members.
          </Paragraph>
          <br />
          <Paragraph>
            Drawing on my experience as an accomplished engineer I am not only
            able to bridge the gap between technical and management roles, but
            can also drive smart solutions and inspire the trust and confidence
            of my team. My background allows me and my teams to approach
            problems with a solution-oriented mindset, fostering an environment
            of technical excellence, innovation, and continuous improvement.
          </Paragraph>
          <br />
          <Paragraph>
            Japanese Language JLPT N1 certified 日本語能力試験N1認定者
          </Paragraph>
        </Section>

        <Section>
          <Heading as="h3" variant="section-title">
            Experience
          </Heading>
          {EXPERIENCE.map((exp, index) => (
            <ExperienceSection key={index}>
              <ExperienceYears>{exp.years}</ExperienceYears>
              {exp.title}
            </ExperienceSection>
          ))}
          <Box align="center" my={4}>
            <NextLink href="/work" passHref>
              <Button
                leftIcon={<TimeIcon />}
                colorScheme="teal"
                variant="outline"
              >
                Job history
              </Button>
            </NextLink>
          </Box>
        </Section>
        <Section>
          <Heading as="h3" variant="section-title">
            Technical Skills
          </Heading>
          <Heading as="h4" variant={'section-subtitle'}>
            Infrastructure
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
            Programming
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
            Languages
          </Heading>
          {LANGUAGES.map((lang, index) => (
            <LanguagesSection key={index}>
              <Language>{lang.level}</Language>
              {lang.name}
            </LanguagesSection>
          ))}
        </Section>
        <Section>
          <Heading as="h3" variant="section-title">
            Other Things I Love
          </Heading>
          <List spacing={1}>
            {INTERESTS.map((interest, index) => (
              <ListItem key={index}>
                <ListIcon as={GoHeart} color={interest.color} />
                {interest.name}
              </ListItem>
            ))}
          </List>
        </Section>
      </Container>
    </Layout>
  )
}

export default Page
