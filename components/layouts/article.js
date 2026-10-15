'use client'

import { motion, useReducedMotion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 }
}

const Layout = ({ children }) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      initial={reduceMotion ? false : 'hidden'}
      animate="enter"
      variants={variants}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeInOut' }}
      style={{ position: 'relative' }}
    >
      {children}
    </motion.article>
  )
}

export default Layout
