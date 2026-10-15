import { validateContact } from './lib/contact-schema.ts'
import { sendContactEmail } from './server/cloudflare-email.ts'

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-robots-tag': 'noindex, nofollow',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin'
}
const fail = (status: number) =>
  new Response(JSON.stringify({ ok: false, error: 'contact_unavailable' }), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...(status === 405 ? { allow: 'POST' } : {}),
      ...(status === 429 ? { 'retry-after': '60' } : {})
    }
  })

type ContactEnv = Env

async function readBoundedJson(
  request: Request
): Promise<{ ok: true; value: unknown } | { ok: false; tooLarge: boolean }> {
  const declared = Number(request.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > 32_768)
    return { ok: false, tooLarge: true }
  if (!request.body) return { ok: false, tooLarge: false }
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 32_768) {
        await reader.cancel()
        return { ok: false, tooLarge: true }
      }
      chunks.push(value)
    }
  } catch {
    return { ok: false, tooLarge: false }
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  try {
    return {
      ok: true,
      value: JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
    }
  } catch {
    return { ok: false, tooLarge: false }
  }
}

async function verifyTurnstile(
  token: string,
  request: Request,
  env: ContactEnv
): Promise<boolean> {
  if (!env.TURNSTILE_SECRET || !env.TURNSTILE_HOSTNAMES) return false
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 4_000)
  try {
    const form = new URLSearchParams({
      secret: env.TURNSTILE_SECRET,
      response: token
    })
    const ip = request.headers.get('CF-Connecting-IP')
    if (ip) form.set('remoteip', ip)
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: form,
        signal: controller.signal
      }
    )
    if (!response.ok) return false
    const result = (await response.json()) as {
      success?: boolean
      action?: string
      hostname?: string
    }
    const allowed = env.TURNSTILE_HOSTNAMES.split(',')
      .map((host) => host.trim())
      .filter(Boolean)
    return (
      result.success === true &&
      result.action === 'contact' &&
      typeof result.hostname === 'string' &&
      allowed.includes(result.hostname)
    )
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

export async function handleContact(
  request: Request,
  env: ContactEnv
): Promise<Response> {
  const url = new URL(request.url)
  if (request.method !== 'POST') return fail(405)
  if (
    request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !==
    'application/json'
  )
    return fail(415)
  const origin = request.headers.get('origin')
  if (!origin || origin !== url.origin) return fail(403)

  const input = await readBoundedJson(request)
  if (!input.ok) return fail(input.tooLarge ? 413 : 400)
  const parsed = validateContact(input.value)
  if (!parsed.ok) return fail(400)
  const local =
    env.LOCAL_CONTACT_STUB === 'true' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if (parsed.value.website)
    return new Response(JSON.stringify({ ok: true }), {
      status: 202,
      headers: JSON_HEADERS
    })

  if (!local) {
    const ip = request.headers.get('CF-Connecting-IP')
    if (!ip || !env.RATE_LIMITER) return fail(503)
    try {
      const limited = await env.RATE_LIMITER.limit({ key: ip })
      if (!limited.success) return fail(429)
    } catch {
      return fail(503)
    }
    if (
      !parsed.value.turnstileToken ||
      !(await verifyTurnstile(parsed.value.turnstileToken, request, env))
    )
      return fail(403)
  }

  if (local)
    return new Response(JSON.stringify({ ok: true, localStub: true }), {
      status: 202,
      headers: JSON_HEADERS
    })
  if (!env.MAIL || !env.FROM_EMAIL || !env.TO_EMAIL) return fail(503)
  try {
    await sendContactEmail(env, parsed.value)
    return new Response(JSON.stringify({ ok: true }), {
      status: 202,
      headers: JSON_HEADERS
    })
  } catch {
    return fail(502)
  }
}

export default {
  async fetch(request: Request, env: ContactEnv): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/api/contact') return handleContact(request, env)
    if (url.pathname === '/api' || url.pathname.startsWith('/api/'))
      return fail(404)
    const asset = await env.ASSETS.fetch(request)
    if (asset.status !== 404) return asset
    const locale = url.pathname.startsWith('/ja/') ? 'ja' : 'en'
    const localized = await env.ASSETS.fetch(
      new Request(new URL(`/${locale}/not-found/`, url))
    )
    if (!localized.ok) return asset
    const headers = new Headers(localized.headers)
    headers.set('x-robots-tag', 'noindex, nofollow')
    headers.delete('etag')
    headers.set('cache-control', 'no-store')
    return new Response(request.method === 'HEAD' ? null : localized.body, {
      status: 404,
      statusText: 'Not Found',
      headers
    })
  }
} satisfies ExportedHandler<ContactEnv>
