# Security policy

## What this project is, in security terms

fuckcancer is a **static single-page application**. There is no backend, no database, no
API, no authentication and no server-side code. Everything runs in the visitor's browser,
and answers are held in memory only — they are never transmitted, and never written to
cookies, `localStorage`, `sessionStorage` or IndexedDB.

That shape rules out most classes of vulnerability, but not all of them. The realistic
threat surface is:

- Cross-site scripting through user-entered text rendered back into the results page.
- A dependency in the build chain shipping malicious code into `dist/`.
- A deployment that drops the security headers in `public/_headers`, weakening the
  Content-Security-Policy that keeps third-party script out of the page.
- Anything that causes a user's answers to leave the browser. **Treat any outbound
  network request as a privacy vulnerability, not a feature.**

## Supported versions

The latest release on the `main` branch is the only supported version. This project is a
static site — if you deploy it, you own the deployment, and you should rebuild from a
current commit rather than relying on an old `dist/`.

| Version | Supported |
| ------- | --------- |
| 1.0.x   | Yes       |
| < 1.0   | No        |

## Reporting a vulnerability

**Please do not open a public issue for a security or privacy vulnerability.**

Report it privately through GitHub Security Advisories:

<https://github.com/roryjmahoney/fuckcancer/security/advisories/new>

Please include:

- What the issue is and roughly how severe you think it is.
- Steps to reproduce, or a proof of concept.
- The commit or deployed URL you tested against.
- Your browser and operating system.

What to expect:

- An acknowledgement within **7 days**.
- An assessment and a plan, or an explanation of why it is not a vulnerability, within
  **30 days**.
- Credit in the release notes when a fix ships, unless you would rather stay anonymous.

This is a small unfunded project maintained in spare time. There is no bug bounty and no
payment, and response times are best-effort.

## Scope

In scope:

- XSS, HTML or attribute injection through any questionnaire input.
- Anything that transmits, persists or leaks a user's answers.
- Supply-chain problems in the declared dependencies or the lockfile.
- A Content-Security-Policy or header configuration that is weaker than documented.
- Prototype pollution or similar that changes scoring or rendering behavior.

Out of scope:

- Findings against a third party's deployment of this code that you do not control.
- Missing headers on a host that does not support `_headers` files — configure the
  equivalent headers yourself; see the README.
- The accuracy of the risk scoring. That is a content issue, not a security issue —
  use the **Content or accuracy correction** issue template.
- Automated scanner output with no demonstrated impact.
- Denial of service against a static file host.
- Social engineering, physical attacks, or attacks requiring a compromised device.

## Deploying safely

If you host this yourself, keep the headers in [`public/_headers`](public/_headers).
Netlify and Cloudflare Pages read that file directly; on other hosts, configure the
equivalent headers in your server or CDN configuration. Serve over HTTPS. Do not expose
`npm run dev` or `npm run preview` as a public production server — they are development
tools and are not hardened.
