import {
  EMAIL_PATTERN,
  formatContactMessage,
  type ContactSubmission
} from '../lib/contact-schema.ts'

// The provider-specific boundary. The recipient never enters a response or client import.
export async function sendContactEmail(
  env: Env,
  submission: ContactSubmission
): Promise<void> {
  if (
    !env.MAIL ||
    !env.FROM_EMAIL ||
    !env.TO_EMAIL ||
    !EMAIL_PATTERN.test(env.FROM_EMAIL) ||
    !EMAIL_PATTERN.test(env.TO_EMAIL)
  ) {
    throw new Error('Email configuration unavailable')
  }
  await env.MAIL.send({
    from: { email: env.FROM_EMAIL, name: 'Website Contact' },
    to: env.TO_EMAIL,
    replyTo: submission.email,
    subject: `[Website Contact] ${submission.recruiting ? 'Recruiting inquiry' : 'Message'}`,
    text: formatContactMessage(submission)
  })
}
