import { AnimatePresence, motion } from 'framer-motion'
import { IconButton, useColorModeValue } from '@chakra-ui/react'
import { useRouter, usePathname } from '../i18n/routing'
import { useLocale } from 'next-intl'

const LanguageToggleButton = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ja' : 'en'
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        style={{ display: 'inline-block' }}
        key={locale}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          mr={2}
          aria-label="Toggle language"
          colorScheme="teal"
          icon={
            <div style={{ fontSize: '1.2em', lineHeight: '1' }}>
              {locale === 'en' ? '🇯🇵' : '🇬🇧'}
            </div>
          }
          onClick={toggleLanguage}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default LanguageToggleButton
