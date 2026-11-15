# immigration-ops

**Find the migration route that fits your real profile, with every number sourced and dated.**

[![CI](https://github.com/immanwell/immigration-ops/actions/workflows/ci.yml/badge.svg)](https://github.com/immanwell/immigration-ops/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status: early](https://img.shields.io/badge/status-early%20design-orange.svg)](ROADMAP.md)

immigration-ops is an open-source, local-first tool that runs inside an AI coding CLI such as
Claude Code. You describe yourself once. It checks you against work and skilled migration
routes in several countries, shows which are open, which are realistic and what would change
the answer, then turns the route you choose into a plan and a tracked document checklist.

It does for moving country what [career-ops](https://github.com/santifer/career-ops) does for
job search. It informs and prepares. It never files anything, and it is not legal advice.

> **Status: early.** The design, the contribution standards and the first implementation plan
> are published. The engine and the first route pack are being built now. See
> [what works today](#what-works-today). If you want to shape it, this is the best time.

## Why I am building this

I am an infrastructure engineer in Kampala, Uganda, and I am planning a move to Germany or
Canada. I did the research by hand first, one route at a time, and it taught me three things.

1. **The route that looks easiest often is not.** One route I took for the easy option asked
   for more than a route I already qualified for. I only saw it once both were laid side by
   side against my own profile.
2. **Every blog post has a different number.** Thresholds, cut-offs and fees change several
   times a year. Most of what you find is undated, and some of it is selling something.
3. **Where you start from changes everything.** Which embassy handles you, how your degree is
   recognised, how you prove freelance work, how long a police certificate takes. Tools built
   for strong passports skip all of it.

So I am building the tool I wanted: one that treats the rules as data with sources, does the
arithmetic in tested code, and is honest about what it does not know.

## How it is different

| | |
|---|---|
| **Rules are data** | Thresholds, points grids, fees and document lists live in versioned files. Each one cites an official government source and the date it was last checked. |
| **Arithmetic is code** | Eligibility and points are computed by a deterministic, tested engine. The AI interviews you, explains and plans. It never adds up points. |
| **Unknown is an answer** | A test you have not sat yet is shown as an assumption, with what happens if the result comes in lower. A missing fact is never a silent guess. |
| **Levers and clocks** | See what moves your result (a language level, a degree, a nomination) and what time does to it (a birthday, an expiring test, a rule's end date). |
| **Routes and origins** | Route packs describe the destination. Origin packs describe your starting line: embassy, degree recognition, document legalisation, test centres. |
| **Stale rules are flagged** | Every pack has a review date. Automated checks open an issue when one passes, and reports say when a rule has not been verified recently. |
| **Private by design** | Everything runs on your machine. Your profile and documents are separated from the tool by a written data contract and ignored by git. |

## What it will look like

The layout below is an illustration with invented numbers. It is not a real assessment.

```
Route matrix for profile "amara"                              as of 2027-01-10

Route                          Eligible        Score vs cut-off   Gaps   Leads to
ca/express-entry-fsw           yes (assumed)   000 vs 000         1      permanent residence
ca/provincial-nominee-example  yes             n/a                2      nomination, then PR
de/eu-blue-card                needs an offer  n/a                1      residence, PR later
de/opportunity-card            yes             0 of 0 points      0      job search stay

Assumed: language test not yet taken. Without it, ca/express-entry-fsw becomes "unknown".
Biggest lever: provincial nomination.   Next clock: birthday in 4 months.
Sources checked between 2026-12-01 and 2027-01-05. Information, not advice.
```

## What works today

| Part | State |
|---|---|
| Design, architecture, data contract | Published in [`docs/design`](docs/design/2026-11-15-immigration-ops-design.md) |
| Contribution standards, CI, release automation | In place |
| Engine: facts, rules, points, levers, clocks | Planned for v0.1.0, see the [plan](docs/plans/2026-11-15-v0.1.0-first-route.md) |
| First route: Canada, Express Entry (Federal Skilled Worker) | Planned for v0.1.0 |
| Canada and Germany packs, route matrix | v0.2.0 |
| Plan, documents and tracker modes, first origin pack | v0.3.0 |
| Freshness automation, sponsor and scam checks | v0.4.0 |
| career-ops bridge | v0.5.0 |

The full list, including the countries planned after Canada and Germany, is in
[ROADMAP.md](ROADMAP.md).

## Countries

| Stage | Countries |
|---|---|
| First, built by the maintainer | Canada, Germany |
| Next, open for co-maintainers | Australia, United Kingdom |
| Contributor packs | Poland, Norway, the Netherlands, Ireland, Portugal, Austria, Denmark, Sweden, Finland, New Zealand, the United States diversity lottery |
| Origin packs | Uganda first. Yours is welcome. |

Work and skilled routes come first. Study, family and investor routes come later, and the
pack format is designed not to block them.

## Works with career-ops

Many routes depend on a job offer, so job search and migration belong together.
immigration-ops is a separate project that follows career-ops conventions and will ship an
optional bridge: it can read your existing career-ops profile, and it can tell your job search
which salary thresholds, occupations and sponsor checks matter for the routes you are pursuing.

immigration-ops is an independent project. It is not affiliated with or endorsed by career-ops.

## Contributing

You do not need to write code to help, and you do not need to wait for v0.1.0.

- **Tell us about a route.** Open a [route request](https://github.com/immanwell/immigration-ops/issues/new/choose) with the official
  government links. Official sources are the most valuable thing you can bring.
- **Describe your starting line.** If you have been through an application from your country,
  an origin pack is mostly what you already know.
- **Challenge the design.** The [design document](docs/design/2026-11-15-immigration-ops-design.md)
  is open for comment in [Discussions](https://github.com/immanwell/immigration-ops/discussions).

Read [CONTRIBUTING.md](CONTRIBUTING.md) first. It explains the one rule that matters most here:
no number enters this repository without an official source.

## Not legal advice

immigration-ops compiles general information from public official sources. It can be out of
date or wrong. It is not legal or immigration advice, and giving paid immigration advice is
regulated in several countries. Check the official source before you act, and use a licensed
adviser when you need one. See [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md).

## License

[MIT](LICENSE). Built by [Em](https://em.is-a.dev) ([@immanwell](https://github.com/immanwell))
and contributors.
