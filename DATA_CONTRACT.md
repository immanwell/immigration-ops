# Data contract

This document defines which files belong to **you** and which belong to the **tool**. It is
enforced by a test (`engine/paths.test.mjs`).

Immigration data is more sensitive than most: passports, bank statements, family details.
The contract exists so that updating the tool can never touch your data, and so that your data
can never end up in a public repository by accident.

## Your files (the user layer)

Never modified by an update. Ignored by git by default.

| Path | Purpose |
|---|---|
| `config/profile.yml` | Your profile: age, education, experience, languages, funds, family, preferences |
| `data/` | Your tracker, document checklist and history |
| `reports/` | Your generated assessments and plans |
| `documents/` | Your own scans and certificates. The tool tracks facts about a document (have it, issue date, expiry). It does not open the file unless you ask in that session. |
| `modes/_custom.md` | Your own rules and preferences for how the modes behave |

## The tool's files (the system layer)

Updated by releases. Safe to overwrite.

| Path | Purpose |
|---|---|
| `engine/` | The deterministic engine and its schemas |
| `routes/` | Route packs: rules, points grids, sources, test personas |
| `origins/` | Origin packs |
| `modes/` | AI workflows (everything except `modes/_custom.md`) |
| `scripts/` | Command-line entry points |
| `templates/` | Profile and report templates |
| `docs/` | Design, plans and guides |
| `examples/` | Worked examples using fictional personas |

## Rules

1. A user path is never a system path. The test fails if the two lists overlap.
2. Every user path is ignored by git. The test fails if one is not.
3. Files are the source of truth. Any index or cache is derived and safe to delete.
4. Examples and test personas are fictional. Real personal data never enters the system layer.
5. Updating is `git pull`. Because of rules 1 and 2, it cannot touch your files.

## If you want to back up your data

Keep your user layer in a **private** repository of your own, or copy it somewhere you
control. Do not remove the ignore rules in a fork that has a public remote. The `doctor`
command (v0.1.0) warns when a user file is tracked by git.
