# immigration-ops: design

Status: draft for approval, 2026-11-15.

## 1. Intent

Moving country for work is a research problem before it is a paperwork problem. A person has
one profile (age, education, experience, languages, money, family) and dozens of possible
routes across several countries. Each route has its own eligibility rules, points grid, document
list, costs, waiting times and deadlines, and all of them change. Most people compare two or
three routes by hand, from blog posts of unknown age, and often pick the wrong one.

immigration-ops does for migration what [career-ops](https://github.com/santifer/career-ops)
does for job search: it runs locally inside an AI coding CLI, keeps the person's data on their
own machine, and turns a profile into ranked routes, a plan, and a tracked set of documents.
It informs and prepares. It never files anything and never replaces a licensed adviser.

It is built by someone going through the process, starting from a passport that gets no
shortcuts. That point of view is a feature: the tool treats embassy logistics, credential
recognition, proof of funds and scam offers as first-class problems, because for most of the
world they are.

## 2. Who it is for

1. A skilled worker outside the destination country who wants to know which routes are open
   to them, which are realistic, and what to do first.
2. Contributors who know one country's rules well (often because they just went through them)
   and can maintain a route pack or an origin pack.
3. Later: non-technical users, through a static website that runs the same engine in the
   browser.

## 3. Goals, non-goals, anti-goals

**Goals**

- Several countries and several routes per country from the first design, selectable by the user.
- One profile in, a route matrix out: for each route, eligibility, score where the route is
  points-based, gaps, effort, cost, time, and what it leads to.
- Levers and clocks: what changes a result (a language level, a degree, a nomination), and what
  changes it with time (a birthday, an expiring test, a rule's end date).
- Every number carries an official source and the date it was last verified.
- A plan and a document checklist for the chosen route, tracked in plain files.
- Easy to contribute to: adding a route is mostly writing data and test personas, not code.
- Works alone, and works better next to career-ops.

**Non-goals (first releases)**

- Submitting applications, filling government forms, or booking appointments.
- Family, asylum, investor and student routes. Work and skilled routes come first. The format
  must not block the others.
- A hosted service with accounts.
- Live exchange rates or any network call in the core path.

**Anti-goals: these make it a failure even if it works**

- A number stated from model memory. If the data pack has no sourced value, the answer is
  "unknown, here is the official page".
- Sounding like legal advice, or hiding the uncertainty in an estimate.
- Personal documents (passport scans, bank statements) entering a prompt or a git history by
  default.
- A stale rule presented as current.

## 4. Principles

1. **Rules are data.** Thresholds, grids, fees and document lists live in versioned YAML with
   sources and verification dates. They are reviewed like code.
2. **Arithmetic is code.** Eligibility checks and points are computed by a deterministic,
   tested engine. The AI interviews, explains, plans and drafts. It never adds up points.
3. **Unknown is a first-class answer.** A missing fact is not a failed requirement. A planned
   or assumed fact (a language test not yet taken) is labelled as such and its sensitivity is
   shown.
4. **Local-first and private.** No account, no server. User files are separated from system
   files by a written data contract and are git-ignored by default.
5. **Human in the loop.** The tool prepares and tracks. The person decides and submits.
6. **AI-agnostic.** Workflows are Markdown mode files with a canonical `AGENTS.md`, so any
   coding CLI can run them. The engine also runs with no AI at all.
7. **Information, not advice.** Every report says so and points to the official register of
   licensed advisers for that country.

## 5. Approaches considered

| Approach | Trade-off | Verdict |
|---|---|---|
| A plugin or upstream PR inside career-ops | Its plugin hooks cover job sources, exports and notifications only, and architecture decisions belong to its maintainer. Route logic has nowhere to live. | Rejected |
| A fork of career-ops | Inherits a large job-search codebase to keep in sync, and reads as a fork rather than a project with its own purpose. | Rejected |
| **A standalone sibling repo** that follows career-ops conventions and ships an optional bridge | More to build at the start. Owns its data model, its release cadence and its community. | **Chosen** |

A second choice sits inside the chosen approach: whether the AI or code holds the rules.
Prompt-only (rules written into mode files) is fastest to build but cannot be tested, goes
stale invisibly, and cannot power a website without an AI bill. Data plus engine is chosen.

## 6. Architecture

```
                 destination axis                    origin axis
            routes/<country>/<route>/           origins/<country>/
            route.yml  points.yml  fixtures/    origin.yml
                       \                          /
   config/profile.yml   \                        /
   (user layer)  ───────► engine/ (deterministic) ◄──── asOf date
                           eligibility, points,
                           levers, clocks
                                  │ JSON result
                                  ▼
                 modes/*.md (AI: interview, explain, plan, draft)
                                  │
                                  ▼
          reports/  data/tracker.md  data/documents.md   (user layer)
```

### 6.1 Two axes: routes and origins

A **route pack** describes a destination pathway: who qualifies, how it is scored, what it
costs, what it leads to.

An **origin pack** describes the starting line for applicants from one country: which mission
or visa centre handles applications, how degrees from that country are recognised (and where
to check), how documents are legalised, where language tests can be sat, how police
certificates are obtained, and known lead times. Each item is sourced and dated like a route
rule.

The split matters for two reasons. The same route is a different project from Kampala than
from Toronto, and most tools ignore that. And an origin pack is something almost any
contributor can write from experience, which widens who can contribute beyond people who know
immigration law.

### 6.2 Route pack format

One directory per route. Values below are illustrative, not real rules.

```yaml
# routes/ca/express-entry-fsw/route.yml
id: ca/express-entry-fsw
name: Express Entry, Federal Skilled Worker
country: CA
authority: IRCC
kind: points-draw            # points-draw | points-threshold | employer-sponsored |
                             # job-seeker | vocational | nomination | lottery
leads_to: { status: permanent-residence, on_grant: true }
status: active               # active | pilot | paused | closed
verified: 2026-11-20         # last full review of this file
review_by: 2027-02-20        # CI warns after this date

sources:
  - id: fsw-eligibility
    url: https://www.canada.ca/...
    kind: official           # official | secondary (secondary may never be the only source)
    checked: 2026-11-20

requirements:
  - id: language-min
    label: First official language at CLB 7 or higher in every ability
    rule: { fact: language.first_official.clb_min, op: gte, value: 7 }
    source: fsw-eligibility
  - id: selection-grid
    label: At least 67 points on the selection grid
    rule: { points: fsw-grid, op: gte, value: 67 }
    source: fsw-eligibility

points: [fsw-grid, crs]      # defined in points.yml
competitiveness:
  kind: draw-cutoffs         # compared against routes/ca/_shared/draws.yml, sourced and dated
documents: [...]             # each: id, label, who issues it, typical lead time, validity
fees: [...]                  # each: amount, currency, per (applicant|family), source
timeline: [...]              # stages with sourced processing times
unlocks: [...]               # other routes this one feeds (for example a nomination)
```

- `points.yml` holds grids as tables (bands for age, education levels, language levels,
  combination rules). A generic interpreter handles banded tables. A grid too irregular for
  tables may ship a small `points.mjs` next to it, with the same tests.
- `fixtures/*.yml` are fictional personas with expected results. They are the route's tests
  and its worked examples. A route pack without fixtures does not pass CI.
- `routes/<country>/country.yml` lists the country's official domains (the allowlist for
  `kind: official` sources), its occupation classification, currency, and the register of
  licensed advisers.
- `routes/<country>/_shared/` holds country-wide tables, for example language test
  equivalences.

### 6.3 Engine

Plain functions, no I/O in the core, so the same code runs in Node and in a browser.

- **Facts.** The profile is normalised into facts. Derived facts come from resolvers (a test
  score into a national language level, a date of birth and an `asOf` date into an age). Each
  fact carries a state: `verified`, `assumed`, `planned` or `missing`.
- **Rules.** A small declarative language: `all`, `any`, `not`, comparisons on facts, and
  points thresholds. Evaluation is three-valued: `met`, `not_met`, `unknown`. A result built
  on assumed facts is flagged `met (assumed)`.
- **Points.** Returns the total, a line per factor, and the source of each line.
- **Levers.** The engine re-runs with one fact changed along declared dimensions (language
  level, education, experience, job offer, nomination, partner factors) and reports the
  difference. This also gives sensitivity for assumed facts.
- **Clocks.** `evaluate(profile, route, asOf)` takes a date. Running it at future dates shows
  what age, expiring tests, pending degrees and dated rule changes do to the result.
- **Occupation codes** are a judgement, not a calculation. A mode proposes candidate codes
  with the official duty statements, the person chooses, and the profile stores the choice per
  country. The engine takes the code as a fact.

### 6.4 The route matrix

There is no single magic score. Each route gets five readings, and the person's stated
priorities order them:

| Reading | From |
|---|---|
| Eligibility | met, met on assumptions, gaps (with what closes each), or blocked |
| Competitiveness | score against recent sourced cut-offs or thresholds, where the route has them |
| Effort | number of gaps, their lead times, total sourced cost in the route's currency and the user's own |
| Outcome | what status it gives, time to permanent residence, family and work rights |
| Risk | quotas, discretion, how often the rule has changed, documentation risk for this profile |

Costs are stored in the official currency. The profile holds the user's home currency and a
rate they set, so reports show both without a network call.

### 6.5 Modes

Markdown workflows run by the AI CLI. Each calls engine scripts for anything numeric. They are
reached through one entry point, `/immigration-ops <mode>`, shipped as an agent skill, the way
career-ops does it.

| Mode | Does |
|---|---|
| `onboard` | Interviews the person and writes the profile. Can pre-fill from a career-ops install. |
| `assess` | Runs every active route for the chosen countries and writes the route matrix. |
| `route` | Deep report on one route: requirements, points, levers, clocks, documents, costs. |
| `compare` | Two or more routes side by side, including conflicts between them (for example two languages competing for the same study hours). |
| `plan` | Turns a chosen route into a sequenced plan with lead times, costs and dependencies. |
| `documents` | Builds and tracks the document checklist: have, need, in progress, expires on. |
| `tracker` | Shows and updates where each pursued route stands. |
| `job-check` | Given a job posting or offer, says which routes it opens: salary against thresholds, occupation, sponsor status. |
| `sponsor-check` | Looks an employer up in official public sponsor registers, where a country publishes one. |
| `scam-check` | Tests an offer, agent or "sponsorship" message against known fraud patterns and official registers. |
| `verify` | Re-reads a route's official sources, reports what changed, and drafts a data PR. |

### 6.6 Trust layer

- Schema validation of every pack in CI.
- Source rule in CI: every requirement, grid line, fee and timeline cites a source. An
  `official` source must be on the country's domain allowlist. A secondary source can support
  but never stand alone.
- Freshness: `review_by` dates. A scheduled CI job opens an issue for each pack past its date,
  and the engine marks results from an overdue pack as "not recently verified" in every report.
- A rule-change PR must update `verified`, the source's `checked` date, and any fixture whose
  expected result moves. The PR template asks for the quoted official text.
- `verify` mode gives maintainers and users a repeatable way to do that review.

### 6.6.1 Catching changes

Immigration rules change by announcement, often with little notice, and a review date alone
would miss a change made the day after a review. Three layers catch changes, and one rule
governs what happens next.

1. **Source watch.** Each source records a fingerprint of the cited section of the official
   page. A scheduled job re-reads every source and opens an issue the day a page changes. Until
   a person reviews it, results from that pack are marked "source changed since verification".
2. **Announcement watch.** Each `country.yml` lists the official news feeds of that country's
   immigration authority. A scheduled job opens one triage issue per new notice. Triage ends in
   one of: a rule update, a new route, a status change (a pilot made permanent, a route paused
   or closed), or "out of scope".
3. **At the moment of use.** When a mode starts it checks whether the local copy is behind the
   latest release and says which rule changes since then touch the routes the person is
   pursuing. `verify` can re-read the official sources for one route on demand, in the session.

**The rule:** detection is automatic and fast, but a number only changes through a reviewed
pull request with the official text quoted. The tool never rewrites a rule from a live page
on its own, because that would bring back the unverified, AI-read number this project exists
to avoid. When it sees a change it cannot yet confirm, it says so and links the official page.

To make status changes expressible, a route's `status` is one of `active`, `pilot`, `paused`
or `closed`, and a route or any single rule may carry `effective_from` and `effective_until`
dates, which the clocks then pick up.

### 6.7 career-ops bridge

Optional, and only ever touches career-ops user-layer files.

- Import: read `cv.md` and `config/profile.yml` from a configured career-ops path to pre-fill
  onboarding.
- Export: write a route-filter note (salary thresholds, eligible occupation codes, sponsorship
  needs for the routes being pursued) that the person can reference from their career-ops
  custom mode file.
- `job-check` accepts a career-ops report or saved job description as input.

### 6.8 Data contract and privacy

Same doctrine as career-ops: files are the source of truth, and system files never overlap
user files.

| Layer | Paths |
|---|---|
| System (updated by releases) | `engine/`, `routes/`, `origins/`, `modes/`, `scripts/`, `templates/`, `docs/`, `examples/` |
| User (never touched, git-ignored by default) | `config/profile.yml`, `data/`, `reports/`, `documents/`, `modes/_custom.md` |

- `documents/` is the person's own folder for scans. Modes track metadata about a document
  (have it, issue date, expiry) and do not read the file unless the person asks in that
  session.
- `doctor` warns when a user-layer file is tracked by git or the repo has a public remote.
- Updating is `git pull`. Because the user layer is git-ignored and never overlaps system
  paths, no custom updater is needed at first.
- Examples in the repo use fictional personas only.

### 6.9 Legal position

`LEGAL_DISCLAIMER.md` and a line in every report: this is general information compiled from
public official sources, it may be out of date, it is not legal or immigration advice, and
paid advice is regulated in several countries. Each `country.yml` links the official register
of licensed advisers. The project gives no opinion on an individual's chances beyond what the
published rules compute.

## 7. Technology

- Node.js 20 or later, ES modules, JSDoc types, no build step. This matches career-ops, so its
  community can read and contribute without a new toolchain.
- Dependencies kept minimal: a YAML parser and a JSON Schema validator. Tests use `node:test`.
- No database. Markdown and YAML files are canonical.
- GitHub Actions: tests, pack validation, link and source checks, CodeQL, scheduled freshness
  job, release automation.

## 8. Repository layout

```
AGENTS.md  CLAUDE.md  README.md  LICENSE  CONTRIBUTING.md  CODE_OF_CONDUCT.md
SECURITY.md  GOVERNANCE.md  LEGAL_DISCLAIMER.md  ARCHITECTURE.md  DATA_CONTRACT.md
ROADMAP.md  CHANGELOG.md
engine/        rules, points, facts, levers, clocks, schemas
routes/        <country>/country.yml, _shared/, <route>/{route.yml,points.yml,README.md,fixtures/}
origins/       <country>/origin.yml
modes/         one Markdown file per mode, _shared.md, _custom.template.md
scripts/       assess, validate, freshness, doctor, bridge
templates/     profile.example.yml and report templates
examples/      fictional personas and their generated reports
docs/          design, guides (adding a route, adding an origin, verifying a rule)
.github/       workflows, issue forms, PR template, CODEOWNERS
```

## 9. Contribution model

- MIT licence. Code of conduct. Security policy for reporting privacy issues.
- Conventional commits, with a `data` type for rule changes: `data(ca/express-entry): ...`.
- Every change through a branch and a pull request. CI must pass.
- Three kinds of contribution, each with its own guide and issue form:
  1. **Rule update**: a threshold or fee changed. Needs the official link and quoted text.
  2. **New route or origin pack**: needs schema-valid data, sources, and at least three
     fixtures (clearly eligible, clearly not, and an edge case).
  3. **Engine or mode change**: needs an approved issue first.
- Country maintainers are listed in CODEOWNERS and review data PRs for their country.
- Releases use semantic versioning with tags and GitHub Releases. Rule changes are called out
  in their own section of the changelog, because a user needs to know when a number moved.

## 10. Milestones

Each is stated as what will be true when it is done.

1. **Foundation.** The public repo exists with this design, the architecture and data
   contract, contribution standards, issue and PR templates, CI and release automation. A
   stranger can understand the project and knows how to contribute.
2. **First route end to end (v0.1.0).** A person with a filled profile gets a tested,
   source-cited Express Entry assessment (eligibility grid, ranking score, levers, clocks) from
   one script, and the `onboard` and `route` modes work on it.
3. **Canada and Germany packs (v0.2.0).** `assess` produces a route matrix across at least
   eight routes in two countries, including one nomination route and Germany's main work,
   job-seeker and vocational routes.
4. **From assessment to action (v0.3.0).** `plan`, `documents` and `tracker` work, the first
   origin pack (Uganda) exists, and costs show in the user's own currency.
5. **Trust layer (v0.4.0).** Scheduled jobs watch official sources and announcement feeds and
   open issues when something changes or a review date passes, `verify` drafts data PRs, and
   `sponsor-check` and `scam-check` work against official registers.
6. **career-ops bridge (v0.5.0).** Profile import, route-filter export, and `job-check`.
7. **Launch.** A README with a recorded demo, a write-up, contributor guides proven by an
   outside contribution, and Australia and UK packs open as "help wanted".

**Later, tracked but not scheduled:** Australia and UK packs; contributor packs for Poland,
Norway, the Netherlands, Ireland, Portugal, Austria, Denmark, Sweden, Finland, New Zealand and
the US diversity lottery; origin packs for other countries; a static website running the engine
in the browser with no server; translated modes; study and family routes.

## 11. Left to the builder

- The exact rule-language grammar and schema field names, within section 6.
- Which routes in each country make the first eight, decided from the official sources at the
  time, not from this document.
- Whether a given points grid fits the table interpreter or needs its own module.
- Report layout.

## 12. Risks

| Risk | Answer |
|---|---|
| A wrong or stale rule harms someone | Sources, dates, CI, the overdue marker, and the disclaimer. Unknown beats guessed. |
| Maintainer load as countries grow | Country CODEOWNERS, fixtures as mandatory tests, freshness issues that anyone can pick up. |
| Being read as unlicensed advice | Information framing, no individual predictions, links to adviser registers. |
| Sensitive data leaks | User layer git-ignored, `doctor` checks, documents never read by default. |
| Scope sprawl | Work routes in two countries first. Everything else has a named place in "Later". |
