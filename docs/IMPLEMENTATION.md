# fuckcancer implementation

Goal: A complete private, client-side educational cancer risk-factor questionnaire.
Architecture: Vite and vanilla ES modules. Schema owns questions and visibility, pure assessment module owns validation and explicitly arbitrary index weights, app owns accessible rendering and memory-only state. Self-hosted Nunito Sans and DM Sans fonts. No backend or analytics.

- [x] Establish unit tests for tobacco dose, unknown data, organ applicability, validation, family history and result bounds.
- [x] Implement eight questionnaire sections with conditional fields, family-member entries, metric/imperial conversion and native validation.
- [x] Build responsive paper/ink/yellow interface, system dark mode, reduced motion, step navigation and answer review.
- [x] Explain results across 12 cancer types, limitations and next actions. Link NCI, ACS, CDC and St. Jude.
- [x] Verify real browser journeys, mobile, dark mode, keyboard behavior, privacy and production build.

Medical boundary: This is not a calibrated risk model. Index points and categories are editorial, not validated clinical risk, lifetime probabilities, diagnosis or screening eligibility. Unknown answers never count as confirmed absence of risk. Ethnicity and gender identity are not scored. Explicit organs determine applicability. Prior cancer/genetic findings trigger clinician follow-up regardless of index. No claim of medical production validation.

Verified (historical entry, superseded — see "Current verification status" at the end of this file): 13 unit tests, 4 Playwright journeys, axe checks in light/dark mode and on results, 320px/390px layout checks, zero answer submissions/persistent storage, and a passing production build. Chromium 151 was used via PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH because downloading the newer browser timed out; that was a local-environment workaround, not a project requirement. Automated checks do not constitute clinical validation or exhaustive accessibility certification.

September 2026 follow-up: imperial height uses paired feet/inches inputs with unit conversion and component validation. Minimum age is 14. Ages 14–17 use an unscored prevention/support pathway with no adult anatomy/hormone screening questions or adult cancer indices. BMI display/scoring is restricted to ages 20+. Regression coverage includes age transitions, teen mobile completion, metric conversion and invalid inches.

Teen-score follow-up: ages 14–17 now receive a separate 0–100 exposure checklist with explicitly arbitrary weights, an unvalidated/potentially inaccurate warning, contributing-factor breakdown and missing-data coverage. This supersedes the earlier unscored teen summary. Cancer probabilities and adult cancer-specific indices are still not applied to teens. No score is produced when all scoring inputs are missing.

## Current verification status

As of the v1.0.0 release commit, the suite is **20 unit tests** (`npm test`) and **5
Playwright browser journeys** (`npm run test:e2e`), with `axe` checks in light and dark
mode and on the results view, layout checks at 320px and 390px, and a passing production
build. The counts quoted in the historical entries above are the counts at the time those
entries were written and were not revised as tests were added; this section is the current
one.

Automated checks verify code behavior. They are not clinical validation and not an
accessibility certification.

## Release preparation (v1.0.0)

Added the public-repository shell: MIT `LICENSE`, `README.md` rewrite, `CONTRIBUTING.md`,
`CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, an expanded `.gitignore`,
`.gitattributes`, `.editorconfig`, `.nvmrc`, and `.github/` with CI, an optional Pages
deployment, Dependabot, issue forms and a pull-request template. `package.json` gained
description, license, repository, bugs, homepage, author and keywords; it stays
`"private": true` because this is an application, not a publishable package.

Three code changes came out of the release audit rather than the feature work:

- `src/app.js` — the per-field validation message and the adult clinical-alert text were
  interpolated into the `innerHTML` sink without `esc()`, while their twins a few lines
  away were escaped. Not exploitable (every producer is a string literal), but `SECURITY.md`
  names exactly this as the project's first threat, so both now escape.
- `index.html` — the `noscript` link to cancer.gov gained `rel="noopener noreferrer"`. It
  is the only outbound link not produced by the hardening helper, and on a host that
  ignores `_headers` the default referrer policy would disclose that the visitor loaded a
  cancer risk-factor questionnaire.
- `playwright.config.js` — hardened for CI: `forbidOnly` and `retries` under `CI`,
  `trace: 'on-first-retry'`, an HTML reporter in CI, explicit timeouts, the dev server
  bound to `127.0.0.1` instead of inheriting `--host 0.0.0.0`, and `reuseExistingServer`
  disabled in CI so a runner cannot test a stale server.

Verification for this release: 20/20 unit tests, 5/5 Playwright journeys (3 `axe` passes,
320px/390px/1440px layouts), and a clean production build.

Local verification used Chrome 152.0.7977.82 via `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`,
because the Chromium build pinned by playwright-core 1.63.0 would not download on the
development machine — the same timeout recorded in the September 2026 entry above. That
gap is now closed: the first CI run on the release commit installed the pinned build
(Chrome for Testing 153.0.8010.12, playwright chromium v1243) and all five journeys passed
against it in 32s, so the suite is confirmed green on the browser CI actually uses and the
executable-path override is a local convenience rather than a requirement.

Known, deliberately unresolved at v1.0.0 — these are product decisions, not oversights to
hide:

- The prostate and ovarian profiles declare no risk-factor rules, so they can only ever
  return age plus family history and will sit in the lowest band for everyone.
- Each profile's "missing information" list omits some inputs that genuinely score that
  profile (`smoking` for colorectal, `activity` for breast and uterine, `immune` for
  melanoma), so per-card incompleteness is under-reported.
- The adult score caveat interpolates the score itself and reads "This is NOT a 0% chance
  of cancer." for a clean-history user.
- Every adult factor's "Evidence" link resolves to the same generic NCI landing page.
- The teen exposure score is not clamped; the advertised 0–100 range holds only because
  the current weights happen to sum to 100.
- The St. Jude donation block renders on the teen results screen as well as the adult one.
