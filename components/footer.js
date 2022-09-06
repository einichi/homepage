import { Box, Link } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box align="center" opacity={0.4} fontSize="sm">
      Built with Next.js, Chakra UI + React and more
      <br />
      3D Model{' '}
      <Link href="https://skfb.ly/6ZPtS" target="_blank">
        &quot;My Computer&quot;
      </Link>{' '}
      by Tobalation is licensed under{' '}
      <Link href="http://creativecommons.org/licenses/by/4.0/" target="_blank">
        Creative Commons Attribution
      </Link>
      .
    </Box>
  )
}

export default Footer
