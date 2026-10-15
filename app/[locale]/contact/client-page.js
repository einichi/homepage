'use client'

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
import { EmailIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons'
import Layout from '../../../components/layouts/article'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import { formatJPY, jpyToUSD } from '../../../libs/numberFormat'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'

// No hardcoded fallback: the endpoint is deployment configuration. If it is
// missing the submit fails loudly and the error alert points at mailto:.
const CONTACT_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL

const postContactInfo = async ({
  sender,
  email,
  message,
  recruiting,
  consent: _consent,
  ...rest
}) => {
  if (!CONTACT_API_URL) {
    const error = new Error(
      'NEXT_PUBLIC_CONTACT_API_URL is not configured for this deployment'
    )
    error.status = null
    throw error
  }

  let valuesToPost = {
    sender,
    email,
    message
  }
  if (recruiting) {
    // `consent` is destructured away above (as `_consent`) on purpose: it is a
    // UI acknowledgement, never part of the payload the Lambda expects.
    valuesToPost = { ...valuesToPost, recruiting, ...rest }
  }

  const response = await fetch(CONTACT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(valuesToPost)
  })

  // The Lambda answers 204 on success; anything else is a failure worth
  // showing the user and logging the status of.
  if (!response.ok) {
    const error = new Error(`Contact API responded ${response.status}`)
    error.status = response.status
    throw error
  }

  return response
}

const usePostContactInfo = () => {
  const [submitStatus, setSubmitStatus] = useState(null)

  // Returns the promise chain so Formik keeps `isSubmitting` true until the
  // request settles, which is what actually disables the submit button.
  const onSubmit = (values, onSuccess) => {
    setSubmitStatus('sending')

    return postContactInfo(values)
      .then(() => {
        setSubmitStatus('sent')
        onSuccess()
      })
      .catch((err) => {
        // Deliberately no PII (name, email, company) in the log.
        console.error('Contact form failed', {
          status: err.status ?? null
        })
        setSubmitStatus('error')
      })
  }
  return [submitStatus, onSubmit]
}

const SubmitButton = ({ status, isDisabled }) => {
  const t = useTranslations('Contact')

  if (!status || status === 'sending')
    return (
      <Button
        type="submit"
        leftIcon={<EmailIcon />}
        size="lg"
        loadingText={t('buttons.sending')}
        colorScheme="teal"
        isLoading={Boolean(status)}
        isDisabled={isDisabled}
      >
        {t('buttons.send')}
      </Button>
    )

  if (status === 'error') {
    return (
      <Button
        type="submit"
        leftIcon={<CloseIcon />}
        size="lg"
        colorScheme="red"
        loadingText={t('buttons.sending')}
        isDisabled={isDisabled}
      >
        {t('buttons.retry')}
      </Button>
    )
  }

  return (
    <Button
      type="submit"
      leftIcon={<CheckIcon />}
      size="lg"
      loadingText={t('buttons.sending')}
      disabled
      colorScheme="teal"
    >
      {t('buttons.sent')}
    </Button>
  )
}

const Contact = () => {
  const t = useTranslations('Contact')
  const [submitStatus, onSubmit] = usePostContactInfo()
  const searchParams = useSearchParams()
  const isHireMeLink = searchParams.has('hireme')

  const formik = useFormik({
    initialValues: {
      sender: '',
      email: '',
      message: '',
      fromCompany: '',
      fromAgency: '',
      role: '',
      jobSource: 'company',
      salaryLower: 2000000,
      salaryUpper: 20000000,
      exchangeRate: 0.0064,
      benefitFullRemote: false,
      benefitHybridRemote: false,
      benefitFlexibleHours: false,
      benefitOther: false,
      recruiting: isHireMeLink,
      consent: false
    },
    validateOnMount: true,
    validate: (values) => {
      const errors = {}
      const required = t('validation.required')

      if (!values.sender.trim()) errors.sender = required
      if (!values.email.trim()) {
        errors.email = required
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = t('validation.email')
      }
      if (!values.message.trim()) errors.message = required
      if (!values.consent) errors.consent = t('validation.consent')

      if (values.recruiting) {
        if (values.jobSource === 'agency' && !values.fromAgency.trim()) {
          errors.fromAgency = required
        }
        if (!values.fromCompany.trim()) errors.fromCompany = required
        if (!values.role) errors.role = required
        if (Number(values.salaryUpper) <= Number(values.salaryLower)) {
          errors.salary = t('validation.salary_order')
        }
        if (Number(values.exchangeRate) <= 0) {
          errors.exchangeRate = t('validation.exchange_rate')
        }
      }

      return errors
    },
    onSubmit: (value) => onSubmit(value, () => formik.resetForm())
  })

  return (
    <Layout>
      <Container>
        <Box as="section" mb={6}>
          <Heading as="h3" variant="section-title">
            {t('title')}
          </Heading>
          <form onSubmit={formik.handleSubmit} noValidate>
            <FormControl
              isRequired
              isInvalid={Boolean(formik.touched.sender && formik.errors.sender)}
            >
              <FormLabel htmlFor="sender">{t('labels.name')}</FormLabel>
              <Input
                id="sender"
                name="sender"
                placeholder={t('placeholders.name')}
                border="2px"
                borderColor="teal"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sender}
              />
              <FormErrorMessage>{formik.errors.sender}</FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={Boolean(formik.touched.email && formik.errors.email)}
            >
              <FormLabel htmlFor="email">{t('labels.email')}</FormLabel>
              <Input
                id="email"
                name="email"
                placeholder={t('placeholders.email')}
                type="email"
                border="2px"
                borderColor="teal"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              <FormHelperText>{t('validation.email_helper')}</FormHelperText>
            </FormControl>
            <br />
            <Flex>
              <FormControl>
                <FormLabel htmlFor="recruiting" mb="0">
                  {t('labels.recruiting')}
                </FormLabel>
                <Switch
                  id="recruiting"
                  name="recruiting"
                  colorScheme="teal"
                  isChecked={formik.values.recruiting}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Flex>
            {formik.values.recruiting && (
              <Box id="recruitingBox" name="recruitingBox">
                <FormControl>
                  <RadioGroup
                    defaultValue="company"
                    colorScheme="teal"
                    value={formik.values.jobSource}
                    onChange={(value) => {
                      formik.setFieldValue('jobSource', value)
                    }}
                  >
                    <Stack>
                      <Radio
                        id="jobSource_company"
                        name="company"
                        value="company"
                      >
                        {t('labels.direct_hire')}
                      </Radio>
                      <Radio
                        id="jobSource_agency"
                        name="company"
                        value="agency"
                      >
                        {t('labels.agency')}
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                {formik.values.jobSource === 'agency' && (
                  <FormControl
                    isRequired
                    isInvalid={Boolean(
                      formik.touched.fromAgency && formik.errors.fromAgency
                    )}
                  >
                    <FormLabel htmlFor="fromAgency">
                      {t('labels.agency_name')}
                    </FormLabel>
                    <Input
                      id="fromAgency"
                      name="fromAgency"
                      placeholder={t('placeholders.agency')}
                      border="2px"
                      borderColor="teal"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.fromAgency}
                    />
                    <FormErrorMessage>
                      {formik.errors.fromAgency}
                    </FormErrorMessage>
                  </FormControl>
                )}
                <FormControl
                  isRequired
                  isInvalid={Boolean(
                    formik.touched.fromCompany && formik.errors.fromCompany
                  )}
                >
                  <FormLabel htmlFor="fromCompany">
                    {t('labels.company_name')}
                  </FormLabel>
                  <Input
                    id="fromCompany"
                    name="fromCompany"
                    placeholder={t('placeholders.company')}
                    border="2px"
                    borderColor="teal"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fromCompany}
                  />
                  <FormErrorMessage>
                    {formik.errors.fromCompany}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={Boolean(formik.touched.role && formik.errors.role)}
                >
                  <FormLabel htmlFor="role">{t('labels.role_type')}</FormLabel>
                  <Select
                    id="role"
                    name="role"
                    placeholder={t('placeholders.select')}
                    variant="outline"
                    border="2px"
                    borderColor="teal"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.role}
                  >
                    <option disabled>---</option>
                    <option id="roleSRE" name="roleSRE" value="sre">
                      {t('roles.sre')}
                    </option>
                    <option
                      id="roleSecurity"
                      name="roleSecurity"
                      value="security"
                    >
                      {t('roles.security')}
                    </option>
                    <option id="roleDevops" name="roleDevops" value="devops">
                      {t('roles.devops')}
                    </option>
                    <option disabled>---</option>
                    <option value="roleOther">{t('roles.other')}</option>
                  </Select>
                  <FormErrorMessage>{formik.errors.role}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="employmentType">
                    {t('labels.employment_type')}
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
                        {t('employment.full_time')}
                      </Radio>
                      <Radio
                        isDisabled
                        id="contract"
                        name="contractor"
                        value="contractor"
                      >
                        {t('employment.contractor')}
                      </Radio>
                      <Radio
                        isDisabled
                        id="dispatch"
                        name="dispatch"
                        value="dispatch"
                      >
                        {t('employment.dispatch')}
                      </Radio>
                      <Radio
                        isDisabled
                        id="partTime"
                        name="partTime"
                        value="partTime"
                      >
                        {t('employment.part_time')}
                      </Radio>
                    </Stack>
                    <FormHelperText>{t('employment.helper')}</FormHelperText>
                  </RadioGroup>
                </FormControl>
                <FormControl isInvalid={Boolean(formik.errors.salary)}>
                  <Stack
                    direction={{ base: 'column', md: 'row' }}
                    w="100%"
                    gap="1rem"
                    alignItems={{ base: 'stretch', md: 'center' }}
                  >
                    <Box flexGrow={1}>
                      <FormLabel htmlFor="salary">
                        {t('labels.salary_range')}
                      </FormLabel>
                      <RangeSlider
                        id="salary"
                        name="salary"
                        min={1000000}
                        max={30000000}
                        step={100000}
                        onChange={(value) => {
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

                    <Box w={{ base: '100%', md: '25%' }}>
                      <FormControl
                        isInvalid={Boolean(formik.errors.exchangeRate)}
                      >
                        <FormLabel htmlFor="exchangeRate">
                          {t('labels.exchange_rate')}
                        </FormLabel>
                        <NumberInput
                          id="exchangeRate"
                          name="exchangeRate"
                          min={0}
                          max={1}
                          step={0.0001}
                          value={formik.values.exchangeRate}
                          onChange={(value) => {
                            formik.setFieldValue('exchangeRate', value)
                          }}
                          onBlur={formik.handleBlur}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>
                          {formik.errors.exchangeRate}
                        </FormErrorMessage>
                      </FormControl>
                    </Box>
                  </Stack>
                  <FormErrorMessage>{formik.errors.salary}</FormErrorMessage>
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
                  <FormLabel htmlFor="benefits">
                    {t('labels.benefits')}
                  </FormLabel>
                  <CheckboxGroup colorScheme="teal">
                    <Stack spacing={[1, 10]} direction={['column', 'row']}>
                      <Checkbox
                        id="benefitFullRemote"
                        name="benefitFullRemote"
                        onChange={formik.handleChange}
                        isChecked={formik.values.benefitFullRemote}
                      >
                        {t('benefits.full_remote')}
                      </Checkbox>
                      <Checkbox
                        id="benefitHybridRemote"
                        name="benefitHybridRemote"
                        onChange={formik.handleChange}
                        isChecked={formik.values.benefitHybridRemote}
                      >
                        {t('benefits.hybrid_remote')}
                      </Checkbox>
                      <Checkbox
                        id="benefitFlexibleHours"
                        name="benefitFlexibleHours"
                        onChange={formik.handleChange}
                        isChecked={formik.values.benefitFlexibleHours}
                      >
                        {t('benefits.flexible_hours')}
                      </Checkbox>
                      <Checkbox
                        id="benefitOther"
                        name="benefitOther"
                        onChange={formik.handleChange}
                        isChecked={formik.values.benefitOther}
                      >
                        {t('benefits.other')}
                      </Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </FormControl>
              </Box>
            )}
            <FormControl
              isRequired
              isInvalid={Boolean(
                formik.touched.message && formik.errors.message
              )}
            >
              <FormLabel htmlFor="message" mt="1em">
                {t('labels.message')}
              </FormLabel>
              <Textarea
                id="message"
                name="message"
                placeholder={t('placeholders.message')}
                border="2px"
                borderColor="teal"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
              />
              <FormErrorMessage>{formik.errors.message}</FormErrorMessage>
            </FormControl>
            <br />
            <Spacer h="1rem" />
            <FormControl
              isRequired
              isInvalid={Boolean(
                formik.submitCount > 0 && formik.errors.consent
              )}
            >
              <Checkbox
                id="consent"
                name="consent"
                colorScheme="teal"
                isChecked={formik.values.consent}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {t('privacy.consent')}
              </Checkbox>
              <FormHelperText mt="0.5rem">{t('privacy.notice')}</FormHelperText>
              {/* Only surfaced once the user has actually tried to send, so a
                  pristine form is not painted with errors. */}
              <FormErrorMessage>{formik.errors.consent}</FormErrorMessage>
            </FormControl>
            <Spacer h="1rem" />
            <SubmitButton
              status={submitStatus}
              isDisabled={formik.isSubmitting || !formik.isValid}
            />
            <Spacer h="1rem" />
            {submitStatus === 'sent' && (
              <Alert status="success">
                <AlertIcon />
                <AlertTitle mr={2}>{t('alerts.success_title')}</AlertTitle>
                <AlertDescription>
                  {t.rich('alerts.success_desc', {
                    email: () => (
                      <Link href="mailto:ricky@burg.in?subject=Website Contact">
                        ricky@burg.in
                      </Link>
                    )
                  })}
                </AlertDescription>
              </Alert>
            )}
            {submitStatus === 'error' && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>{t('alerts.error_title')}</AlertTitle>
                <AlertDescription>
                  {t.rich('alerts.error_desc', {
                    email: () => (
                      <Link href="mailto:ricky@burg.in?subject=Website Contact (send failure)">
                        ricky@burg.in
                      </Link>
                    )
                  })}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Box>
      </Container>
    </Layout>
  )
}

export default Contact
