import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'

export const WorkSection = styled(Box) `
    padding-left: 3.4em;
    margin-top: 2em;
`
export const WorkTitle = styled.h4`
    font-weight: bold;
    font-size: 18px;
`

export const WorkCompany = styled.span`
    font-weight: bold;
    font-size: 14px;
    margin-right: 1em;
    display: inline-block;
`

export const WorkDate = styled.span`
    font-style: italic;
    margin-right: 1em;
    display: inline-block;
`

export const WorkDetails = styled.p`
    margin-top: 1em;
    margin-bottom: 1em;
`