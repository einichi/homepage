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
import Section from '../../../components/section'
import { EmailIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons'
import Layout from '../../../components/layouts/article'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import { formatJPY, jpyToUSD } from '../../../libs/numberFormat'
import { useTranslations } from 'next-intl'

const postContactInfo = async ({
  sender,
  email,
  message,
  recruiting,
  ...rest
}) => {
  const API_URL =
    'https://qsp2z496q5.execute-api.ap-northeast-1.amazonaws.com/Prod/send'
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

  useEffect(() => {
    console.log(submitStatus)
  }, [submitStatus])

  const onSubmit = (values, onFinishSubmit) => {
    console.log('Submitting', values)
    setSubmitStatus('sending')
    postContactInfo(values)
      .then(() => {
        setSubmitStatus('sent')
        onFinishSubmit()
      })
      .catch((err) => {
        console.log(err)
        setSubmitStatus('error')
        onFinishSubmit()
      })
  }
  return [submitStatus, onSubmit]
}

const SubmitButton = ({ status }) => {
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
      recruiting: false
    },
    onSubmit: (value) => onSubmit(value, () => formik.setSubmitting(false))
  })

  useEffect(() => {
    console.log('isSubmitting:', formik.isSubmitting)
  }, [formik.isSubmitting])
  return (
    <Layout>
      <Container>
        <Section>
          <Heading as="h3" variant="section-title">
            {t('title')}
          </Heading>
          <form onSubmit={formik.handleSubmit}>
            <FormControl isRequired>
              <FormLabel htmlFor="sender">{t('labels.name')}</FormLabel>
              <Input
                id="sender"
                name="sender"
                placeholder={t('placeholders.name')}
                border="2px"
                borderColor="teal"
                onChange={formik.handleChange}
                value={formik.values.sender}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="email">{t('labels.email')}</FormLabel>
              <Input
                id="email"
                name="email"
                placeholder={t('placeholders.email')}
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
                {t('validation.email_helper')}
              </FormHelperText>
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
                  value={formik.values.recruiting}
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
                      <Radio id="jobSource_company" name="company" value="company">
                        {t('labels.direct_hire')}
                      </Radio>
                      <Radio id="jobSource_agency" name="company" value="agency">
                        {t('labels.agency')}
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                {formik.values.jobSource === 'agency' && (
                  <FormControl isRequired>
                    <FormLabel htmlFor="fromAgency">{t('labels.agency_name')}</FormLabel>
                    <Input
                      id="fromAgency"
                      name="fromAgency"
                      placeholder={t('placeholders.agency')}
                      border="2px"
                      borderColor="teal"
                      onChange={formik.handleChange}
                      value={formik.values.fromAgency}
                    />
                  </FormControl>
                )}
                <FormControl isRequired>
                  <FormLabel htmlFor="fromCompany">{t('labels.company_name')}</FormLabel>
                  <Input
                    id="fromCompany"
                    name="fromCompany"
                    placeholder={t('placeholders.company')}
                    border="2px"
                    borderColor="teal"
                    onChange={formik.handleChange}
                    value={formik.values.fromCompany}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="role">{t('labels.role_type')}</FormLabel>
                  <Select
                    id="role"
                    name="role"
                    placeholder={t('placeholders.select')}
                    variant="outline"
                    border="2px"
                    borderColor="teal"
                    onChange={formik.handleChange}
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
                    <FormHelperText>
                      {t('employment.helper')}
                    </FormHelperText>
                  </RadioGroup>
                </FormControl>
                <FormControl>
                  <Flex w="100%" gap="1rem" alignItems="center">
                    <Box flexGrow={1}>
                      <FormLabel htmlFor="salary">{t('labels.salary_range')}</FormLabel>
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

                    {/* TODO: Add dynamic updating of values below */}
                    <Box w="25%">
                      <FormControl>
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
                  <FormLabel htmlFor="benefits">{t('labels.benefits')}</FormLabel>
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
              value={formik.values.message}
            />
            <br />
            <Spacer h="1rem" />
            <SubmitButton status={submitStatus} />
            <Spacer h="1rem" />
            {submitStatus === 'error' && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>{t('alerts.error_title')}</AlertTitle>
                <AlertDescription>
                  {t.rich('alerts.error_desc', {
                    email: (chunks) => (
                      <Link href="mailto:ricky@burg.in?subject=Website Contact (send failure)">
                        ricky@burg.in
                      </Link>
                    )
                  })}
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
