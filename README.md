# Ricky Burgin’s Homepage

Astro static portfolio in English and Japanese, with a small Cloudflare Worker for the contact form. Pages are generated under `/en/` and `/ja/`; only the contact form uses React. The Three.js model loads lazily as it approaches the viewport.

## Local development

Use Node.js 24 or newer and npm:

```sh
npm ci
npm run dev
```

The Cloudflare Vite plugin serves the built site and Worker together on port 8787. Local contact submissions use a server-side stub and never send email. No Cloudflare credentials, secrets, Turnstile widget, or recipient address are needed. The local stub only activates for loopback hostnames in development mode.

The command builds the static pages at startup. Restart it after changing page content or browser code so the static-asset manifest is refreshed. Worker code supports Vite updates. This explicit local Vite entry is necessary because the current beta `cf dev` detects Astro and starts an Astro-only server; Cloudflare account operations and deployment use the pinned cf CLI.

## Build and validation

```sh
npm test
npm run typecheck
npm run build
./node_modules/.bin/cf deploy --prebuilt --mode preview --dry-run --provision false
```

`npm run build` creates a preview package by default. Preview HTML and response headers carry `noindex`; use `npm run production:build` only when preparing a separately approved production change. The cf configuration defaults to the distinct `ricky-homepage-preview` Worker and has no custom domains or production routes. CI performs checks and a dry run only.

Each build runs `scripts/check-build.mjs` against the finished upload artifact to verify the Worker identity, asset routing, secret declarations, disabled local stub, and indexing policy. Neither build script deploys. The lazy Three.js library produces a large-chunk build warning; it is loaded separately from the page and form code.

## Contact Worker configuration

The Worker uses the native email sending binding, the native rate-limit binding, and Turnstile Siteverify. Set `FROM_EMAIL`, `TO_EMAIL`, and `TURNSTILE_SECRET` as Worker secrets after the preview configuration and widget have been reviewed. The recipient is intentionally absent from this repository. Set `PUBLIC_TURNSTILE_SITEKEY` in the build environment when building a deployable preview. Allowed hostnames and preview/production limiter namespaces are declared by mode in `cloudflare.config.ts`.

The endpoint accepts same-origin `POST application/json` at `/api/contact`, bounds streamed input, validates all required values server-side, and fails closed if live verification, rate limiting, or mail configuration is unavailable. It uses the visitor email only as Reply-To and waits for Cloudflare to accept the message before returning success. Acceptance does not confirm inbox delivery. Contact content and tokens are not logged or persisted.

The rate-limit binding is a per-Worker location limiter. It reduces bursts but does not provide a globally shared per-IP quota across Cloudflare locations. Keep the honeypot and Turnstile checks enabled and review abuse behavior during preview.

Validation and message formatting live in `src/lib/contact-schema.ts`; the provider-specific sending adapter is `src/server/cloudflare-email.ts`. The request body is capped at 32 KiB while streaming, including requests without Content-Length. There is no durable submission queue or automatic retry: a network failure can leave delivery uncertain, and retrying can duplicate a message.

Review `cloudflare.config.ts` and the built preview package before any remote setup or deployment. Production cutover requires separate approval.
