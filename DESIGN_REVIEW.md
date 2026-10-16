# Portfolio UI/UX review and redesign

Branch: `redesign/codex-ui-overhaul`

Baseline: `master` at `d40f744`

Review date: 16 October 2026

## Review scope

Heuristic review of the English and Japanese portfolio, career history, contact form, and error pages. Findings come from the source and browser inspection of the existing preview, including a 390 px mobile viewport. These are design judgments, not findings from user interviews or conversion analytics.

## Criticisms, ordered by severity

| Priority | Criticism | Visitor impact | Redesign response |
| --- | --- | --- | --- |
| High | The animated 3D portrait precedes the introduction and consumes much of the first screen. A second portrait then repeats the identity. | A visitor sees decoration before learning what Ricky does or how to engage. The model also starts loading without an explicit request. | Lead with the introduction and work/contact actions. Use a modest standalone portrait alongside the text, with a brief introductory turn and a photo fallback. |
| High | The home page has no primary work/contact action near its introduction. External social links receive greater prominence. | The next useful step is unclear, especially to someone evaluating professional experience. | A primary experience action and secondary contact action appear directly under the introduction. Relevant experience is linked by role, with another contact action at the end. |
| High | Recruiting expands many nested fields, including optional questions before compensation and the actual message. | The form feels longer than necessary and hides the important questions among secondary information. | Choose general message or role discussion first. Name, email, and message precede role details. Keep required role/compensation fields visible and group optional details in a disclosure. Preserve the existing validation requirements. |
| High | Career entries are long paragraphs with little distinction between responsibility, employer, and time period. | A reader must read every paragraph to establish relevance. | A structured timeline separates dates, employer, title, and a factual short summary. Full original descriptions remain accessible under native disclosures. |
| Medium | The entire desktop layout is restricted to 560 px, similar to the mobile reading column. | Large displays retain excessive empty space while content and forms remain cramped. | A 1120 px outer layout supports a two-column hero, readable editorial sections, and a two-column contact page. Paragraphs retain comfortable line lengths. |
| Medium | Skill bars imply precise proficiency without explaining what 100%, 90%, or 40% mean. | They create an unsupported ranking and are difficult to compare meaningfully. | List the existing technologies in two labeled groups; make career evidence more prominent. No new skills, clients, numerical achievements, or availability claims are invented. |
| Medium | Navigation hides two main destinations behind a menu on mobile; the menu lacks Escape/outside-click behavior. | Common destinations take an extra interaction and the open menu can obstruct content. | Keep all three main destinations visible on mobile, with the active destination indicated by text contrast and an underline. Language and theme controls remain available. |
| Medium | Justified body text, small skill labels, underlined headings, and competing teal/pink/purple accents weaken the reading hierarchy. | Word spacing becomes uneven and decorative emphasis competes with useful controls. | Use left-aligned text, stronger type/spacing hierarchy, a restrained paper/ink/green palette, and consistent focus states. Dark mode uses the same structure and a warm accent. |
| Medium | Fixed 300 px verification/button widths compete with narrow form gutters. | Small screens can become cramped or overflow. | Let the submit button fill the form; reserve verification space without forcing the surrounding layout beyond the viewport. Check at 360 px and 390 px. |
| Medium | A disabled submit button does not explain that verification is still pending. | Visitors may assume the form is broken. | Show an explicit waiting message associated with the button. Use the documented compact Turnstile widget, which fits narrow forms without scaling interactive controls. |
| Low | Error pages inherit the decorative model from the shared layout. | A visitor recovering from a bad link has to pass unrelated content. | Error pages have one clear explanation, a return-home action, and a contact fallback. |

## Design direction

An editorial portfolio with warm paper, ink, fine dividing rules, generous spacing, and a serif accent in the introduction. A standalone 3D portrait adds personality without a paper panel, diagram, or repeated profile information. Work is shown as readable rows rather than a grid of generic cards. The home, experience, contact, and error pages use the same navigation, typography, buttons, and spacing.

English and Japanese receive equivalent content and controls. Theme preference and language-switch query/hash preservation remain intact. On the first overview visit per tab, the portrait starts facing away, gently turns toward the introduction once visible, and then rests. Returning through navigation, browser Back, reloading, or switching languages loads the final pose directly. Reduced-motion preferences skip the introductory motion, and dragging interrupts it. It has a photo fallback and is absent from career, contact, and error pages.

All four focus labels are centered at desktop and mobile widths. Language names in page content follow the current locale. The switcher alone uses its destination language, including its accessible label: 日本語 on English pages and English on Japanese pages. An accent border, soft fill, and stronger weight distinguish it while retaining the existing 48 × 44 px desktop and 44 × 44 px mobile footprint.

## Content and operational boundaries

- Career summaries paraphrase the original descriptions; the complete descriptions remain available.
- Existing contact payloads, server validation, Turnstile, rate limiting, and mail handling remain in place.
- General messages do not request recruiting information. Role discussions still require company, role type, and compensation.
- Validation opens optional details if the first invalid field is inside the disclosure, then focuses that field.
- No third-party fonts or new runtime dependencies are added. The system font stack supports Japanese.
- Deployment targets the existing preview Worker with `noindex`; production and the DeepSeek design branch are separate.

## Validation

- All 20 existing tests pass, including English/Japanese translation parity and contact validation, delivery, failure, and abuse-prevention cases.
- `npm run typecheck` passes with zero errors, warnings, or hints.
- Preview and production builds pass the existing artifact checks. A preview `cf deploy --dry-run --prebuilt --mode preview --provision false` also passes.
- All six primary routes were checked in the browser at 360, 768, and 1280 px viewport settings: no horizontal overflow, exactly one primary heading, and the expected active navigation state.
- Both light and dark themes were inspected. Theme selection survives reload. Tested text/background token pairs exceed 4.5:1 contrast (the lowest tested pair is 5.12:1); this is a focused contrast check, not a full accessibility conformance audit.
- Keyboard navigation reaches the skip link, and activating it focuses the main content.
- General and agency role inquiries submit successfully through the local stub; no email is sent in these tests. The salary inputs retain their formatting and validation.
- A deliberately invalid optional URL is detected even after its disclosure is closed; validation reopens the disclosure and focuses that input.
- Switching between English and Japanese preserves the recruiting query parameter and the fragment.
- Career disclosures expose the complete original descriptions.
- Checked 132 internal links and asset references across eight localized pages; all files and anchor targets exist.
- `npm audit --audit-level=low` reports zero known vulnerabilities.
- A missing Japanese path shows the localized error page without a model or a misleading active navigation item.

Preview deployment target: [ricky-homepage-preview.contingent.workers.dev](https://ricky-homepage-preview.contingent.workers.dev). Production deployment is outside this request.

## Portrait iteration

The first version used a tilted paper panel, a systems diagram, and repeated name/language information. On review, this added little value. The selected alternative replaces it with a standalone 3D portrait, framed from the model bounds. It makes one introductory turn, supports pointer rotation without a separate control, and allows wheel, vertical touch scrolling, and native pinch zoom. The lower-page duplicate model is replaced by the existing Printables link.

This alternative loads the existing 3D assets when the hero approaches the viewport. It trades that initial download for a personal visual, while keeping the introduction available as static HTML. The introductory animation pauses offscreen or in a hidden tab and stops after one turn. Subsequent rendering happens on interaction, resize, and visibility changes; there is no ongoing animation loop. The portrait remains below the main actions on mobile.

The first successful visible render records the visit in session storage, shared by both languages. Leaving midway through the turn still skips it on return. Failed or offscreen model loads do not consume the intro; unavailable storage falls back to remembering within the current page without breaking the portrait.
