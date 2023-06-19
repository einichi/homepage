import {
  Container,
  Button,
  Box,
  Heading,
  Img,
  List,
  ListItem,
  ListIcon,
  Progress,
  Flex,
  Link,
  useColorModeValue
} from '@chakra-ui/react'
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
            <picture>
              <source srcSet="/images/ricky/ricky.avif" type="image/avif" />
              <source srcSet="/images/ricky/ricky.webp" type="image/webp" />
              <Img
                borderColor="whiteAlpha.800"
                borderWidth={2}
                borderStyle="solid"
                maxWidth="100px"
                maxHeight="100px"
                display="inline-block"
                borderRadius="full"
                src="/images/ricky/ricky.jpg"
                alt="Ricky Burgin"
              />
            </picture>
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
            can also drive innovative solutions and inspire the trust and
            confidence of my team. My background allows me and my teams to
            approach problems with a solution-oriented mindset, fostering an
            environment of technical excellence, innovation, and continuous
            improvement.
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
          <ExperienceSection>
            <ExperienceYears>11 years</ExperienceYears>
            DevOps / Infra Engineering
          </ExperienceSection>
          <ExperienceSection>
            <ExperienceYears>7 years</ExperienceYears>
            Business Management (UK)
          </ExperienceSection>
          <ExperienceSection>
            <ExperienceYears>3 years</ExperienceYears>
            Security Engineering
          </ExperienceSection>
          <ExperienceSection>
            <ExperienceYears>2 years</ExperienceYears>
            Corporate IT
          </ExperienceSection>
          <Box align="center" my={4}>
            <NextLink href="/work">
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
          <Flex>
            <SkillsSection flex="1">
              <Skill>Linux</Skill>
              <Progress value={100} colorScheme="teal" />
            </SkillsSection>
            <SkillsSection flex="1">
              <Skill>Networking</Skill>
              <Progress value={90} colorScheme="teal" />
            </SkillsSection>
          </Flex>
          <Flex>
            <SkillsSection flex="1">
              <Skill>Email (Postfix, DKIM/DMARC)</Skill>
              <Progress value={90} colorScheme="teal" />
            </SkillsSection>
            <SkillsSection flex="1">
              <Skill>PKI (x509, PGP etc)</Skill>
              <Progress value={90} colorScheme="teal" />
            </SkillsSection>
          </Flex>
          <Flex>
            <SkillsSection flex="1">
              <Skill>Webservers (Apache, Nginx)</Skill>
              <Progress value={90} colorScheme="teal" />
            </SkillsSection>
            <SkillsSection flex="1">
              <Skill>AWS</Skill>
              <Progress value={80} colorScheme="teal" />
            </SkillsSection>
          </Flex>
          <Flex>
            <SkillsSection flex="1">
              <Skill>CI/CD (Jenkins, Concourse)</Skill>
              <Progress value={80} colorScheme="teal" />
            </SkillsSection>
            <SkillsSection flex="1">
              <Skill>KVM/Xen Virtualization</Skill>
              <Progress value={80} colorScheme="teal" />
            </SkillsSection>
          </Flex>
          <Flex>
            <SkillsSection flex="1">
              <Skill>Storage (ZFS, iSCSI etc)</Skill>
              <Progress value={80} colorScheme="teal" />
            </SkillsSection>
            <SkillsSection flex="1">
              <Skill>Infra-as-Code (Terraform etc)</Skill>
              <Progress value={75} colorScheme="teal" />
            </SkillsSection>
          </Flex>
          <Flex>
            <SkillsSection flex="1">
              <Skill>Docker</Skill>
              <Progress value={70} colorScheme="teal" />
            </SkillsSection>
            <SkillsSection flex="1">
              <Skill>Databases (RDBMS, NoSQL)</Skill>
              <Progress value={70} colorScheme="teal" />
            </SkillsSection>
          </Flex>
          <Heading as="h4" variant={'section-subtitle'}>
            Programming
          </Heading>
          <Flex>
            <SkillsSection flex="1">
              <Skill>Python</Skill>
              <Progress value={80} colorScheme="teal" />
            </SkillsSection>
            <SkillsSection flex="1">
              <Skill>Go</Skill>
              <Progress value={60} colorScheme="teal" />
            </SkillsSection>
          </Flex>
          <Flex>
            <SkillsSection flex="1">
              <Skill>Bash</Skill>
              <Progress value={70} colorScheme="teal" />
            </SkillsSection>
            <SkillsSection flex="1">
              <Skill>Javascript (Node/Next/React)</Skill>
              <Progress value={70} colorScheme="teal" />
            </SkillsSection>
          </Flex>
          <Flex>
            <SkillsSection flex="1">
              <Skill>Powershell</Skill>
              <Progress value={60} colorScheme="teal" />
            </SkillsSection>
            <SkillsSection flex="1">
              <Skill>HTML/CSS</Skill>
              <Progress value={60} colorScheme="teal" />
            </SkillsSection>
          </Flex>
        </Section>
        <Section>
          <Heading as="h3" variant="section-title">
            Languages
          </Heading>
          <LanguagesSection>
            <Language>Native</Language>
            English
          </LanguagesSection>
          <LanguagesSection>
            <Language>Fluent</Language>
            Japanese
          </LanguagesSection>
        </Section>
        <Section>
          <Heading as="h3" variant="section-title">
            Other Things I Love
          </Heading>
          <List spacing={1}>
            <ListItem>
              <ListIcon as={GoHeart} color="red" />
              Machine Learning 🤖
            </ListItem>
            <ListItem>
              <ListIcon as={GoHeart} color="red" />
              3D Design / Printing 🖨️
            </ListItem>
            <ListItem>
              <ListIcon as={GoHeart} color="red" />
              Open Source 🌐
            </ListItem>
            <ListItem>
              <ListIcon as={GoHeart} color="red" />
              Languages (Casually learning Korean🇰🇷 and Mandarin Chinese🇨🇳)
            </ListItem>
            <ListItem>
              <ListIcon as={GoHeart} color="red" />
              Games 🎮
            </ListItem>
            <ListItem>
              <ListIcon as={GoHeart} color="red" />
              Travel ✈️
            </ListItem>
            <Box>
              <ListItem>
                <ListIcon as={GoHeart} color="red" />
                {/* TODO: Add easy preview photo of Jumbo here */}
                Geckos 🦎
              </ListItem>
            </Box>
          </List>
        </Section>
      </Container>
    </Layout>
  )
}

export default Page
export { getServerSideProps } from '../components/chakra'
