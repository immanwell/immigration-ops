# Security policy

immigration-ops handles sensitive personal information on the user's own machine. A flaw that
could expose that information is treated as a security issue, even if it is not a classic
vulnerability.

## What to report privately

- Anything that could cause a user's profile, reports or documents to be committed, uploaded
  or sent anywhere without their clear intent.
- A mode or script that reads files under `documents/` without being asked.
- A dependency or workflow issue that could run untrusted code.
- A route or origin pack source that points to a malicious or impersonating site.

## How to report

Use GitHub's private vulnerability reporting:
[Report a vulnerability](https://github.com/immanwell/immigration-ops/security/advisories/new).

Please do not open a public issue for these. Do not include real personal documents in a
report. A fictional profile that reproduces the problem is enough.

You can expect a first reply within seven days. Fixes for confirmed issues are released as
soon as they are ready and credited to the reporter unless they prefer otherwise.

## Supported versions

Before v1.0.0 only the latest release is supported.

## Not a security issue

A wrong or outdated rule is serious, but it is not confidential. Report it in public with the
"Rule is wrong or out of date" issue form so other users can see it.
