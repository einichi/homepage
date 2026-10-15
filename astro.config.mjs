import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  output: 'static',
  integrations: [react()],
  build: { format: 'directory' },
  site: 'https://ricky.burg.in',
  vite: {
    define: {
      'import.meta.env.PUBLIC_SITE_MODE': JSON.stringify(
        process.env.SITE_MODE === 'production' ? 'production' : 'preview'
      )
    }
  }
})
