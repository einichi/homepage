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
          <Paragraph>
            Veteran in Infrastructure and Networking. Experienced in Security
            Engineering, DevOps/DevSecOps, minor Development, Team Management
            and Business Management.
          </Paragraph>
          <br />
          <Paragraph>
            Difficult technical challenges are what get me out of bed in the
            morning. I love working through stack traces, network packet dumps
            and tracing through code execution like your average puzzle addict
            loves solving crosswords. I also love to improve things, especially
            with automation and simplification of processes. Always interested
            in new ways of solving problems.
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
            Infra Engineering (incl. DevOps)
          </ExperienceSection>
          <ExperienceSection>
            <ExperienceYears>7 years</ExperienceYears>
            Business Management (UK)
          </ExperienceSection>
          <ExperienceSection>
            <ExperienceYears>3 years</ExperienceYears>
            Security Engineering
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
            Skills
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
              <Skill>VoIP (SIP/RSTP/IAX, PBXs)</Skill>
              <Progress value={80} colorScheme="teal" />
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
          </Flex>
          <Flex>
            <SkillsSection flex="1">
              <Skill>Javascript (Node/Next/React)</Skill>
              <Progress value={70} colorScheme="teal" />
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
              Machine Learning
            </ListItem>
            <ListItem>
              <ListIcon as={GoHeart} color="red" />
              3D Design / Printing
            </ListItem>
            <ListItem>
              <ListIcon as={GoHeart} color="red" />
              Open Source
            </ListItem>
            <ListItem>
              <ListIcon as={GoHeart} color="red" />
              Languages (Korean, Mandarin)
            </ListItem>
            <ListItem>
              <ListIcon as={GoHeart} color="red" />
              Games
            </ListItem>
            <ListItem>
              <ListIcon as={GoHeart} color="red" />
              Travel
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
