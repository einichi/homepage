export function initTheme() {
  const button = document.querySelector('.theme-toggle')
  if (!button) return
  const update = () => {
    const dark = document.documentElement.dataset.theme === 'dark'
    button.setAttribute(
      'aria-label',
      dark ? button.dataset.lightLabel : button.dataset.darkLabel
    )
  }
  update()
  matchMedia('(prefers-color-scheme: dark)').addEventListener(
    'change',
    (event) => {
      let saved
      try {
        saved = localStorage.getItem('theme')
      } catch {}
      if (saved === 'light' || saved === 'dark') return
      document.documentElement.dataset.theme = event.matches ? 'dark' : 'light'
      update()
    }
  )
  button.addEventListener('click', () => {
    const next =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {}
    update()
  })
}

export function initLanguageSwitch() {
  document.querySelectorAll('[data-language-switch]').forEach((link) => {
    const update = () => {
      const target = new URL(link.href)
      target.search = window.location.search
      target.hash = window.location.hash
      link.href = target.toString()
    }
    update()
    link.addEventListener('click', update)
  })
}
