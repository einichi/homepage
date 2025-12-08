'use client'

import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const PageTransition = ({ children }) => {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait" initial={true}>
      <div key={pathname} style={{ width: '100%' }}>
        {children}
      </div>
    </AnimatePresence>
  )
}

export default PageTransition
