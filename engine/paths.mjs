/**
 * The data contract in code. DATA_CONTRACT.md explains it; paths.test.mjs enforces it.
 *
 * USER_PATHS belong to the person using the tool. Releases never touch them and git ignores
 * them. SYSTEM_PATHS belong to the tool and are replaced by updates.
 *
 * A path ending in "/" is a directory.
 */

/** @type {readonly string[]} */
export const USER_PATHS = Object.freeze([
  'config/profile.yml',
  'data/',
  'reports/',
  'documents/',
  'modes/_custom.md',
]);

/** @type {readonly string[]} */
export const SYSTEM_PATHS = Object.freeze([
  'engine/',
  'routes/',
  'origins/',
  'modes/',
  'scripts/',
  'templates/',
  'docs/',
  'examples/',
]);

/**
 * True when `path` is a user path or sits inside a user directory.
 * @param {string} path repository-relative path with forward slashes
 * @returns {boolean}
 */
export function isUserPath(path) {
  return USER_PATHS.some((p) => (p.endsWith('/') ? path.startsWith(p) : path === p));
}

/**
 * True when `path` belongs to the tool. A user path listed inside a system directory
 * (for example modes/_custom.md) is not a system path.
 * @param {string} path repository-relative path with forward slashes
 * @returns {boolean}
 */
export function isSystemPath(path) {
  if (isUserPath(path)) return false;
  return SYSTEM_PATHS.some((p) => path.startsWith(p));
}
