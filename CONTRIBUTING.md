# Contributing to immigration-ops

Thank you for helping. People will make real decisions with what this project says, so the
standards below are strict where they protect users and light everywhere else.

## The one rule

**No number enters this repository without an official source.**

A threshold, a points value, a fee, a processing time, a document requirement: each one must
cite the government page it came from and the date you checked it. A blog, a forum, a
consultant's site or an AI model's memory can point you to the official page. None of them can
be the source.

If you cannot find an official source, do not guess. Open an issue and say what is missing.

## Ways to contribute

| Kind | What it is | Needs an issue first? |
|---|---|---|
| **Rule update** | A threshold, fee or requirement changed | No. Open a pull request with the official link and the quoted text. |
| **Route request** | You know a route that should be covered | It is the issue. Use the "Route request" form. |
| **Route pack** | Data, sources and test personas for one route | Yes, so two people do not build the same pack. |
| **Origin pack** | The starting line for applicants from one country | Yes, same reason. |
| **Bug report** | The tool computes something wrong or breaks | It is the issue. Use the "Bug" form. |
| **Engine or mode change** | Code or AI workflow behaviour | Yes. Wait for the issue to be accepted before writing code. |
| **Docs and translations** | Fixes, clearer wording, guides | No for small fixes. |

Route and origin packs open for contribution when v0.1.0 ships the pack format and the
validator. Until then, route requests with official links are the most useful contribution.

## Before you start

- Read the [design document](docs/design/2026-11-15-immigration-ops-design.md), sections 4 and 6.
- Read the [data contract](DATA_CONTRACT.md). Never commit personal data.
- Use Node.js 20 or later.

```bash
git clone https://github.com/<you>/immigration-ops.git
cd immigration-ops
npm ci
npm test
```

## Branches, commits and pull requests

1. Fork the repository and create a branch from `main`. Name it for the change, for example
   `data/ca-express-entry-fees` or `fix/age-on-leap-day`.
2. Keep commits small: one logical change each.
3. Use [Conventional Commits](https://www.conventionalcommits.org/). The pull request title
   must follow the same format, because it feeds the changelog.

   | Type | Use for |
   |---|---|
   | `feat` | A new capability |
   | `fix` | A bug fix |
   | `data` | A rule, fee, grid or source change in `routes/` or `origins/` |
   | `docs` | Documentation only |
   | `test` | Tests only |
   | `refactor` | Code change with no behaviour change |
   | `ci`, `build`, `chore` | Tooling |

   Put the pack in the scope for data changes: `data(ca/express-entry-fsw): update fees`.
4. Run `npm test` before you push. Once the validator exists, run `npm run validate` too.
5. Open a pull request and fill in the template. CI must pass.
6. A maintainer reviews it. Data changes are reviewed by the country maintainer in
   [CODEOWNERS](.github/CODEOWNERS).

## What a rule update needs

- The official URL, on a government domain listed in that country's `country.yml`.
- The exact text from the page that states the new value, quoted in the pull request.
- Updated `checked` and `verified` dates.
- Updated test personas (fixtures) if an expected result changes. If none changes, say why.

## What a route or origin pack needs

- Data that passes the schema.
- A source for every requirement, grid line, fee and timeline.
- At least three fictional test personas: one clearly eligible, one clearly not, one edge case.
  Their expected results are worked by hand from the official page, not by running the tool.
- A short `README.md` for the route in plain language.

Use invented people only. Never base a persona on a real person, including yourself.

## Code standards

- ES modules, JSDoc types, no build step.
- Engine code does no file or network access, so it can run in a browser later.
- Tests sit next to the code as `*.test.mjs` and use `node:test`.
- Add a dependency only when the standard library cannot reasonably do the job, and say why in
  the pull request.

## Writing standards

- Plain sentences. Short paragraphs. No marketing language.
- Say what is uncertain. "Unknown" is better than a confident guess.
- Never write in a way that reads as advice to an individual. The project states what the
  published rules say and what they compute for a profile.

## Using AI tools

AI assistants are welcome for code, tests and wording. They are not a source. A value that an
assistant "knows" must still be checked against the official page by you, and the pull request
must say you did. [AGENTS.md](AGENTS.md) holds the rules an assistant must follow in this
repository.

## Privacy

Do not put real passports, test reports, bank statements, names, dates of birth or case
numbers in issues, pull requests or commits. If you need to show a problem, reduce it to a
fictional profile that reproduces it.

## Conduct and security

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md) for anything that could expose a user's data.

## Releases

Maintainers release with semantic versioning. Merged pull requests feed an automated release
pull request, which updates [CHANGELOG.md](CHANGELOG.md), tags the version and publishes a
GitHub Release. Rule changes get their own changelog section, so users can see when a number
moved.

## Licence

By contributing you agree that your contribution is licensed under the [MIT License](LICENSE).
