import { Box, Flex, Link, Button } from '@chakra-ui/react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <Box align="center" opacity={0.4} fontSize="sm">
        Built with Next.js, Chakra UI + React and more<br />
        3D Model <Link href="https://skfb.ly/6ZPtS" target="_blank">""My Computer""</Link> by Tobalation is licensed under <Link href="http://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons Attribution</Link>.
    </Box>
  )
}

export default Footer