# Architecture

A short map of how immigration-ops is put together. The reasoning behind each choice is in the
[design document](docs/design/2026-11-15-immigration-ops-design.md). The boundary between the
tool's files and your files is in [DATA_CONTRACT.md](DATA_CONTRACT.md).

This describes the target for v0.1.0. Parts not yet built are marked.

## Principles

- **Rules are data.** Versioned YAML with an official source and a verification date on every value.
- **Arithmetic is code.** A deterministic, tested engine computes eligibility and points.
- **Unknown is an answer.** Missing and assumed facts are shown, never guessed away.
- **Local-first.** No account, no server. Your files stay on your machine.
- **Human in the loop.** The tool prepares and tracks. You decide and submit.
- **AI-agnostic.** Workflows are Markdown files any coding CLI can run. The engine needs no AI.

## Component map

```
            routes/<country>/<route>/           origins/<country>/
            route.yml  points.yml  fixtures/    origin.yml          (planned)
                       \                          /
   config/profile.yml   \                        /
   (yours)       ───────► engine/ (deterministic) ◄──── as-of date
                           facts, rules, points,
                           levers, clocks
                                  │ JSON
                                  ▼
                 modes/*.md (AI: interview, explain, plan, draft)
                                  │
                                  ▼
          reports/   data/tracker.md   data/documents.md          (yours)
```

| Part | Path | State |
|---|---|---|
| Path contract | `engine/paths.mjs` | Built |
| Engine | `engine/` | Planned, v0.1.0 |
| Route packs | `routes/` | Planned, v0.1.0 onward |
| Origin packs | `origins/` | Planned, v0.3.0 |
| Scripts | `scripts/` (`assess`, `validate`, `doctor`) | Planned, v0.1.0 |
| Modes | `modes/` | Planned, v0.1.0 onward |

## Data flow

```
onboard ──► config/profile.yml ──► assess (engine, every active route) ──► route matrix
                                          │
                                          ├──► route (one route in depth) ──► reports/NNN-*.md
                                          └──► plan ──► data/documents.md, data/tracker.md
```

## Quality gates

- `npm test`: unit tests, next to the code they test.
- `npm run validate` (v0.1.0): every pack passes its schema, cites an official source for
  every value, and matches its hand-worked test personas.
- CI runs both on every pull request, checks internal links, and checks the pull request title.
- A scheduled job (v0.4.0) opens an issue for each pack past its review date.

## Where to start reading

- The reasoning: `docs/design/2026-11-15-immigration-ops-design.md`
- The boundary: `DATA_CONTRACT.md`
- The first build: `docs/plans/2026-11-15-v0.1.0-first-route.md`
- Rules for AI assistants working here: `AGENTS.md`
