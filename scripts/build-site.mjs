import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

// These are public widget identifiers, intentionally included in contact HTML.
const turnstileSitekeys = {
  preview: '0x4AAAAAAFXR1pjxc40_l6V2',
  production: '0x4AAAAAAFXsmw4S-g6iDbRm',
  development: ''
}
const mode = process.env.SITE_MODE ?? 'preview'
if (!Object.hasOwn(turnstileSitekeys, mode)) throw new Error(`Unknown site mode: ${mode}`)

const result = spawnSync('node_modules/.bin/astro', ['build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1',
    PUBLIC_TURNSTILE_SITEKEY:
      mode === 'development'
        ? ''
        : process.env.PUBLIC_TURNSTILE_SITEKEY || turnstileSitekeys[mode]
  }
})
if (result.status !== 0) process.exit(result.status ?? 1)
async function removeMacMetadata(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`
    if (entry.name === '.DS_Store') await rm(path, { force: true })
    else if (entry.isDirectory()) await removeMacMetadata(path)
  }
}
await removeMacMetadata('dist')
await mkdir('dist', { recursive: true })
const common = `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: frame-ancestors 'none'\n`
const preview = process.env.SITE_MODE !== 'production'
await writeFile(
  'dist/_headers',
  `${common}${preview ? '  X-Robots-Tag: noindex, nofollow\n' : ''}`
)
await writeFile(
  'dist/_redirects',
  '/ /en/ 301\n/work /en/work/ 301\n/work/ /en/work/ 301\n/contact /en/contact/ 301\n/contact/ /en/contact/ 301\n'
)
