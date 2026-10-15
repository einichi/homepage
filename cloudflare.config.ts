import { bindings, defineConfig } from 'cf/config'
import * as entrypoint from './src/worker.ts' with { type: 'cf-worker' }

export default defineConfig(({ mode, isPreview }) => {
  const production = mode === 'production' && !isPreview
  const localStub = mode === 'development' || mode === 'local'
  return {
    accountId: '50aeca1f034c4aa61ffbcf17b31e6c64',
    worker: {
      name: production ? 'ricky-homepage' : 'ricky-homepage-preview',
      compatibilityDate: '2026-10-15',
      entrypoint,
      workersDev: true,
      domains: production ? ['ricky.burg.in'] : [],
      assets: {
        htmlHandling: 'auto-trailing-slash',
        notFoundHandling: 'none',
        runWorkerFirst: ['/api', '/api/*']
      },
      observability: {
        enabled: true,
        redactQueryString: true,
        traces: { enabled: true, headSamplingRate: 0.1 }
      },
      env: {
        ASSETS: bindings.assets(),
        ...(localStub ? {} : { MAIL: bindings.sendEmail() }),
        ...(localStub
          ? {}
          : {
              RATE_LIMITER: bindings.rateLimit({
                namespace: production ? '1139074262' : '1139074261',
                simple: { limit: 5, period: 60 }
              })
            }),
        ...(localStub
          ? {}
          : {
              FROM_EMAIL: bindings.secret(),
              TO_EMAIL: bindings.secret(),
              TURNSTILE_SECRET: bindings.secret()
            }),
        TURNSTILE_HOSTNAMES: bindings.text(
          production
            ? 'ricky.burg.in'
            : 'ricky-homepage-preview.contingent.workers.dev'
        ),
        LOCAL_CONTACT_STUB: bindings.text(localStub ? 'true' : 'false')
      }
    }
  }
})
