export type ContactSubmission = {
  sender: string
  email: string
  message: string
  consent: true
  recruiting?: boolean
  jobSource?: 'company' | 'agency'
  fromCompany?: string
  fromAgency?: string
  role?: 'sre' | 'security' | 'devops' | 'roleOther'
  employmentType?: 'fullEmployee'
  salaryBasis?: 'base' | 'total'
  salaryLower?: number
  salaryUpper?: number
  workArrangement?: 'remote' | 'hybrid' | 'onsite' | 'unspecified'
  jobTitle?: string
  jobUrl?: string
  jobLocation?: string
  benefitFlexibleHours?: boolean
  benefitOther?: boolean
  website?: string
  turnstileToken?: string
}

export type FieldErrorCode =
  | 'required'
  | 'invalid'
  | 'email'
  | 'consent'
  | 'salary_bounds'
  | 'salary_order'
  | 'url'
export type FieldErrors = Record<string, FieldErrorCode>
export type ValidationResult =
  | { ok: true; value: ContactSubmission }
  | { ok: false; error: string; fields: FieldErrors }

// A practical mailbox address, excluding display names and header delimiters.
export const EMAIL_PATTERN =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/

const cleanText = (
  value: unknown,
  max: number,
  multiline = false
): string | null => {
  if (typeof value !== 'string') return null
  const normalized = value.normalize('NFC').replace(/\r\n?/g, '\n').trim()
  if (
    !normalized ||
    normalized.length > max ||
    (multiline
      ? /[\u0000-\u0008\u000B-\u001F\u007F]/
      : /[\u0000-\u001F\u007F]/
    ).test(normalized)
  )
    return null
  return normalized
}

const finiteSalary = (value: unknown): value is number =>
  typeof value === 'number' &&
  Number.isSafeInteger(value) &&
  value >= 1_000_000 &&
  value <= 30_000_000

export function validateContact(input: unknown): ValidationResult {
  const fields: FieldErrors = {}
  const invalid = (): ValidationResult => ({
    ok: false,
    error: 'invalid',
    fields
  })
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    fields.form = 'invalid'
    return invalid()
  }
  const raw = input as Record<string, unknown>
  const allowedFields = new Set([
    'sender',
    'email',
    'message',
    'consent',
    'recruiting',
    'jobSource',
    'fromCompany',
    'fromAgency',
    'role',
    'employmentType',
    'salaryBasis',
    'salaryLower',
    'salaryUpper',
    'workArrangement',
    'jobTitle',
    'jobUrl',
    'jobLocation',
    'benefitFlexibleHours',
    'benefitOther',
    'website',
    'turnstileToken'
  ])
  if (Object.keys(raw).some((key) => !allowedFields.has(key)))
    fields.form = 'invalid'
  const requiredText = (key: string, max: number, multiline = false) => {
    const text = cleanText(raw[key], max, multiline)
    if (!text)
      fields[key] =
        typeof raw[key] !== 'string' || !raw[key].trim()
          ? 'required'
          : 'invalid'
    return text ?? ''
  }
  const sender = requiredText('sender', 100)
  const email = requiredText('email', 254)
  if (email && !EMAIL_PATTERN.test(email)) fields.email = 'email'
  const message = requiredText('message', 5000, true)
  if (raw.consent !== true) fields.consent = 'consent'
  if (raw.recruiting !== undefined && typeof raw.recruiting !== 'boolean')
    fields.recruiting = 'invalid'
  const value: ContactSubmission = { sender, email, message, consent: true }
  if (raw.recruiting === true) {
    if (raw.jobSource !== 'company' && raw.jobSource !== 'agency')
      fields.jobSource = 'invalid'
    value.recruiting = true
    value.jobSource = raw.jobSource as ContactSubmission['jobSource']
    value.fromCompany = requiredText('fromCompany', 160)
    if (raw.jobSource === 'agency')
      value.fromAgency = requiredText('fromAgency', 160)
    if (
      typeof raw.role !== 'string' ||
      !['sre', 'security', 'devops', 'roleOther'].includes(raw.role)
    )
      fields.role = raw.role ? 'invalid' : 'required'
    value.role = raw.role as ContactSubmission['role']
    if (raw.employmentType !== 'fullEmployee') fields.form = 'invalid'
    value.employmentType = 'fullEmployee'
    if (raw.salaryBasis !== 'base' && raw.salaryBasis !== 'total')
      fields.salaryBasis = raw.salaryBasis ? 'invalid' : 'required'
    value.salaryBasis = raw.salaryBasis as ContactSubmission['salaryBasis']
    for (const key of ['salaryLower', 'salaryUpper'] as const) {
      if (!finiteSalary(raw[key]))
        fields[key] =
          raw[key] === undefined || raw[key] === ''
            ? 'required'
            : 'salary_bounds'
      else value[key] = raw[key]
    }
    if (
      value.salaryLower !== undefined &&
      value.salaryUpper !== undefined &&
      value.salaryUpper < value.salaryLower
    )
      fields.salaryUpper = 'salary_order'
    if (
      raw.workArrangement !== undefined &&
      (typeof raw.workArrangement !== 'string' ||
        !['remote', 'hybrid', 'onsite', 'unspecified'].includes(
          raw.workArrangement
        ))
    )
      fields.workArrangement = 'invalid'
    value.workArrangement = (raw.workArrangement ??
      'unspecified') as ContactSubmission['workArrangement']
    for (const [key, max] of [
      ['jobTitle', 160],
      ['jobUrl', 2048],
      ['jobLocation', 160]
    ] as const) {
      if (
        raw[key] === undefined ||
        (typeof raw[key] === 'string' && !raw[key].trim())
      )
        continue
      const text = cleanText(raw[key], max)
      if (!text) {
        fields[key] = key === 'jobUrl' ? 'url' : 'invalid'
        continue
      }
      if (key === 'jobUrl') {
        try {
          const url = new URL(text)
          if (
            !/^https?:\/\//i.test(text) ||
            !['http:', 'https:'].includes(url.protocol) ||
            url.username ||
            url.password
          )
            throw new Error('invalid')
        } catch {
          fields.jobUrl = 'url'
          continue
        }
      }
      value[key] = text
    }
    for (const key of ['benefitFlexibleHours', 'benefitOther'] as const) {
      if (raw[key] !== undefined && typeof raw[key] !== 'boolean')
        fields[key] = 'invalid'
      else value[key] = raw[key] === true
    }
  }
  if (
    raw.website !== undefined &&
    (typeof raw.website !== 'string' || raw.website.length > 200)
  )
    fields.form = 'invalid'
  if (
    raw.turnstileToken !== undefined &&
    (typeof raw.turnstileToken !== 'string' ||
      raw.turnstileToken.length < 1 ||
      raw.turnstileToken.length > 2048)
  )
    fields.form = 'invalid'
  if (typeof raw.website === 'string') value.website = raw.website
  if (typeof raw.turnstileToken === 'string')
    value.turnstileToken = raw.turnstileToken
  return Object.keys(fields).length ? invalid() : { ok: true, value }
}

export function formatContactMessage(value: ContactSubmission): string {
  const lines = [
    `Name: ${value.sender}`,
    `Reply email: ${value.email}`,
    `Recruiting inquiry: ${value.recruiting ? 'yes' : 'no'}`
  ]
  if (value.recruiting) {
    lines.push(`Company: ${value.fromCompany}`, `Source: ${value.jobSource}`)
    if (value.fromAgency) lines.push(`Agency: ${value.fromAgency}`)
    lines.push(`Role category: ${value.role}`, 'Employment: full-time')
    if (value.jobTitle) lines.push(`Job title: ${value.jobTitle}`)
    if (value.jobUrl) lines.push(`Job posting: ${value.jobUrl}`)
    if (value.jobLocation) lines.push(`Location: ${value.jobLocation}`)
    const arrangements = {
      remote: 'Remote',
      hybrid: 'Hybrid',
      onsite: 'Onsite',
      unspecified: 'Not specified'
    }
    lines.push(
      `Work arrangement: ${arrangements[value.workArrangement ?? 'unspecified']}`
    )
    lines.push(
      `Annual ${value.salaryBasis === 'base' ? 'base salary' : 'total compensation'}: JPY ${value.salaryLower?.toLocaleString('en-US')}–${value.salaryUpper?.toLocaleString('en-US')}`
    )
    const benefits = [
      value.benefitFlexibleHours && 'Flexible hours',
      value.benefitOther && 'Other (see message)'
    ].filter(Boolean)
    lines.push(`Benefits: ${benefits.join(', ') || 'Not specified'}`)
  }
  lines.push('', 'Message:', value.message)
  return lines.join('\n')
}
