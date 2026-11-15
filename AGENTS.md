# AGENTS.md

Instructions for AI coding assistants working in this repository, whichever CLI runs them.
`CLAUDE.md` points here.

## What this project is

immigration-ops turns a person's profile into assessed migration routes. Rules live as data
in `routes/`, a deterministic engine in `engine/` does all arithmetic, and Markdown modes in
`modes/` handle the conversation. Read `ARCHITECTURE.md` and `DATA_CONTRACT.md` first.

## Rules you must follow

1. **Never state an immigration rule from memory.** No threshold, points value, fee,
   cut-off, processing time or document requirement may come from your training data. It
   comes from a pack file, from engine output, or from an official page you opened in this
   session. If none of those has it, say it is unknown and give the official page.
2. **Never do points arithmetic yourself.** Run the engine and quote its output.
3. **When you add or change a value in `routes/` or `origins/`,** open the official page,
   record the URL and today's date as `checked`, and quote the page's text in the pull
   request. If you cannot reach the page, stop and say so.
4. **Show uncertainty.** A missing fact is "unknown". An assumed or planned fact is labelled.
5. **Do not read `documents/`** unless the user asks you to in this session. Do not copy
   personal details into any file outside the user layer.
6. **Never commit a user-layer path.** See `engine/paths.mjs`. Never `git add -A`.
7. **Fictional personas only** in fixtures, examples, tests, issues and pull requests.
8. **Information, not advice.** Do not tell a person what they should do with their life or
   predict a decision. Say what the published rules compute for the profile given.
9. **Prepare, never submit.** Do not fill government forms, book appointments or send
   anything to an authority.

## Working here

- Node.js 20 or later, ES modules, JSDoc types, no build step.
- Tests: `npm test`. They sit next to the code as `*.test.mjs`.
- Engine modules do no file or network access.
- Every change goes through a branch and a pull request. Conventional Commits, with `data`
  for rule changes. See `CONTRIBUTING.md`.
- Plain writing in everything public: short sentences, no marketing language.

## Modes

Modes arrive with v0.1.0. This table is updated as they ship.

| Mode | State |
|---|---|
| `onboard`, `route` | Planned, v0.1.0 |
| `assess`, `compare` | Planned, v0.2.0 |
| `plan`, `documents`, `tracker` | Planned, v0.3.0 |
| `verify`, `sponsor-check`, `scam-check` | Planned, v0.4.0 |
| `job-check` | Planned, v0.5.0 |
