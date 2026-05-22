import { AnimatePresence, motion } from 'framer-motion'
import { IconButton } from '@chakra-ui/react'
import { useRouter, usePathname } from '../i18n/routing'
import { useLocale, useTranslations } from 'next-intl'

const LanguageToggleButton = () => {
  const locale = useLocale()
  const t = useTranslations('Navbar')
  const router = useRouter()
  const pathname = usePathname()
  const nextLocale = locale === 'en' ? 'ja' : 'en'
  const label =
    nextLocale === 'ja' ? t('switch_to_japanese') : t('switch_to_english')

  const toggleLanguage = () => {
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
          aria-label={label}
          title={label}
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
