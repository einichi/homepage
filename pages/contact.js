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
    CheckboxGroup
} from '@chakra-ui/react'
import Section from '../components/section'
import { EmailIcon, CheckIcon } from '@chakra-ui/icons'
import Layout from '../components/layouts/article'
import React from 'react'
import { useFormik } from 'formik'

const Contact = () => {

    const formik = useFormik({
        initialValues: {
            sender: "",
            email: "",
            message: "",
            fromCompany: "",
            fromAgency: "",
            role: "",
            salaryLower: "800",
            salaryUpper: "1200",
            benefitFullRemote: "",
            benefitHybridRemote: "",
            benefitFlexibleHours: "",
            benefitOther: ""
        },
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2))
        }
    })

    return (
        <Layout>
            <Container>
                <Section>
                    <Heading as="h3" variant="section-title">
                        Contact Ricky
                    </Heading>
                    <form onSubmit={formik.handleSubmit}>
                    <FormControl isRequired>
                        <FormLabel htmlFor='sender'>Your name</FormLabel>
                            <Input
                                id='sender'
                                name='sender'
                                placeholder='John Doe | タレント太郎'
                                border='2px'
                                borderColor='teal'
                                onChange={formik.handleChange}
                                value={formik.values.sender}
                            />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel htmlFor='email'>Your email</FormLabel>
                        <Input
                            id='email'
                            name='email'
                            placeholder='you@some.domain'
                            type='email'
                            border='2px'
                            borderColor='teal'
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
                            <FormLabel htmlFor='recruiting' mb='0'>
                                Recruiting for a job?
                            </FormLabel>
                            <Switch id='recruiting' name='recruiting' colorScheme='teal' />
                        </FormControl>
                    </Flex>
                    <Box id='recruitingBox' name='recruitingBox'>
                        <FormControl>
                            <RadioGroup
                                defaultValue='company'
                                colorScheme='teal'
                            >
                                <Stack>
                                    <Radio id='company' name='company' value='company'>Direct Hire</Radio>
                                    <Radio id='company' name='company' value='agency'>Recruiting Agency</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel htmlFor='fromAgency'>Agency name</FormLabel>
                            <Input
                                id='fromAgency'
                                name='fromAgency'
                                placeholder='Executive Recruiters Inc | 有琉余案件株式会社'
                                border='2px'
                                borderColor='teal'
                                onChange={formik.handleChange}
                                value={formik.values.fromAgency}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel htmlFor='fromCompany'>Company name</FormLabel>
                            <Input
                                id='fromCompany'
                                name='fromCompany'
                                placeholder='Come Pany Ltd. | 来手星意株式会社'
                                border='2px'
                                borderColor='teal'
                                onChange={formik.handleChange}
                                value={formik.values.fromCompany}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel htmlFor='role'>Role type</FormLabel>
                            <Select
                                id='role'
                                name='role'
                                placeholder='Select one'
                                variant='outline'
                                border='2px'
                                borderColor='teal'
                                onChange={formik.handleChange}
                                value={formik.values.role}
                            >
                                <option disabled>---</option>
                                <option id='roleSRE' name='roleSRE' value='sre'>Infra / SRE</option>
                                <option id='roleSecurity' name='roleSecurity' value='security'>Information Security</option>
                                <option id='roleDevops' name='roleDevops' value='devops'>DevOps/DevSecOps</option>
                                <option disabled>---</option>
                                <option value='roleOther'>Something different</option>
                            </Select>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel htmlFor='employmentType'>Employment Type</FormLabel>
                            <RadioGroup
                                id='employmentType'
                                name='employmentType'
                                defaultValue='fullEmployee'
                                colorScheme='teal'
                            >
                                <Stack direction='row'>
                                    <Radio id='fullEmployee' name='fullEmployee' value='fullEmployee'>Full Time Employee</Radio>
                                    <Radio isDisabled id='contract' name='contractor' value='contractor'>Contractor</Radio>
                                    <Radio isDisabled id='dispatch' name='dispatch' value='dispatch'>Dispatch</Radio>
                                    <Radio isDisabled id='partTime' name='partTime' value='partTime'>Part Time</Radio>
                                </Stack>
                                <FormHelperText>
                                    Only interested in full-time roles right now, sorry!
                                </FormHelperText>
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor='salary'>Salary range</FormLabel>
                            <RangeSlider
                                id='salary'
                                name='salary'
                                min={0}
                                max={2000}
                                step={100}
                                onChange={(value) => {
                                    formik.setFieldValue('salaryLower', value[0])
                                    formik.setFieldValue('salaryUpper', value[1])
                                }}
                                value={[formik.values.salaryLower, formik.values.salaryUpper]}
                            >
                                <RangeSliderTrack bg='teal.100'>
                                    <RangeSliderFilledTrack bg='teal' />
                                </RangeSliderTrack>
                                    <RangeSliderThumb boxSize={6} index={0} />
                                    <RangeSliderThumb boxSize={6} index={1} />
                            </RangeSlider>
                            {/* TODO: Add dynamic updating of values below */}
                            <Flex>
                                <Text>¥</Text>
                                <Spacer />
                                <Text>8,000,000</Text>
                                <Spacer />
                                <Text>12,000,000</Text>
                                <Spacer />
                            </Flex>
                            <Flex>
                                <Text>$</Text>
                                <Spacer />
                                <Text>63,000</Text>
                                <Spacer />
                                <Text>94,000</Text>
                                <Spacer />
                            </Flex>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor='benefits'>Benefits</FormLabel>
                            <CheckboxGroup colorScheme='teal'>
                                <Stack spacing={[1, 10]} direction={['column', 'row']}>
                                    <Checkbox
                                        id='benefitFullRemote'
                                        name='benefitFullRemote'
                                        onChange={formik.handleChange}
                                        isChecked={formik.values.benefitFullRemote}
                                    >
                                        Full Remote
                                    </Checkbox>
                                    <Checkbox
                                        id='benefitHybridRemote'
                                        name='benefitHybridRemote'
                                        onChange={formik.handleChange}
                                        isChecked={formik.values.benefitHybridRemote}
                                    >
                                        Hybrid Remote
                                    </Checkbox>
                                    <Checkbox
                                        id='benefitFlexibleHours'
                                        name='benefitFlexibleHours'
                                        onChange={formik.handleChange}
                                        isChecked={formik.values.benefitFlexibleHours}
                                    >
                                        Flexible Hours
                                    </Checkbox>
                                    <Checkbox
                                        id='benefitOther'
                                        name='benefitOther'
                                        onChange={formik.handleChange}
                                        isChecked={formik.values.benefitOther}
                                    >Other (mention in Message)</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </FormControl>
                    </Box>
                    <FormLabel htmlFor='message' mt='1em' >Message</FormLabel>
                    <Textarea
                        id='message'
                        name='message'
                        placeholder='Your message here'
                        border='2px'
                        borderColor='teal'
                        onChange={formik.handleChange}
                        value={formik.values.message}
                    />
                            
                    <br />
                    <Alert status='error' display='none'>
                        <AlertIcon />
                        <AlertTitle mr={2}>Sending failed</AlertTitle>
                        <AlertDescription>
                            Please wait a moment and try again.
                            Or contact me at <Link href='mailto:ricky@burg.in?subject=Website Contact (send failure)'>ricky@burg.in</Link> if the problem persists.
                            {/* TODO: Have the href value updated to contain the contents of the message on failure */}
                        </AlertDescription>
                    </Alert>
                    <Button
                        type="submit"
                        leftIcon={<EmailIcon />}
                        size='lg'
                        loadingText='Sending...'
                        colorScheme='teal'
                    >
                        Send
                    </Button>
                    <Button
                        leftIcon={<EmailIcon />}
                        size='lg'
                        colorScheme='teal'
                        loadingText='Sending...'
                        isLoading
                    ></Button>
                    <Button
                        leftIcon={<CheckIcon />}
                        size='lg'
                        colorScheme='teal'
                        loadingText='Sending...'
                        disabled
                    >Sent!</Button>
                    </form>
                </Section>
            </Container>
        </Layout>
    )
}

export default Contact