/// <reference types="astro/client" />

interface Window {
  turnstile?: {
    render(
      container: string,
      options: {
        sitekey: string
        action: string
        language: string
        callback(token: string): void
        'expired-callback'(): void
        'error-callback'(): void
      }
    ): string | number
    remove(widgetId: string | number): void
    reset(widgetId: string | number): void
  }
}
