// Rendered outside of the [locale] segment, so there is no Chakra provider,
// no next-intl provider and no request scope. Everything here is plain React
// with inline styles, matching the site's light/dark palette (#f0e7db / #202023).

// Plain <a> tags on purpose: this file may not import anything but React, so
// next/link is unavailable here.
/* eslint-disable @next/next/no-html-link-for-pages */

const LINK_BASE = {
  display: 'inline-block',
  padding: '0.6rem 1.2rem',
  borderRadius: '0.375rem',
  backgroundColor: '#88ccca',
  color: '#202023',
  textDecoration: 'none',
  fontWeight: 700
}

const GlobalNotFound = () => (
  <html lang="en">
    <body
      style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0e7db',
        color: '#202023',
        fontFamily:
          "'M PLUS Rounded 1c', system-ui, -apple-system, 'Segoe UI', sans-serif"
      }}
    >
      <main style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>404</h1>
        <p style={{ fontSize: '1.25rem', margin: '0 0 0.25rem' }}>
          Page not found
        </p>
        <p lang="ja" style={{ fontSize: '1.25rem', margin: '0 0 1.5rem' }}>
          ページが見つかりません
        </p>
        <p style={{ margin: '0 0 1.5rem' }}>
          The page you&apos;ve landed on was not found.
        </p>
        <p lang="ja" style={{ margin: '0 0 2rem' }}>
          お探しのページは見つかりませんでした。
        </p>
        <a href="/en" style={LINK_BASE}>
          English
        </a>{' '}
        <a href="/ja" style={LINK_BASE}>
          日本語
        </a>
      </main>
    </body>
  </html>
)

export default GlobalNotFound
