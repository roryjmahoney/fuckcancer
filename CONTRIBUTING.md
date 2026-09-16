# Contributing to fuckcancer

Thanks for wanting to help. This is a small, deliberately simple project, and it touches a
subject where being wrong has a cost. A few ground rules make that manageable.

## The one rule that matters most

**Never let this tool imply more certainty than it has.**

The scores in this app are authored, disclosed heuristics. They are not a validated
clinical model, not a probability, and not screening-eligibility advice. Any change that
makes a score look more authoritative than it is — removing a disclaimer, calling the
index a "risk percentage", presenting it as a diagnosis, implying a result rules cancer in
or out — will be rejected, no matter how good the code is. Read the **Medical
limitations** section of the [README](README.md) before you change anything in
`src/assessment.js`.

## Non-negotiable constraints

These are the design constraints the project exists to uphold. A pull request that breaks
one of them will be closed:

1. **No backend.** No server, no API, no serverless function, no database.
2. **No data leaves the browser.** No `fetch`, no `XMLHttpRequest`, no `sendBeacon`, no
   WebSocket, no third-party embed, no remote font or script. Answers live in memory and
   die when the tab closes.
3. **No persistence.** No cookies, no `localStorage`, no `sessionStorage`, no IndexedDB.
   Someone may be filling this in on a shared or borrowed computer.
4. **No tracking.** No analytics, no pixels, no error-reporting service, no A/B tooling.
5. **Accessible by default.** Keyboard-operable, visible focus, correct labels and roles,
   and clean `axe` runs in both light and dark mode.
6. **It must not look AI-generated.** No generic system-sans display type, no purple
   gradients, no glassmorphism, no evenly spaced three-card rows, no neon glow. The design
   is meant to feel deliberate, high-contrast and human.

## Getting set up

Node.js 22.12 or newer is required (see [`.nvmrc`](.nvmrc)).

```sh
git clone https://github.com/roryjmahoney/fuckcancer.git
cd fuckcancer
npm ci
npm run dev
```

## Before you open a pull request

Run all three:

```sh
npm test          # Node's built-in test runner: scoring, validation, bounds
npm run test:e2e  # Playwright + axe: real browser journeys, a11y, privacy
npm run build     # must produce dist/ with no errors
```

The browser suite needs Chromium:

```sh
npx playwright install --with-deps chromium
```

If you already have a Chromium build on your machine and would rather not download
another, point Playwright at it:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

## Where things live

| Path | What it owns |
| --- | --- |
| `src/questions.js` | The questionnaire schema: sections, fields, choices, conditional visibility. |
| `src/assessment.js` | Pure functions: validation, BMI, pack-years, the disclosed scoring rules. No DOM. |
| `src/app.js` | Rendering, in-memory state, navigation, results, dialogs, printing. |
| `src/style.css` | Layout, themes, reduced motion, print styles. |
| `tests/assessment.test.js` | Unit tests for the model. Add to these when you change scoring. |
| `tests/browser/app.spec.js` | Playwright journeys, accessibility and privacy assertions. |
| `public/_headers` | Security headers for Netlify / Cloudflare Pages deployments. |
| `docs/IMPLEMENTATION.md` | The running implementation and verification log. |

`src/assessment.js` is intentionally free of DOM access so the scoring model can be tested
directly. Keep it that way.

## Changing questions or scoring

If you touch `src/questions.js` or `src/assessment.js`:

- Add or update a test in `tests/assessment.test.js`. Scoring changes without test changes
  will be sent back.
- Make sure "unknown" answers still contribute no points and are still counted as missing
  data. An unanswered question must never be treated as a confirmed absence of a risk
  factor.
- Make sure the methodology text shown in the app still describes what the code actually
  does. The disclosure and the implementation must not drift apart.
- Cite a reputable source — NCI, CDC, ACS, WHO/IARC, Cancer Research UK, or peer-reviewed
  literature — in the pull request description. Prefer guideline bodies and reviews over
  single studies or news coverage.

## Style

There is no linter and no formatter config, on purpose. Match the surrounding code:
two-space indent, ES modules, no framework, no build-time magic beyond Vite. Prefer a
plain function over a clever abstraction. Comments explain *why* a weight or threshold was
chosen, not what the line does.

## Commits and pull requests

- Write [Conventional Commits](https://www.conventionalcommits.org/) subjects:
  `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
- One logical change per pull request.
- Fill in the pull request template, including how to verify the change by hand.
- CI runs unit tests, the browser suite and a production build on every pull request.

## Reporting problems

- Bugs and accessibility problems: the **Bug report** issue template.
- Wrong, misleading or unsourced medical content: the **Content or accuracy correction**
  template. This is the most valuable kind of issue you can file here.
- Security or privacy vulnerabilities: **do not** open a public issue — follow
  [SECURITY.md](SECURITY.md).

## Code of conduct

Participation is covered by the [Code of Conduct](CODE_OF_CONDUCT.md). The project's name
is deliberately profane and the tone of the app is angry at a disease; that is not a
license to be hostile to people.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE).
