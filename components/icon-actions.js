'use client'

import { Button, Link, ListIcon } from '@chakra-ui/react'
import { TimeIcon, ChatIcon } from '@chakra-ui/icons'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { GoHeart } from 'react-icons/go'
import { HiCube } from 'react-icons/hi'
import { Link as NextLink } from '../i18n/routing'

const externalIcons = {
  designs: <HiCube />,
  github: <FaGithub />,
  linkedin: <FaLinkedin />
}

const internalIcons = {
  chat: <ChatIcon />,
  time: <TimeIcon />
}

export const ExternalIconButton = ({ href, icon, children }) => (
  <Link href={href} target="_blank">
    <Button variant="ghost" colorScheme="teal" leftIcon={externalIcons[icon]}>
      {children}
    </Button>
  </Link>
)

export const InternalIconButton = ({ href, icon, children }) => (
  <NextLink href={href} passHref>
    <Button colorScheme="teal" variant="outline" leftIcon={internalIcons[icon]}>
      {children}
    </Button>
  </NextLink>
)

export const HeartListIcon = ({ color }) => (
  <ListIcon as={GoHeart} color={color} />
)
