import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { USER_PATHS, SYSTEM_PATHS, isUserPath, isSystemPath } from './paths.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Ask git whether it would ignore a path. Exit code 0 means ignored. */
function isIgnored(path) {
  // A directory rule only matches something inside the directory.
  const probe = path.endsWith('/') ? `${path}probe.txt` : path;
  try {
    execFileSync('git', ['check-ignore', '-q', probe], { cwd: root });
    return true;
  } catch {
    return false;
  }
}

test('no path is both a user path and a system path', () => {
  for (const u of USER_PATHS) {
    assert.ok(!SYSTEM_PATHS.includes(u), `${u} is listed in both layers`);
  }
});

test('every user path is ignored by git', () => {
  for (const u of USER_PATHS) {
    assert.ok(isIgnored(u), `${u} must be ignored by git, see DATA_CONTRACT.md`);
  }
});

test('no system directory is ignored by git', () => {
  for (const s of SYSTEM_PATHS) {
    assert.ok(!isIgnored(s), `${s} is a system path and must not be ignored`);
  }
});

test('a user file inside a system directory stays a user file', () => {
  assert.equal(isUserPath('modes/_custom.md'), true);
  assert.equal(isSystemPath('modes/_custom.md'), false);
  assert.equal(isSystemPath('modes/route.md'), true);
});

test('paths inside user directories are user paths', () => {
  assert.equal(isUserPath('data/tracker.md'), true);
  assert.equal(isUserPath('documents/passport.pdf'), true);
  assert.equal(isUserPath('engine/facts.mjs'), false);
});

test('a path in neither layer belongs to neither', () => {
  assert.equal(isUserPath('README.md'), false);
  assert.equal(isSystemPath('README.md'), false);
});

test('DATA_CONTRACT.md documents every path in both layers', () => {
  const doc = readFileSync(join(root, 'DATA_CONTRACT.md'), 'utf8');
  for (const p of [...USER_PATHS, ...SYSTEM_PATHS]) {
    assert.ok(doc.includes(`\`${p}\``), `DATA_CONTRACT.md does not mention ${p}`);
  }
});
