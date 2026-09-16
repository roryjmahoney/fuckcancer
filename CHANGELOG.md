# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] — 2026-09-15

First public release.

### Added

- Eight-section questionnaire — 51 fields on the adult path, 43 on the teen path, 8 of
  them conditional — covering demographics, body metrics, tobacco and alcohol, family
  history, diet and activity, sun and environmental exposure, medical history, and
  hormone and anatomy questions, with explicit "not sure" options throughout. On the teen
  path the hormone and anatomy section is replaced by optional vaccination and support
  questions rather than added to.
- Editorial 0–100 factor index for adults across twelve cancer profiles — lung, breast,
  colorectal, prostate, skin/melanoma, pancreatic, bladder, kidney, liver, cervical,
  ovarian and uterine/endometrial — with a per-factor explanation for every point awarded.
- Separate pathway for ages 14–17: a prevention-focused exposure score labelled
  "Unvalidated and potentially inaccurate", with its own point breakdown, and no adult
  cancer indices, screening prompts or hormone and anatomy questions.
- Organ applicability asked explicitly and handled independently of gender identity, so
  profiles for absent organs are excluded from results.
- Metric and imperial units, with paired feet and inches inputs and automatic conversion
  when switching; BMI and pack-year calculation from the entered values.
- Data-completeness reporting: unknown answers score zero points and are counted and
  surfaced as missing data rather than treated as an absence of risk.
- Follow-up alerts that fire independently of any score for symptoms, a previous
  diagnosis, a known inherited variant, and family history.
- Results view with review-and-edit of answers, expandable per-factor explanations,
  methodology disclosure, repeated disclaimers, print and save, and reset with
  confirmation.
- Resource links to the National Cancer Institute, the American Cancer Society and the
  CDC, plus a donation link to St. Jude Children's Research Hospital.
- Privacy by construction: answers are held in memory only, with no backend, no network
  submission, no cookies, no analytics and no persistent browser storage.
- Accessibility work: keyboard navigation, visible focus, accessible dialogs, reduced
  motion support, system light and dark themes, print styles, and a responsive layout
  verified down to 320px.
- Self-hosted Nunito Sans and DM Sans via Fontsource — no remote font service.
- Content-Security-Policy and hardening headers in `public/_headers` for Netlify and
  Cloudflare Pages deployments.
- Test suite: 20 unit tests for the scoring and validation model, and Playwright browser
  journeys with `axe` accessibility checks in light and dark mode.

### Notes

- Scores are authored heuristics, explicitly not a validated clinical model and not
  cancer probabilities. See the Medical limitations section of the README.
- Source material was reviewed in September 2026.

[Unreleased]: https://github.com/roryjmahoney/fuckcancer/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/roryjmahoney/fuckcancer/releases/tag/v1.0.0
