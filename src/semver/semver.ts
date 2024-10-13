import { compareSemVer } from './functions.private/compare-semver.js';
import { incrementSemVer } from './functions.private/increment-semver.js';
import { parseSemVer } from './functions.private/parse-semver.js';
import { serializeSemVer } from './functions.private/serialize-semver.js';
import { ISemVerCompareMode } from './types/semver-compare-mode.type.js';
import { ISemVerIncrementRelease } from './types/semver-increment-release.type.js';
import { ISemVerInput } from './types/semver-input.type.js';
import { ISemVer } from './types/semver.type.js';

/**
 * A class to parse and manage semver.
 *
 * @inheritDoc https://semver.org/
 * @inheritDoc https://github.com/npm/node-semver/blob/main/classes/semver.js
 */
export class SemVer implements ISemVer {
  static of(input: ISemVerInput): SemVer {
    if (input instanceof SemVer) {
      return input;
    } else {
      return new SemVer(input);
    }
  }

  readonly #major: number;
  readonly #minor: number;
  readonly #patch: number;
  readonly #prerelease: string | undefined;
  readonly #build: string | undefined;

  constructor(input: ISemVerInput) {
    if (typeof input === 'string') {
      input = parseSemVer(input);
      this.#major = input.major;
      this.#minor = input.minor;
      this.#patch = input.patch;
      this.#prerelease = input.prerelease;
      this.#build = input.build;
    } else if (input instanceof SemVer) {
      this.#major = input.major;
      this.#minor = input.minor;
      this.#patch = input.patch;
      this.#prerelease = input.prerelease;
      this.#build = input.build;
    } else {
      this.#major = mustBeSafeSemverVersion(input.major);
      this.#minor = mustBeSafeSemverVersion(input.minor);
      this.#patch = mustBeSafeSemverVersion(input.patch);
      this.#prerelease = mustBeSafeSemverPrereleaseOrBuild(input.prerelease);
      this.#build = mustBeSafeSemverPrereleaseOrBuild(input.build);
    }
  }

  get major(): number {
    return this.#major;
  }

  get minor(): number {
    return this.#minor;
  }

  get patch(): number {
    return this.#patch;
  }

  get prerelease(): string | undefined {
    return this.#prerelease;
  }

  get build(): string | undefined {
    return this.#build;
  }

  /**
   * Compares this SemVer with the input `input`:
   * - if this semver is equal to `input`, returns `0`
   * - if this semver is greater than `input`, returns `-1`
   * - if this semver is lower than `input`, returns `1`
   *
   * @example:
   * `ǹew Semver('1.2.3').compare('1.2.4')` => `-1`
   *
   * @param input The input to compare with this SemVer.
   * @param compareMode Compares the version, the prerelease, the build, or a mix.
   */
  compare(input: ISemVerInput, compareMode?: ISemVerCompareMode): number {
    return compareSemVer(this, SemVer.of(input), compareMode);
  }

  /**
   * Increments this SemVer.
   *
   * @param release The kind of increment to apply.
   * @returns A new `SemVer` with the incremented version.
   */
  increment(release: ISemVerIncrementRelease): SemVer {
    return new SemVer(incrementSemVer(this, release));
  }

  /**
   * Converts this SemVer to a valid semver string.
   */
  toString(): string {
    return serializeSemVer(this);
  }
}

/* FUNCTIONS */

function mustBeSafeSemverVersion(input: number): number {
  if (!Number.isSafeInteger(input) || input < 0) {
    throw new Error('Expected positive integer.');
  }
  return input;
}

function mustBeSafeSemverPrereleaseOrBuild(input: string | undefined): string | undefined {
  if (input === undefined) {
    return undefined;
  } else {
    input = input.trim();
    return input === '' ? undefined : input;
  }
}
