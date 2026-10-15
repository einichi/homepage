import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const mode = process.argv[2]
assert.ok(
  ['preview', 'production'].includes(mode),
  'Specify preview or production'
)
const root = '.cloudflare/output/v0'
const context = JSON.parse(await readFile(`${root}/config.json`, 'utf8'))
const worker = JSON.parse(
  await readFile(`${root}/workers/default/worker.config.json`, 'utf8')
)
const assets = `${root}/workers/default/assets`
assert.equal(
  context.buildContext.mode,
  mode,
  'Bundle mode mismatch: rebuild before deploying'
)
assert.equal(
  worker.name,
  mode === 'production' ? 'ricky-homepage' : 'ricky-homepage-preview'
)
assert.deepEqual(
  worker.domains ?? [],
  mode === 'production' ? ['ricky.burg.in'] : [],
  'Only the production package may attach the production hostname'
)
assert.ok(!worker.triggers?.length, 'Unexpected Worker triggers')
assert.equal(
  worker.env.LOCAL_CONTACT_STUB.value,
  'false',
  'A development stub must never be deployed'
)
assert.equal(worker.env.MAIL.type, 'send-email')
assert.equal(worker.env.TO_EMAIL.type, 'secret')
assert.equal(worker.env.TURNSTILE_SECRET.type, 'secret')
assert.deepEqual(worker.assets.runWorkerFirst, ['/api', '/api/*'])
assert.equal(worker.assets.notFoundHandling, 'none')
for (const locale of ['en', 'ja']) {
  for (const page of ['', 'work/', 'contact/']) {
    const html = await readFile(`${assets}/${locale}/${page}index.html`, 'utf8')
    assert.equal(
      /name="robots" content="noindex/.test(html),
      mode === 'preview',
      `${locale}/${page} indexing mismatch`
    )
    assert.equal(/rel="canonical"/.test(html), mode === 'production')
    assert.ok(!/mailto:/i.test(html), 'A public email fallback was emitted')
  }
  const notFound = await readFile(
    `${assets}/${locale}/not-found/index.html`,
    'utf8'
  )
  assert.match(notFound, /name="robots" content="noindex/)
}
const headers = await readFile(`${assets}/_headers`, 'utf8')
assert.equal(headers.includes('X-Robots-Tag: noindex'), mode === 'preview')
const robots = await readFile(`${assets}/robots.txt`, 'utf8')
assert.equal(robots.includes('Disallow: /\n'), mode === 'preview')
console.log(
  `Verified ${mode} bundle: isolated Worker, private bindings, static routes, indexing policy.`
)
