import { Container, Button, Box, Heading, Flex, Spacer } from '@chakra-ui/react'
import NextLink from 'next/link'
import {
  WorkSection,
  WorkCompany,
  WorkTitle,
  WorkDate,
  WorkDetails
} from '../components/work'
import Section from '../components/section'
import { ChatIcon } from '@chakra-ui/icons'
import Layout from '../components/layouts/article'
const Work = () => {
  return (
    <Layout>
      <Container>
        <Section>
          <Heading as="h3" variant="section-title">
            Work History
          </Heading>

          <Box align="center" my={4}>
            <NextLink href="/contact?hireme">
              <Button
                leftIcon={<ChatIcon />}
                colorScheme="teal"
                variant="outline"
              >
                Hire me!
              </Button>
            </NextLink>
          </Box>

          <WorkSection>
            <Flex>
              <WorkTitle>SRE Manager - APAC</WorkTitle>
              <Spacer />
              <WorkCompany>Cheetah Digital Japan</WorkCompany>
            </Flex>
            <WorkDate>2022 - Present</WorkDate>
            <WorkDetails>
              Currently working as the SRE Manager for the APAC region of
              Cheetah Digital. Responsibilities include Resource Planning,
              Project Management, Team/People Management, Hiring, Mediating on
              regional/cultural differences and much more. Projects include
              expansion of on-premise Infrastructure and the migration of a
              large enterprise application from on-premise to AWS.
            </WorkDetails>
          </WorkSection>

          <WorkSection>
            <Flex>
              <WorkTitle>Security Engineer</WorkTitle>
              <Spacer />
              <WorkCompany>Cheetah Digital Japan</WorkCompany>
            </Flex>
            <WorkDate>2019 - 2022</WorkDate>
            <WorkDetails>
              Moved to Infosec to help with EDR solution onboarding and TLS 1.2
              switchover project. Heavily involved in the securing of existing
              and new AWS environments. Also assisted with technical topics
              brought up during ISMS/PrivacyMark audits and frequently bridged
              between Japan and Global to ascertain further required details.
              Everyday work involved monitoring, responding to
              detections/incidents, vulnerability management/patching and change
              control.
            </WorkDetails>
          </WorkSection>

          <WorkSection>
            <Flex>
              <WorkTitle>Internal IT Japan Team Lead</WorkTitle>
              <Spacer />
              <WorkCompany>Experian / Cheetah Digital Japan</WorkCompany>
            </Flex>
            <WorkDate>2018 - 2019</WorkDate>
            <WorkDetails>
              Handled the roll-out of a brand new IT environment for the Japan
              region. While working with the wider global IT organisation, I
              would support each and every employee in Japan. After around 1
              year in the role, I finished the replacement of approx 250 laptops
              with a completely new IT stack (moved from on-prem corporate IT to
              Okta/G-Suite). Also completely replaced legacy networks in Tokyo
              and Niigata offices with an entirely new network. The Tokyo office
              was moved to another building shortly after, and I co-ordinated
              the shift of the entire network and ISP circuits to occur over the
              weekend and complete just in time for the open of the new office
              on following Monday. To assist with everyday support, I recruited
              and managed a small, efficient team of 3 and reported to the APAC
              IT Manager.
            </WorkDetails>
          </WorkSection>

          <WorkSection>
            <Flex>
              <WorkTitle>DevOps Engineer</WorkTitle>
              <Spacer />
              <WorkCompany>Experian / Cheetah Digital Japan</WorkCompany>
            </Flex>
            <WorkDate>2017 - 2018</WorkDate>
            <WorkDetails>
              As part of a new project being built on AWS, I assisted in
              building a new CI/CD environment for initial use with a new
              project and with a view to bring all other existing development
              projects into the CI/CD environment. Deployed the CI tool
              Concourse and set up a fully automated development pipeline that
              tested, built and deployed web services to AWS. During this time,
              Experian sold its marketing division to become Cheetah Digital,
              which I was a part of. As a result of this divestment, product
              development in Japan was ceased. The VP of Internal IT then asked
              me to join them to help them stand up a new IT org for Cheetah
              Digital.
            </WorkDetails>
          </WorkSection>

          <WorkSection>
            <Flex>
              <WorkTitle>Senior Technical Analyst</WorkTitle>
              <Spacer />
              <WorkCompany>Experian UK</WorkCompany>
            </Flex>
            <WorkDate>2015 - 2017</WorkDate>
            <WorkDetails>
              Supported an array of bespoke applications, providing payment
              services and consumer credit information to a very significant
              portion of the UK&apos;s businesses. Co-ordinated the response to
              patching two severe PCI vulnerabilities on the production hosted
              services. Was the go-to escalation point for any technical issue
              that could not be resolved and handled other routine 3rd line
              issues. Learned a lot about corporate environments and processes,
              and a lot of specialist knowledge of the payment systems in the UK
              and the EU.
            </WorkDetails>
          </WorkSection>

          <WorkSection>
            <Flex>
              <WorkTitle>Senior Support Engineer</WorkTitle>
              <Spacer />
              <WorkCompany>Appliansys</WorkCompany>
            </Flex>
            <WorkDate>2014 - 2015</WorkDate>
            <WorkDetails>
              Pre and post sales engineer supporting a wide range of bespoke
              custom server appliances, including Web Caching, DNS and IPAM/DDI
              appliances.
            </WorkDetails>
          </WorkSection>

          <WorkSection>
            <Flex>
              <WorkTitle>Sole Proprietor</WorkTitle>
              <Spacer />
              <WorkCompany>Exoware</WorkCompany>
            </Flex>
            <WorkDate>2008 - 2014</WorkDate>
            <WorkDetails>
              Web hosting and virtual server business. Performed all business
              tasks. General admin, system admin (Linux), billing/finance/tax,
              compliance, customer/technical support, marketing and so forth.
              Sold in 2014.
            </WorkDetails>
          </WorkSection>

          <Box align="center" my={4}>
            <NextLink href="/contact?hireme">
              <Button
                leftIcon={<ChatIcon />}
                colorScheme="teal"
                variant="outline"
              >
                Hire me!
              </Button>
            </NextLink>
          </Box>
        </Section>
      </Container>
    </Layout>
  )
}

export default Work
export { getServerSideProps } from '../components/chakra'
