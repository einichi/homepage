'use client'

import Logo from './logo'
import { Link as NextLink } from '../i18n/routing'
import {
  Container,
  Box,
  Link,
  Stack,
  Heading,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import ThemeToggleButton from './theme-toggle-button'
import LanguageToggleButton from './language-toggle-button'
import { usePathname } from '../i18n/routing'
import { useTranslations } from 'next-intl'

const LinkItem = ({ href, path, children }) => {
  const active = path === href
  const inactiveColor = useColorModeValue('gray200', 'whiteAlpha.900')
  return (
    <Link
      as={NextLink}
      href={href}
      p={2}
      bg={active ? 'glassTeal' : undefined}
      color={active ? '#202023' : inactiveColor}
    >
      {children}
    </Link>
  )
}

const Navbar = (props) => {
  const t = useTranslations('Navbar')
  const pathname = usePathname()
  const path = props.path || pathname

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg="navbarBg"
      style={{ backdropFilter: 'blur(10px)' }}
      zIndex={1}
      {...props}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        wrap="wrap"
        align="center"
        justify="space-between"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            <Logo />
          </Heading>
        </Flex>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, nmd: 0 }}
        >
          <LinkItem href="/work" path={path}>
            {t('work')}
          </LinkItem>
          {/* TODO: Add Post/Blog here later */}
          <LinkItem href="/contact" path={path}>
            {t('contact')}
          </LinkItem>
        </Stack>
        <Box flex={1} align="right">
          <LanguageToggleButton />
          <ThemeToggleButton />
          <Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
              />
              <MenuList>
                <MenuItem as={NextLink} href="/work">
                  {t('work')}
                </MenuItem>
                {/* TODO: Add Post/Blog here later */}
                <MenuItem as={NextLink} href="/contact">
                  {t('contact')}
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Navbar
