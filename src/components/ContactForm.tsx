import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type SubmitEvent
} from 'react'
import { validateContact, type FieldErrors } from '../lib/contact-schema'
import type en from '../../messages/en.json'

type ContactMessages = typeof en.Contact
type ContactValues = {
  sender: string
  email: string
  message: string
  recruiting: boolean
  jobSource: 'company' | 'agency'
  fromCompany: string
  fromAgency: string
  role: string
  salaryBasis: '' | 'base' | 'total'
  salaryLower: string
  salaryUpper: string
  workArrangement: 'remote' | 'hybrid' | 'onsite' | 'unspecified'
  jobTitle: string
  jobUrl: string
  jobLocation: string
  benefitFlexibleHours: boolean
  benefitOther: boolean
  consent: boolean
}
type Props = {
  locale: 'en' | 'ja'
  messages: ContactMessages
  isHireMe: boolean
  sitekey: string
}

const INITIAL: ContactValues = {
  sender: '',
  email: '',
  message: '',
  recruiting: false,
  jobSource: 'company',
  fromCompany: '',
  fromAgency: '',
  role: '',
  salaryBasis: '',
  salaryLower: '',
  salaryUpper: '',
  workArrangement: 'unspecified',
  jobTitle: '',
  jobUrl: '',
  jobLocation: '',
  benefitFlexibleHours: false,
  benefitOther: false,
  consent: false
}

// Keep the stored value numeric while formatting the editable text with commas.
function SalaryInput({
  value,
  onValueChange,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  value: string
  onValueChange: (value: string) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const caretDigits = useRef<number | null>(null)
  const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  useLayoutEffect(() => {
    if (caretDigits.current === null || !input.current) return
    let position = 0
    let remaining = caretDigits.current
    while (position < formatted.length && remaining > 0) {
      if (formatted[position] !== ',') remaining--
      position++
    }
    input.current.setSelectionRange(position, position)
    caretDigits.current = null
  })
  return (
    <input
      {...props}
      ref={input}
      type="text"
      inputMode="numeric"
      maxLength={14}
      value={formatted}
      onChange={(event) => {
        const text = event.currentTarget.value
        if (!/^[0-9,]*$/.test(text)) return
        caretDigits.current = text
          .slice(0, event.currentTarget.selectionStart ?? text.length)
          .replace(/,/g, '').length
        onValueChange(text.replace(/,/g, ''))
      }}
    />
  )
}

export default function ContactForm({
  locale,
  messages: t,
  isHireMe,
  sitekey
}: Props) {
  const [values, setValues] = useState<ContactValues>({
    ...INITIAL,
    recruiting: isHireMe
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  )
  const [widgetReady, setWidgetReady] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const formRef = useRef<HTMLFormElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const focusError = useRef(false)
  const widget = useRef<string | number | null>(null)
  const tokenRef = useRef('')
  const inFlight = useRef(false)
  const hireMe = useRef(isHireMe)
  const [local, setLocal] = useState(false)
  const [verificationError, setVerificationError] = useState(false)
  useEffect(() => {
    setLocal(
      ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
    )
    hireMe.current =
      isHireMe || new URLSearchParams(window.location.search).has('hireme')
    if (hireMe.current) {
      setValues((current) => ({ ...current, recruiting: true }))
    }
  }, [isHireMe])
  const payloadFor = (current: ContactValues) => ({
    sender: current.sender,
    email: current.email,
    message: current.message,
    consent: current.consent,
    ...(current.recruiting
      ? {
          recruiting: true,
          jobSource: current.jobSource,
          fromCompany: current.fromCompany,
          ...(current.jobSource === 'agency'
            ? { fromAgency: current.fromAgency }
            : {}),
          role: current.role,
          employmentType: 'fullEmployee',
          salaryBasis: current.salaryBasis,
          salaryLower:
            current.salaryLower === ''
              ? undefined
              : Number(current.salaryLower),
          salaryUpper:
            current.salaryUpper === ''
              ? undefined
              : Number(current.salaryUpper),
          workArrangement: current.workArrangement,
          jobTitle: current.jobTitle.trim(),
          jobUrl: current.jobUrl.trim(),
          jobLocation: current.jobLocation.trim(),
          benefitFlexibleHours: current.benefitFlexibleHours,
          benefitOther: current.benefitOther
        }
      : {})
  })
  const updateValue = (name: string, value: string | boolean) => {
    const next = { ...values, [name]: value } as ContactValues
    setStatus('idle')
    setValues(next)
    const result = validateContact(payloadFor(next))
    // Recheck previously reported errors, including dependent and hidden fields.
    setErrors((current) =>
      Object.fromEntries(
        Object.keys(current)
          .filter((key) => !result.ok && result.fields[key])
          .map((key) => [key, !result.ok ? result.fields[key]! : 'invalid'])
      )
    )
  }
  const update = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = event.target
    updateValue(
      name,
      type === 'checkbox' && 'checked' in event.target
        ? event.target.checked
        : value
    )
  }

  useEffect(() => {
    if (!focusError.current) return
    focusError.current = false
    const invalid = formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"], [data-form-error]')
    const disclosure = invalid?.closest('details')
    if (disclosure) disclosure.open = true
    invalid?.focus()
  }, [errors])

  useEffect(() => {
    if (status !== 'idle') {
      feedbackRef.current?.scrollIntoView({ block: 'nearest' })
    }
  }, [status])

  useEffect(() => {
    if (!sitekey) return
    let active = true
    const mount = () => {
      if (
        !active ||
        !window.turnstile ||
        !document.querySelector('#turnstile-widget')
      )
        return
      try {
        widget.current = window.turnstile.render('#turnstile-widget', {
          sitekey,
          action: 'contact',
          language: locale,
          // The compact widget fits narrow forms without scaling its controls.
          size: 'compact',
          callback: (next) => {
            tokenRef.current = next
            setWidgetReady(true)
            setVerificationError(false)
          },
          'expired-callback': () => {
            tokenRef.current = ''
            setWidgetReady(false)
            if (widget.current !== null) window.turnstile?.reset(widget.current)
          },
          'error-callback': () => {
            tokenRef.current = ''
            setWidgetReady(false)
            setVerificationError(true)
          }
        })
      } catch {
        setVerificationError(true)
      }
    }
    if (window.turnstile) mount()
    else {
      const script = document.createElement('script')
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.onload = mount
      script.onerror = () => {
        if (active) setVerificationError(true)
      }
      document.head.appendChild(script)
    }
    return () => {
      active = false
      if (widget.current !== null && window.turnstile)
        window.turnstile.remove(widget.current)
    }
  }, [sitekey, locale])

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inFlight.current) return
    const result = validateContact({
      ...payloadFor(values),
      website: String(new FormData(event.currentTarget).get('website') || ''),
      ...(tokenRef.current ? { turnstileToken: tokenRef.current } : {})
    })
    if (!result.ok) {
      focusError.current = true
      setErrors(result.fields)
      return
    }
    setErrors({})
    if (!local && sitekey && !tokenRef.current) {
      setStatus('error')
      return
    }
    const payload = result.value
    inFlight.current = true
    setStatus('sending')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      })
      const result: unknown = await response.json()
      if (
        response.status !== 202 ||
        !result ||
        typeof result !== 'object' ||
        !('ok' in result) ||
        result.ok !== true
      )
        throw new Error('request failed')
      setStatus('sent')
      setValues({ ...INITIAL, recruiting: hireMe.current })
    } catch {
      setStatus('error')
    } finally {
      clearTimeout(timeout)
      inFlight.current = false
      tokenRef.current = ''
      setWidgetReady(false)
      if (widget.current !== null && window.turnstile) {
        try {
          window.turnstile.reset(widget.current)
        } catch {
          setVerificationError(true)
        }
      }
    }
  }

  const fieldError = (name: string) =>
    errors[name] && (
      <span
        className="field-error"
        id={`${name}-error`}
        role="alert"
        {...(name === 'form' ? { tabIndex: -1, 'data-form-error': true } : {})}
      >
        {t.validation[errors[name]]}
      </span>
    )
  const errorProps = (name: string) => ({
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined
  })
  const marker = (required = false) => (
    <small className="field-marker">
      ({required ? t.required_label : t.optional_label})
    </small>
  )

  return (
    <form
      ref={formRef}
      className="contact-form"
      onSubmit={submit}
      noValidate
    >
      <fieldset
        className="form-fields"
        disabled={status === 'sending'}
        aria-busy={status === 'sending'}
      >
        <fieldset className="intent-picker">
          <legend>{t.intent_label}</legend>
          <div className="intent-options">
            <label><input type="radio" name="messageIntent" checked={!values.recruiting} onChange={() => updateValue('recruiting', false)} /><span>{t.general_message}</span></label>
            <label><input type="radio" name="messageIntent" checked={values.recruiting} onChange={() => updateValue('recruiting', true)} /><span>{t.role_message}</span></label>
          </div>
        </fieldset>
        <div className="identity-fields">
          <label>
            <span>
              {t.labels.name} {marker(true)}
            </span>
            <input
              name="sender"
              aria-describedby={errors.sender ? 'sender-error' : undefined}
              value={values.sender}
              onChange={update}
              autoComplete="name"
              required
              maxLength={100}
              aria-invalid={Boolean(errors.sender)}
            />
            {fieldError('sender')}
          </label>
          <label>
            <span>
              {t.labels.email} {marker(true)}
            </span>
            <input
              name="email"
              aria-describedby={
                errors.email ? 'email-helper email-error' : 'email-helper'
              }
              type="email"
              value={values.email}
              onChange={update}
              autoComplete="email"
              required
              maxLength={254}
              aria-invalid={Boolean(errors.email)}
            />
            {fieldError('email')}
            <small id="email-helper">{t.validation.email_helper}</small>
          </label>
        </div>
        <label>
          <span>
            {t.labels.message} {marker(true)}
          </span>
          <textarea
            aria-invalid={Boolean(errors.message)}
            name="message"
            aria-describedby={errors.message ? 'message-error' : undefined}
            rows={7}
            value={values.message}
            onChange={update}
            required
            maxLength={5000}
          />
          {fieldError('message')}
        </label>
        {values.recruiting && (
          <fieldset className="recruiting-fields">
            <legend>{t.recruiting_details}</legend>
            <fieldset>
              <legend>
                {t.labels.job_source} {marker(true)}
              </legend>
              <div className="choice-row wrap">
                {(['company', 'agency'] as const).map((source) => (
                  <label key={source}>
                    <input
                      type="radio"
                      name="jobSource"
                      value={source}
                      checked={values.jobSource === source}
                      onChange={update}
                      required
                      {...errorProps('jobSource')}
                    />
                    {source === 'company'
                      ? t.labels.direct_hire
                      : t.labels.agency}
                  </label>
                ))}
              </div>
              {fieldError('jobSource')}
            </fieldset>
            {values.jobSource === 'agency' && (
              <label>
                <span>
                  {t.labels.agency_name} {marker(true)}
                </span>
                <input
                  name="fromAgency"
                  value={values.fromAgency}
                  onChange={update}
                  maxLength={160}
                  required
                  {...errorProps('fromAgency')}
                />
                {fieldError('fromAgency')}
              </label>
            )}
            <label>
              <span>
                {t.labels.company_name} {marker(true)}
              </span>
              <input
                name="fromCompany"
                value={values.fromCompany}
                onChange={update}
                maxLength={160}
                required
                {...errorProps('fromCompany')}
              />
              {fieldError('fromCompany')}
            </label>
            <label>
              <span>
                {t.labels.role_type} {marker(true)}
              </span>
              <select
                name="role"
                value={values.role}
                onChange={update}
                required
                {...errorProps('role')}
              >
                <option value="">{t.placeholders.select}</option>
                <option value="sre">{t.roles.sre}</option>
                <option value="security">{t.roles.security}</option>
                <option value="devops">{t.roles.devops}</option>
                <option value="roleOther">{t.roles.other}</option>
              </select>
              {fieldError('role')}
            </label>
            <p className="privacy-note">{t.employment.helper}</p>
            <fieldset>
              <legend>{t.labels.salary_range} (JPY)</legend>
              <label className="stacked-field">
                <span>
                  {t.labels.salary_basis} {marker(true)}
                </span>
                <select
                  name="salaryBasis"
                  value={values.salaryBasis}
                  onChange={update}
                  required
                  {...errorProps('salaryBasis')}
                >
                  <option value="">{t.placeholders.select}</option>
                  <option value="base">{t.salary.base}</option>
                  <option value="total">{t.salary.total}</option>
                </select>
                {fieldError('salaryBasis')}
              </label>
              <div className="salary-inputs">
                {(['salaryLower', 'salaryUpper'] as const).map((name) => (
                  <label key={name}>
                    <span>
                      {name === 'salaryLower' ? t.salary_lower : t.salary_upper}{' '}
                      {marker(true)}
                    </span>
                    <SalaryInput
                      name={name}
                      value={values[name]}
                      onValueChange={(value) => updateValue(name, value)}
                      required
                      {...errorProps(name)}
                    />
                    {fieldError(name)}
                  </label>
                ))}
              </div>
              <small>{t.salary.helper}</small>
            </fieldset>
            <details className="optional-fields">
              <summary>{t.additional_details}<span aria-hidden="true">+</span></summary>
              <div className="optional-fields-body">
                <label>
                  <span>
                    {t.labels.job_title} {marker()}
                  </span>
                  <input
                    name="jobTitle"
                    value={values.jobTitle}
                    onChange={update}
                    maxLength={160}
                    {...errorProps('jobTitle')}
                  />
                  {fieldError('jobTitle')}
                </label>
                <label>
                  <span>
                    {t.labels.job_url} {marker()}
                  </span>
                  <input
                    type="url"
                    name="jobUrl"
                    value={values.jobUrl}
                    onChange={update}
                    maxLength={2048}
                    placeholder="https://"
                    {...errorProps('jobUrl')}
                  />
                  {fieldError('jobUrl')}
                </label>
                <label>
                  <span>
                    {t.labels.work_arrangement} {marker()}
                  </span>
                  <select
                    name="workArrangement"
                    value={values.workArrangement}
                    onChange={update}
                    {...errorProps('workArrangement')}
                  >
                    {(['unspecified', 'remote', 'hybrid', 'onsite'] as const).map(
                      (key) => (
                        <option key={key} value={key}>
                          {t.work_arrangements[key]}
                        </option>
                      )
                    )}
                  </select>
                  {fieldError('workArrangement')}
                </label>
                <label>
                  <span>
                    {t.labels.job_location} {marker()}
                  </span>
                  <input
                    name="jobLocation"
                    value={values.jobLocation}
                    onChange={update}
                    maxLength={160}
                    {...errorProps('jobLocation')}
                  />
                  {fieldError('jobLocation')}
                </label>
                <fieldset>
                  <legend>
                    {t.labels.benefits} {marker()}
                  </legend>
                  <div className="choice-row wrap">
                    {(
                      [
                        ['benefitFlexibleHours', 'flexible_hours'],
                        ['benefitOther', 'other']
                      ] as const
                    ).map(([name, key]) => (
                      <label key={name}>
                        <input
                          type="checkbox"
                          name={name}
                          checked={values[name]}
                          onChange={update}
                        />
                        {t.benefits[key]}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </details>
          </fieldset>
        )}
        <div className="honeypot" aria-hidden="true">
          <label>
            Leave this field empty
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="consent-row">
          <input
            type="checkbox"
            aria-invalid={Boolean(errors.consent)}
            name="consent"
            aria-describedby={errors.consent ? 'consent-error' : undefined}
            checked={values.consent}
            onChange={update}
            required
          />
          <span>
            {t.privacy.consent} {marker(true)}
          </span>
        </label>
        {fieldError('consent')}
        <p className="privacy-note contact-privacy">{t.privacy.notice}</p>
        {fieldError('form')}
        {local && (
          <p className="privacy-note" role="status">
            {t.local_notice}
          </p>
        )}
        {verificationError && (
          <p role="alert" className="field-error">
            {t.verification_error}
          </p>
        )}
        {!local && sitekey && !widgetReady && !verificationError && (
          <p className="privacy-note" role="status" id="verification-progress">
            {t.verification_pending}
          </p>
        )}
        {!local && !sitekey && (
          <p role="status" className="privacy-note">
            {t.turnstile_pending}
          </p>
        )}
        <div className="contact-actions">
          {sitekey && (
            <div
              id="turnstile-widget"
              aria-label={locale === 'ja' ? 'ボット確認' : 'Bot verification'}
            />
          )}
          <button
            className="button"
            type="submit"
            aria-describedby={!local && sitekey && !widgetReady && !verificationError ? 'verification-progress' : undefined}
            disabled={
              status === 'sending' ||
              (!local && !sitekey) ||
              (!local && Boolean(sitekey) && !widgetReady)
            }
          >
            {status === 'sending'
              ? t.buttons.sending
              : status === 'sent'
                ? t.buttons.sent
                : status === 'error'
                  ? t.buttons.retry
                  : t.buttons.send}
          </button>
        </div>
      </fieldset>
      <div ref={feedbackRef} role="status" aria-live="polite" aria-atomic="true">
        {(status === 'sending' || status === 'sent') && (
          <div
            className={`form-status ${status === 'sent' ? 'success' : 'sending'}`}
          >
            <span className="status-icon" aria-hidden="true">
              {status === 'sending' ? (
                <span className="sending-spinner" />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 12 4 4 8-8" />
                </svg>
              )}
            </span>
            <div className="status-copy">
              <p className="status-title">
                {status === 'sending'
                  ? t.alerts.sending_title
                  : local
                    ? t.local_success
                    : t.alerts.success_title}
              </p>
              {(status === 'sending' || !local) && (
                <p className="status-description">
                  {status === 'sending'
                    ? t.alerts.sending_desc
                    : t.alerts.success_desc}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      {status === 'error' && (
        <p className="form-status error" role="alert">
          <strong>{t.alerts.error_title}</strong> {t.alerts.error_desc}
        </p>
      )}
      <noscript>
        <p className="privacy-note">{t.noscript}</p>
      </noscript>
    </form>
  )
}
