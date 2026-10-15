'use client'

import { ChakraProvider, localStorageManager } from '@chakra-ui/react'
import { CacheProvider } from '@chakra-ui/next-js'
import theme from '../libs/theme'

// Color mode is persisted to localStorage; the layout's ColorModeScript sets
// it before paint. Reading cookies() here would opt every route into dynamic
// rendering for no benefit.
export default function Chakra({ children }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme} colorModeManager={localStorageManager}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}
