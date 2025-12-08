import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import config from './theme-config'

const styles = {
  global: (props) => ({
    body: {
      bg: mode('#f0e7db', '#202023')(props)
    }
  })
}

const components = {
  Heading: {
    variants: {
      'section-title': {
        textDecoration: 'underline',
        fontSize: 20,
        textUnderlineOffset: 6,
        textDecorationColor: '#525252',
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 4
      },
      'section-subtitle': (props) => ({
        fontSize: 16,
        textColor: mode('#525252', '#c2c2c2')(props),
        marginTop: 3,
        marginBottom: 4
      })
    }
  },
  Link: {
    baseStyle: (props) => ({
      color: mode('#3d7aed', '#ff63c3')(props),
      textUnderlineOffset: 3
    })
  }
}

const colors = {
  glassTeal: '#88ccca'
}

const theme = extendTheme({
  config,
  styles,
  components,
  colors,
  fonts: {
    heading: 'var(--font-mplus)'
  },
  semanticTokens: {
    colors: {
      navbarBg: {
        default: '#ffffff40',
        _dark: '#20202380'
      }
    }
  }
})

export default theme
