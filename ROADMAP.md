# Roadmap

Each milestone is stated as what will be true when it is done. Versions follow
[semantic versioning](https://semver.org/). Dates are left out on purpose: this is built
alongside a real move, and a correct rule matters more than a deadline.

## Milestones

| # | Milestone | Done when | Version |
|---|---|---|---|
| 1 | **Foundation** | The public repository has the design, the data contract, contribution standards, issue and pull request templates, CI and release automation. A stranger can understand the project and knows how to contribute. | v0.0.1 |
| 2 | **First route end to end** | A person with a filled profile gets a tested, source-cited Express Entry (Federal Skilled Worker) assessment from one script: eligibility, points, levers and clocks. The `onboard` and `route` modes work on it. | v0.1.0 |
| 3 | **Canada and Germany packs** | `assess` produces a route matrix across at least eight routes in two countries, including a nomination route and Germany's main work, job-search and vocational routes. | v0.2.0 |
| 4 | **From assessment to action** | `plan`, `documents` and `tracker` work, the first origin pack (Uganda) exists, and costs show in the user's own currency. | v0.3.0 |
| 5 | **Trust layer** | Scheduled freshness checks open issues for overdue packs, `verify` drafts data pull requests, and `sponsor-check` and `scam-check` work against official public registers. | v0.4.0 |
| 6 | **career-ops bridge** | Profile import, route-filter export, and `job-check` for a posting or offer. | v0.5.0 |
| 7 | **Launch** | The README has a recorded demo, there is a public write-up, the contributor guides have been proven by an outside contribution, and Australia and United Kingdom packs are open as "help wanted". | v0.6.0 |

The detailed plan for milestone 2 is in
[`docs/plans/2026-11-15-v0.1.0-first-route.md`](docs/plans/2026-11-15-v0.1.0-first-route.md).
Each later milestone gets its own plan when it starts.

## Countries

| Stage | Countries | Who |
|---|---|---|
| First | Canada, Germany | Maintainer |
| Next | Australia, United Kingdom | Open for co-maintainers |
| Contributor packs | Poland, Norway, the Netherlands, Ireland, Portugal, Austria, Denmark, Sweden, Finland, New Zealand, United States (diversity lottery) | Contributors, one country maintainer each |

A country moves up when someone commits to maintaining it. If you know a country's rules,
open a route request with the official links.

## Origin packs

Uganda is first. Any country can be added by someone who has applied from it.

## Later, not scheduled

- A static website that runs the engine in the browser, with no server and no data collected,
  for people who do not use a terminal.
- Study, family and investor routes.
- Translated modes.
- A terminal dashboard for the tracker.

## Out of scope

- Submitting applications, filling government forms or booking appointments.
- A hosted service with user accounts.
- Individual advice or predictions beyond what the published rules compute.
