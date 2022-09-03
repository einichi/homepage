import {
  Container,
  Button,
  Box,
  Heading,
  Flex,
  Spacer,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Link,
  Switch,
  Textarea,
  RadioGroup,
  Radio,
  Stack,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Checkbox,
  CheckboxGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react'
import Section from '../components/section'
import { EmailIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons'
import Layout from '../components/layouts/article'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import { formatJPY, jpyToUSD } from '../libs/numberFormat'

//Useful for testing the retry functionality
/*
const throwErrorAfter = async ms => {
  const timeout = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  await timeout(1000)
  throw new Error()
}*/

const postContactInfo = async ({
  sender,
  email,
  message,
  recruiting,
  ...rest
}) => {
  const API_URL =
    'https://zik7q0rc1a.execute-api.ap-northeast-1.amazonaws.com/Prod/send'
  let valuesToPost = {
    sender,
    email,
    message
  }
  if (recruiting) {
    valuesToPost = { ...valuesToPost, recruiting, ...rest }
  }

  console.log(valuesToPost)

  return axios.post(API_URL, valuesToPost)
}

const usePostContactInfo = () => {
  const [submitStatus, setSubmitStatus] = useState(null)
  /*const submitTimeout = useRef(null)
                                                          
                                                            useEffect(() => {
                                                                                if (submitStatus !== 'error') return
                                                                                submitTimeout.current = setTimeout(() => {
                                                                                  if (submitStatus === 'error') setSubmitStatus(null)
                                                                                }, 2000)
                                                                                return () => clearTimeout(submitTimeout.current)
                                                                              }, [submitStatus])*/

  useEffect(() => {
    console.log(submitStatus)
  }, [submitStatus])

  const onSubmit = (values, onFinishSubmit) => {
    console.log('Submitting', values)
    setSubmitStatus('sending')
    postContactInfo(values)
      .then(res => {
        console.debug(res)
        setSubmitStatus('sent')
        onFinishSubmit()
      })
      .catch(err => {
        console.log(err)
        setSubmitStatus('error')
        onFinishSubmit()
      })
  }
  return [submitStatus, onSubmit]
}

const SubmitButton = ({ status }) => {
  if (!status || status === 'sending')
    return (
      <Button
        type="submit"
        leftIcon={<EmailIcon />}
        size="lg"
        loadingText="Sending..."
        colorScheme="teal"
        isLoading={Boolean(status)} //Here, status is either null or its sending
      >
        Send
      </Button>
    )

  if (status === 'error') {
    return (
      <Button
        type="submit"
        leftIcon={<CloseIcon />}
        size="lg"
        colorScheme="red"
        loadingText="Sending..."
      >
        Retry?
      </Button>
    )
  }

  return (
    <Button
      type="submit"
      leftIcon={<CheckIcon />}
      size="lg"
      loadingText="Sending..."
      disabled
      colorScheme="teal" //Here, status is either null or its sending
    >
      Sent!
    </Button>
  )
}

const Contact = () => {
  const [submitStatus, onSubmit] = usePostContactInfo()

  const formik = useFormik({
    initialValues: {
      sender: '',
      email: '',
      message: '',
      fromCompany: '',
      fromAgency: '',
      role: '',
      salaryLower: 2000000,
      salaryUpper: 20000000,
      exchangeRate: 0.0073,
      benefitFullRemote: false,
      benefitHybridRemote: false,
      benefitFlexibleHours: false,
      benefitOther: false,
      recruiting: false
    },
    onSubmit: value => onSubmit(value, () => formik.setSubmitting(false))
  })

  useEffect(() => {
    console.log('isSubmitting:', formik.isSubmitting)
  }, [formik.isSubmitting])
  return (
    <Layout>
      <Container>
        <Section>
          <Heading as="h3" variant="section-title">
            Contact Ricky
          </Heading>
          <form onSubmit={formik.handleSubmit}>
            <FormControl isRequired>
              <FormLabel htmlFor="sender">Your name</FormLabel>
              <Input
                id="sender"
                name="sender"
                placeholder="John Doe | タレント太郎"
                border="2px"
                borderColor="teal"
                onChange={formik.handleChange}
                value={formik.values.sender}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="email">Your email</FormLabel>
              <Input
                id="email"
                name="email"
                placeholder="you@some.domain"
                type="email"
                border="2px"
                borderColor="teal"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              <FormErrorMessage>
                Please enter a valid email address
              </FormErrorMessage>
              <FormHelperText>
                Used only to reply to your message
              </FormHelperText>
            </FormControl>
            <br />
            <Flex>
              <FormControl>
                <FormLabel htmlFor="recruiting" mb="0">
                  Recruiting for a job?
                </FormLabel>
                <Switch
                  id="recruiting"
                  name="recruiting"
                  colorScheme="teal"
                  value={formik.values.recruiting}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Flex>
            {formik.values.recruiting && (
              <Box id="recruitingBox" name="recruitingBox">
                <FormControl>
                  <RadioGroup defaultValue="company" colorScheme="teal">
                    <Stack>
                      <Radio id="company" name="company" value="company">
                        Direct Hire
                      </Radio>
                      <Radio id="company" name="company" value="agency">
                        Recruiting Agency
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="fromAgency">Agency name</FormLabel>
                  <Input
                    id="fromAgency"
                    name="fromAgency"
                    placeholder="Executive Recruiters Inc | 有琉余案件株式会社"
                    border="2px"
                    borderColor="teal"
                    onChange={formik.handleChange}
                    value={formik.values.fromAgency}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="fromCompany">Company name</FormLabel>
                  <Input
                    id="fromCompany"
                    name="fromCompany"
                    placeholder="Come Pany Ltd. | 来手星意株式会社"
                    border="2px"
                    borderColor="teal"
                    onChange={formik.handleChange}
                    value={formik.values.fromCompany}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="role">Role type</FormLabel>
                  <Select
                    id="role"
                    name="role"
                    placeholder="Select one"
                    variant="outline"
                    border="2px"
                    borderColor="teal"
                    onChange={formik.handleChange}
                    value={formik.values.role}
                  >
                    <option disabled>---</option>
                    <option id="roleSRE" name="roleSRE" value="sre">
                      Infra / SRE
                    </option>
                    <option
                      id="roleSecurity"
                      name="roleSecurity"
                      value="security"
                    >
                      Information Security
                    </option>
                    <option id="roleDevops" name="roleDevops" value="devops">
                      DevOps/DevSecOps
                    </option>
                    <option disabled>---</option>
                    <option value="roleOther">Something different</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="employmentType">
                    Employment Type
                  </FormLabel>
                  <RadioGroup
                    id="employmentType"
                    name="employmentType"
                    defaultValue="fullEmployee"
                    colorScheme="teal"
                  >
                    <Stack direction="row">
                      <Radio
                        id="fullEmployee"
                        name="fullEmployee"
                        value="fullEmployee"
                      >
                        Full Time Employee
                      </Radio>
                      <Radio
                        isDisabled
                        id="contract"
                        name="contractor"
                        value="contractor"
                      >
                        Contractor
                      </Radio>
                      <Radio
                        isDisabled
                        id="dispatch"
                        name="dispatch"
                        value="dispatch"
                      >
                        Dispatch
                      </Radio>
                      <Radio
                        isDisabled
                        id="partTime"
                        name="partTime"
                        value="partTime"
                      >
                        Part Time
                      </Radio>
                    </Stack>
                    <FormHelperText>
                      Only interested in full-time roles right now, sorry!
                    </FormHelperText>
                  </RadioGroup>
                </FormControl>
                <FormControl>
                  <Flex w="100%" gap="1rem" alignItems="center">
                    <Box flexGrow={1}>
                      <FormLabel htmlFor="salary">Salary range</FormLabel>
                      <RangeSlider
                        id="salary"
                        name="salary"
                        min={1000000}
                        max={30000000}
                        step={100000}
                        onChange={value => {
                          formik.setFieldValue('salaryLower', value[0])
                          formik.setFieldValue('salaryUpper', value[1])
                        }}
                        value={[
                          formik.values.salaryLower,
                          formik.values.salaryUpper
                        ]}
                      >
                        <RangeSliderTrack bg="teal.100">
                          <RangeSliderFilledTrack bg="teal" />
                        </RangeSliderTrack>
                        <RangeSliderThumb boxSize={6} index={0} />
                        <RangeSliderThumb boxSize={6} index={1} />
                      </RangeSlider>
                    </Box>

                    {/* TODO: Add dynamic updating of values below */}
                    <Box w="25%">
                      <FormControl>
                        <FormLabel htmlFor="exchangeRate">
                          Exchange Rate
                        </FormLabel>
                        <NumberInput
                          id="exchangeRate"
                          name="exchangeRate"
                          min={0}
                          max={1}
                          step={0.0001}
                          value={formik.values.exchangeRate}
                          onChange={value => {
                            formik.setFieldValue('exchangeRate', value)
                          }}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    </Box>
                  </Flex>
                  <Flex>
                    <Text>¥</Text>
                    <Spacer />
                    <Text>{formatJPY(formik.values.salaryLower)}</Text>
                    <Spacer />
                    <Text>{formatJPY(formik.values.salaryUpper)}</Text>
                    <Spacer />
                  </Flex>
                  <Flex>
                    <Text>$</Text>
                    <Spacer />
                    <Text>
                      {jpyToUSD(
                        formik.values.salaryLower,
                        formik.values.exchangeRate
                      )}
                    </Text>
                    <Spacer />
                    <Text>
                      {jpyToUSD(
                        formik.values.salaryUpper,
                        formik.values.exchangeRate
                      )}
                    </Text>
                    <Spacer />
                  </Flex>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="benefits">Benefits</FormLabel>
                  <CheckboxGroup colorScheme="teal">
                    <Stack spacing={[1, 10]} direction={['column', 'row']}>
                      <Checkbox
                        id="benefitFullRemote"
                        name="benefitFullRemote"
                        onChange={formik.handleChange}
                        isChecked={formik.values.benefitFullRemote}
                      >
                        Full Remote
                      </Checkbox>
                      <Checkbox
                        id="benefitHybridRemote"
                        name="benefitHybridRemote"
                        onChange={formik.handleChange}
                        isChecked={formik.values.benefitHybridRemote}
                      >
                        Hybrid Remote
                      </Checkbox>
                      <Checkbox
                        id="benefitFlexibleHours"
                        name="benefitFlexibleHours"
                        onChange={formik.handleChange}
                        isChecked={formik.values.benefitFlexibleHours}
                      >
                        Flexible Hours
                      </Checkbox>
                      <Checkbox
                        id="benefitOther"
                        name="benefitOther"
                        onChange={formik.handleChange}
                        isChecked={formik.values.benefitOther}
                      >
                        Other (mention in Message)
                      </Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </FormControl>
              </Box>
            )}
            <FormLabel htmlFor="message" mt="1em">
              Message
            </FormLabel>
            <Textarea
              id="message"
              name="message"
              placeholder="Your message here"
              border="2px"
              borderColor="teal"
              onChange={formik.handleChange}
              value={formik.values.message}
            />
            <br />
            <Spacer h="1rem" />
            <SubmitButton status={submitStatus} />
            <Spacer h="1rem" />
            {submitStatus === 'error' && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>Sending failed</AlertTitle>
                <AlertDescription>
                  Please wait a moment and try again. Or contact me at{' '}
                  <Link href="mailto:ricky@burg.in?subject=Website Contact (send failure)">
                    ricky@burg.in
                  </Link>{' '}
                  if the problem persists.
                  {/* TODO: Have the href value updated to contain the contents of the message on failure */}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Section>
      </Container>
    </Layout>
  )
}

export default Contact
export { getServerSideProps } from '../components/chakra'