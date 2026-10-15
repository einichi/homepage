import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const keys = (value, prefix = '') =>
  Object.entries(value)
    .flatMap(([key, entry]) => {
      const path = `${prefix}${key}`
      return typeof entry === 'object' && entry !== null
        ? keys(entry, `${path}.`)
        : [path]
    })
    .sort()

test('English and Japanese provide the same translation keys', async () => {
  const [en, ja] = await Promise.all(
    ['en', 'ja'].map(async (locale) =>
      JSON.parse(await readFile(`messages/${locale}.json`, 'utf8'))
    )
  )
  assert.deepEqual(keys(en), keys(ja))
})
