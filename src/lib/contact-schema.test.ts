import test from 'node:test'
import assert from 'node:assert/strict'
import { formatContactMessage, validateContact } from './contact-schema.ts'
import worker, { handleContact } from '../worker.ts'

const good = () => ({
  sender: 'Ada Lovelace',
  email: 'ada@example.test',
  message: 'Hello',
  consent: true
})
const request = (
  body: unknown = good(),
  options: {
    url?: string
    method?: string
    contentType?: string
    origin?: string | null
  } = {}
) => {
  const url = options.url ?? 'https://preview.example.test/api/contact'
  return new Request(url, {
    method: options.method ?? 'POST',
    headers: {
      'content-type': options.contentType ?? 'application/json',
      origin:
        options.origin === undefined
          ? new URL(url).origin
          : (options.origin ?? ''),
      'cf-connecting-ip': '192.0.2.8'
    },
    body:
      options.method === 'GET' || options.method === 'HEAD'
        ? undefined
        : typeof body === 'string'
          ? body
          : JSON.stringify(body)
  })
}
const env = (overrides: Record<string, unknown> = {}) => ({
  LOCAL_CONTACT_STUB: 'false',
  TURNSTILE_SECRET: 'test-secret',
  TURNSTILE_HOSTNAMES: 'preview.example.test',
  RATE_LIMITER: { limit: async () => ({ success: true }) },
  MAIL: { send: async () => ({ messageId: 'local-message' }) },
  FROM_EMAIL: 'website@example.test',
  TO_EMAIL: 'private@example.test',
  ...overrides
})

test('rejects method, content type, origin, oversized and malformed requests', async () => {
  const method = await handleContact(
    request(undefined, { method: 'GET' }),
    env() as never
  )
  assert.equal(method.status, 405)
  assert.equal(method.headers.get('allow'), 'POST')
  assert.equal(
    (
      await handleContact(
        request(good(), { contentType: 'text/plain' }),
        env() as never
      )
    ).status,
    415
  )
  assert.equal(
    (
      await handleContact(
        request(good(), { origin: 'https://attacker.test' }),
        env() as never
      )
    ).status,
    403
  )
  assert.equal(
    (
      await handleContact(
        new Request('https://preview.example.test/api/contact', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            origin: 'https://preview.example.test',
            'content-length': '40000'
          },
          body: '{}'
        }),
        env() as never
      )
    ).status,
    413
  )
  const oversized = await handleContact(
    new Request('https://preview.example.test/api/contact', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://preview.example.test'
      },
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(33_000))
          controller.close()
        }
      }),
      duplex: 'half'
    } as RequestInit & { duplex: 'half' }),
    env() as never
  )
  assert.equal(oversized.status, 413)
  assert.equal(
    (await handleContact(request('{oops'), env() as never)).status,
    400
  )
})

test('serves a locale-matched noindex 404 page for missing static paths', async () => {
  const assets = {
    fetch: async (request: Request) => {
      const path = new URL(request.url).pathname
      if (path === '/ja/not-found/')
        return new Response('<html lang="ja">見つかりません</html>', {
          status: 200,
          headers: { 'content-type': 'text/html' }
        })
      if (path === '/en/not-found/')
        return new Response('<html lang="en">Not found</html>', {
          status: 200,
          headers: { 'content-type': 'text/html' }
        })
      return new Response('<html lang="en">Global fallback</html>', {
        status: 404
      })
    }
  }
  const response = await worker.fetch(
    new Request('https://preview.example.test/ja/missing/'),
    { ASSETS: assets } as never,
    {} as never
  )
  assert.equal(response.status, 404)
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow')
  assert.match(await response.text(), /lang="ja"/)
})

test('validates consent and conditional recruiting data, rejects header injection, and strips inactive fields', () => {
  assert.equal(validateContact({ ...good(), consent: false }).ok, false)
  assert.equal(
    validateContact({ ...good(), sender: 'Ada\r\nBcc: x@example.test' }).ok,
    false
  )
  const normal = validateContact({
    ...good(),
    recruiting: false,
    fromCompany: 'unexpected',
    salaryLower: 1
  })
  assert.equal(normal.ok, true)
  if (normal.ok) assert.equal('fromCompany' in normal.value, false)
  assert.equal(
    validateContact({
      ...good(),
      recruiting: true,
      jobSource: 'agency',
      fromCompany: 'Company',
      fromAgency: '',
      role: 'sre',
      employmentType: 'fullEmployee',
      salaryLower: 2_000_000,
      salaryUpper: 10_000_000,

      salaryBasis: 'base',
      workArrangement: 'remote',

      benefitFlexibleHours: false,
      benefitOther: false
    }).ok,
    false
  )
})

test('validates recruiter enums and formats annual salary details', () => {
  const parsed = validateContact({
    ...good(),
    recruiting: true,
    jobSource: 'agency',
    fromCompany: 'Example Co',
    fromAgency: 'Example Agency',
    role: 'security',
    employmentType: 'fullEmployee',
    salaryLower: 2_000_000,
    salaryUpper: 10_000_000,

    salaryBasis: 'base',
    workArrangement: 'remote',

    benefitFlexibleHours: false,
    benefitOther: false
  })
  assert.equal(parsed.ok, true)
  if (parsed.ok) {
    const text = formatContactMessage(parsed.value)
    assert.match(text, /Company: Example Co/)
    assert.match(text, /Agency: Example Agency/)
    assert.match(text, /Annual base salary: JPY 2,000,000–10,000,000/)
    assert.match(text, /Work arrangement: Remote/)
  }
})

test('local stub accepts the request without invoking mail or requiring secrets', async () => {
  let sent = false
  const response = await handleContact(
    request(good(), { url: 'http://localhost:8787/api/contact' }),
    env({
      LOCAL_CONTACT_STUB: 'true',
      MAIL: {
        send: async () => {
          sent = true
          return { messageId: 'x' }
        }
      },
      TURNSTILE_SECRET: undefined,
      TO_EMAIL: undefined
    }) as never
  )
  assert.equal(response.status, 202)
  assert.equal(sent, false)
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow')
})

test('local stub cannot be enabled for a deployed hostname', async () => {
  const response = await handleContact(
    request(good(), { url: 'https://preview.example.test/api/contact' }),
    env({ LOCAL_CONTACT_STUB: 'true', TURNSTILE_SECRET: undefined }) as never
  )
  assert.equal(response.status, 403)
})

test('rate limits before Siteverify, and Turnstile fails closed for rejected host/action and timeout', async () => {
  const original = globalThis.fetch
  let calls = 0
  globalThis.fetch = async () => {
    calls++
    return Response.json({
      success: true,
      action: 'contact',
      hostname: 'preview.example.test'
    })
  }
  try {
    const rateLimited = await handleContact(
      request({ ...good(), turnstileToken: 'token' }),
      env({
        RATE_LIMITER: { limit: async () => ({ success: false }) }
      }) as never
    )
    assert.equal(rateLimited.status, 429)
    assert.equal(rateLimited.headers.get('retry-after'), '60')
    assert.equal(calls, 0)
    const wrongHost = await handleContact(
      request({ ...good(), turnstileToken: 'token' }),
      env({ TURNSTILE_HOSTNAMES: 'other.example.test' }) as never
    )
    assert.equal(wrongHost.status, 403)
    globalThis.fetch = async () => {
      throw new Error('timeout')
    }
    const timeout = await handleContact(
      request({ ...good(), turnstileToken: 'token' }),
      env() as never
    )
    assert.equal(timeout.status, 403)
    const missing = await handleContact(
      request({ ...good(), turnstileToken: 'token' }),
      env({ TURNSTILE_SECRET: undefined }) as never
    )
    assert.equal(missing.status, 403)
  } finally {
    globalThis.fetch = original
  }
})

test('waits for native mail acceptance, keeps recipient out of response, and handles binding errors generically', async () => {
  const original = globalThis.fetch
  globalThis.fetch = async () =>
    Response.json({
      success: true,
      action: 'contact',
      hostname: 'preview.example.test'
    })
  let submitted: Record<string, unknown> | undefined
  try {
    const sent = await handleContact(
      request({ ...good(), turnstileToken: 'one-time-token' }),
      env({
        MAIL: {
          send: async (message: Record<string, unknown>) => {
            submitted = message
            return { messageId: 'private-id' }
          }
        }
      }) as never
    )
    assert.equal(sent.status, 202)
    const body = await sent.text()
    assert.equal(body.includes('private@example.test'), false)
    assert.equal(body.includes('private-id'), false)
    assert.deepEqual(submitted?.replyTo, 'ada@example.test')
    assert.deepEqual(submitted?.subject, '[Website Contact] Message')
    const failed = await handleContact(
      request({ ...good(), turnstileToken: 'another-token' }),
      env({
        MAIL: {
          send: async () => {
            throw new Error('provider detail')
          }
        }
      }) as never
    )
    assert.equal(failed.status, 502)
    assert.equal((await failed.text()).includes('provider detail'), false)
  } finally {
    globalThis.fetch = original
  }
})

test('rejects header delimiters, malformed token types, invalid enums and salary bounds', () => {
  for (const email of [
    'a,b@example.test',
    'Ada <ada@example.test>',
    'ada@example.test\r\nBcc: x@example.test',
    '.ada@example.test'
  ]) {
    assert.equal(validateContact({ ...good(), email }).ok, false)
  }
  for (const turnstileToken of ['', 123, 'x'.repeat(2049)])
    assert.equal(validateContact({ ...good(), turnstileToken }).ok, false)
  const recruiting = {
    ...good(),
    recruiting: true,
    jobSource: 'company',
    fromCompany: 'Example',
    role: 'sre',
    employmentType: 'fullEmployee',
    salaryLower: 2_000_000,
    salaryUpper: 10_000_000,

    salaryBasis: 'base',
    workArrangement: 'remote',

    benefitFlexibleHours: false,
    benefitOther: false
  }
  for (const patch of [
    { role: 'invalid' },
    { salaryLower: 0 },
    { salaryUpper: Infinity },
    { salaryUpper: 1_000_000 },
    { salaryLower: NaN },
    { workArrangement: 'remote,hybrid' },
    { salaryBasis: 'unknown' },
    { benefitOther: 'false' }
  ])
    assert.equal(validateContact({ ...recruiting, ...patch }).ok, false)
  const parsed = validateContact({
    ...recruiting,
    fromAgency: 'Inactive agency'
  })
  assert.equal(parsed.ok, true)
  if (parsed.ok) assert.equal('fromAgency' in parsed.value, false)
})

test('accepts bounded Japanese content without relying on a declared length', async () => {
  const response = await handleContact(
    request(
      { ...good(), sender: '日'.repeat(100), message: '日'.repeat(5000) },
      { url: 'http://127.0.0.1:8787/api/contact' }
    ),
    env({ LOCAL_CONTACT_STUB: 'true' }) as never
  )
  assert.equal(response.status, 202)
})

test('rejects failed or malformed Siteverify responses and wrong actions without sending', async () => {
  const original = globalThis.fetch
  let sent = false
  const testEnv = env({
    MAIL: {
      send: async () => {
        sent = true
        return { messageId: 'x' }
      }
    }
  })
  try {
    for (const result of [
      { success: false, action: 'contact', hostname: 'preview.example.test' },
      { success: true, action: 'login', hostname: 'preview.example.test' },
      null
    ]) {
      globalThis.fetch = async () => Response.json(result)
      assert.equal(
        (
          await handleContact(
            request({ ...good(), turnstileToken: 'test-token' }),
            testEnv as never
          )
        ).status,
        403
      )
    }
    globalThis.fetch = async () => new Response('unavailable', { status: 503 })
    assert.equal(
      (
        await handleContact(
          request({ ...good(), turnstileToken: 'test-token' }),
          testEnv as never
        )
      ).status,
      403
    )
    assert.equal(sent, false)
  } finally {
    globalThis.fetch = original
  }
})

test('missing delivery settings and rate-limit errors fail closed', async () => {
  const original = globalThis.fetch
  globalThis.fetch = async () =>
    Response.json({
      success: true,
      action: 'contact',
      hostname: 'preview.example.test'
    })
  try {
    assert.equal(
      (
        await handleContact(
          request({ ...good(), turnstileToken: 'test-token' }),
          env({ TO_EMAIL: undefined }) as never
        )
      ).status,
      503
    )
    assert.equal(
      (
        await handleContact(
          request({ ...good(), turnstileToken: 'test-token' }),
          env({
            RATE_LIMITER: {
              limit: async () => {
                throw new Error('private provider detail')
              }
            }
          }) as never
        )
      ).status,
      503
    )
  } finally {
    globalThis.fetch = original
  }
})

test('does not report success until the mail binding settles', async () => {
  const original = globalThis.fetch
  globalThis.fetch = async () =>
    Response.json({
      success: true,
      action: 'contact',
      hostname: 'preview.example.test'
    })
  let accept!: (value: { messageId: string }) => void
  const pending = new Promise<{ messageId: string }>((resolve) => {
    accept = resolve
  })
  let settled = false
  try {
    const response = handleContact(
      request({ ...good(), turnstileToken: 'test-token' }),
      env({ MAIL: { send: () => pending } }) as never
    ).then((result) => {
      settled = true
      return result
    })
    await new Promise((resolve) => setImmediate(resolve))
    assert.equal(settled, false)
    accept({ messageId: 'private-id' })
    assert.equal((await response).status, 202)
  } finally {
    globalThis.fetch = original
  }
})

test('API misses are JSON and HEAD 404 responses have no body', async () => {
  const missing = await worker.fetch(
    new Request('https://preview.example.test/api'),
    env() as never,
    {} as never
  )
  assert.equal(missing.status, 404)
  assert.match(missing.headers.get('content-type') ?? '', /application\/json/)
  const assets = {
    fetch: async (request: Request) =>
      new URL(request.url).pathname === '/ja/not-found/'
        ? new Response('Japanese page', { headers: { etag: 'static-page' } })
        : new Response(null, { status: 404 })
  }
  const head = await worker.fetch(
    new Request('https://preview.example.test/ja/missing/', { method: 'HEAD' }),
    { ASSETS: assets } as never,
    {} as never
  )
  assert.equal(head.status, 404)
  assert.equal(await head.text(), '')
  assert.equal(head.headers.has('etag'), false)
})

test('aborts a stalled verification request at the server deadline', async () => {
  const original = globalThis.fetch
  let aborted = false
  globalThis.fetch = async (_input, options) =>
    new Promise((_resolve, reject) => {
      options?.signal?.addEventListener(
        'abort',
        () => {
          aborted = true
          reject(new Error('aborted'))
        },
        { once: true }
      )
    })
  try {
    const response = await handleContact(
      request({ ...good(), turnstileToken: 'test-token' }),
      env() as never
    )
    assert.equal(response.status, 403)
    assert.equal(aborted, true)
  } finally {
    globalThis.fetch = original
  }
})

const recruiter = () => ({
  ...good(),
  recruiting: true,
  jobSource: 'company',
  fromCompany: 'Example Co',
  role: 'sre',
  employmentType: 'fullEmployee',

  salaryBasis: 'base',
  salaryLower: 8_000_000,
  salaryUpper: 10_000_000
})

test('requires explicit salary amounts and basis, allows fixed pay, and rejects undisclosed salary data', () => {
  const blank = validateContact({
    ...recruiter(),
    salaryLower: undefined,
    salaryUpper: undefined,
    salaryBasis: ''
  })
  assert.equal(blank.ok, false)
  if (!blank.ok)
    assert.deepEqual(blank.fields, {
      salaryBasis: 'required',
      salaryLower: 'required',
      salaryUpper: 'required'
    })
  assert.equal(
    validateContact({ ...recruiter(), salaryUpper: 8_000_000 }).ok,
    true
  )
  for (const patch of [
    {
      salaryDisclosure: 'undisclosed',
      salaryLower: undefined,
      salaryUpper: undefined
    },
    { salaryBasis: undefined, salaryLower: undefined, salaryUpper: undefined },
    { salaryLower: '8,000,000' },
    { salaryUpper: 10_000_000.5 }
  ])
    assert.equal(validateContact({ ...recruiter(), ...patch }).ok, false)
})

test('accepts optional job details, formats compensation basis, and rejects unsafe URLs and oversized details', () => {
  const parsed = validateContact({
    ...recruiter(),
    salaryBasis: 'total',
    jobTitle: 'SRE Lead',
    jobUrl: 'https://example.test/jobs/123',
    jobLocation: 'Tokyo / JST',
    workArrangement: 'hybrid'
  })
  assert.equal(parsed.ok, true)
  if (parsed.ok) {
    const text = formatContactMessage(parsed.value)
    assert.match(text, /Annual total compensation: JPY 8,000,000–10,000,000/)
    assert.match(text, /Job title: SRE Lead/)
    assert.match(text, /Job posting: https:\/\/example.test\/jobs\/123/)
    assert.match(text, /Location: Tokyo \/ JST/)
    assert.match(text, /Work arrangement: Hybrid/)
  }
  for (const jobUrl of [
    'javascript:alert(1)',
    'ftp://example.test/job',
    '/jobs/1',
    'https://user:password@example.test/job',
    'https://example.test/\nBcc: x@example.test',
    'https://example.test/' + 'x'.repeat(2048)
  ]) {
    const result = validateContact({ ...recruiter(), jobUrl })
    assert.equal(result.ok, false, jobUrl)
    if (!result.ok) assert.equal(result.fields.jobUrl, 'url')
  }
  for (const key of ['jobTitle', 'jobLocation'])
    assert.equal(
      validateContact({ ...recruiter(), [key]: 'x'.repeat(161) }).ok,
      false
    )
  const inactive = validateContact({
    ...good(),
    jobTitle: 'Ignored',
    jobUrl: 'javascript:alert(1)',
    workArrangement: 'wrong'
  })
  assert.equal(inactive.ok, true)
  if (inactive.ok) assert.equal('jobUrl' in inactive.value, false)
})

test('reports all field errors together for client correction', () => {
  const result = validateContact({
    ...recruiter(),
    sender: '',
    email: 'bad',
    message: '',
    consent: false,
    jobSource: 'agency',
    fromAgency: '',
    salaryUpper: 1_000_000
  })
  assert.equal(result.ok, false)
  if (!result.ok)
    assert.deepEqual(result.fields, {
      sender: 'required',
      email: 'email',
      message: 'required',
      consent: 'consent',
      fromAgency: 'required',
      salaryUpper: 'salary_order'
    })
})

test('new recruiting fields reach the mail binding through the API without exposing the recipient', async () => {
  const original = globalThis.fetch
  globalThis.fetch = async () =>
    Response.json({
      success: true,
      action: 'contact',
      hostname: 'preview.example.test'
    })
  let text = ''
  try {
    const response = await handleContact(
      request({
        ...recruiter(),
        jobTitle: 'SRE',
        jobUrl: 'https://example.test/job',
        workArrangement: 'onsite',
        turnstileToken: 'one-time-token'
      }),
      env({
        MAIL: {
          send: async (mail: { text: string }) => {
            text = mail.text
            return { messageId: 'x' }
          }
        }
      }) as never
    )
    assert.equal(response.status, 202)
    assert.match(text, /Job title: SRE/)
    assert.match(text, /Work arrangement: Onsite/)
    assert.match(text, /Annual base salary: JPY 8,000,000–10,000,000/)
    assert.doesNotMatch(await response.text(), /private@example.test/)
  } finally {
    globalThis.fetch = original
  }
})
