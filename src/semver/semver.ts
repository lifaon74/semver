import { compareSemVer } from './functions.private/compare-semver.js';
import { incrementSemVer } from './functions.private/increment-semver.js';
import { parseSemVer } from './functions.private/parse-semver.js';
import { serializeSemVer } from './functions.private/serialize-semver.js';
import { ISemVerCompareMode } from './types/semver-compare-mode.type.js';
import { ISemVerIncrementRelease } from './types/semver-increment-release.type.js';
import { ISemVerInput } from './types/semver-input.type.js';

/**
 * @inheritDoc https://semver.org/
 * @inheritDoc https://github.com/npm/node-semver/blob/main/classes/semver.js
 */
export class SemVer {
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

  compare(input: ISemVerInput, compareMode?: ISemVerCompareMode): number {
    return compareSemVer(this, SemVer.of(input), compareMode);
  }

  increment(release: ISemVerIncrementRelease): SemVer {
    return new SemVer(incrementSemVer(this, release));
  }

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
