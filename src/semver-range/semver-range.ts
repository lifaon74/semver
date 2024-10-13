import { SemVer } from '../semver/semver.js';
import { ISemVerInput } from '../semver/types/semver-input.type.js';
import { parseSemVerRange } from './functions.private/parse-semver-range.js';

import { serializeSemVerRange } from './functions.private/serialize-semver-range.js';
import { testSemVerRange } from './functions.private/test-semver-range.js';
import { ISemVerRangeInput } from './types/semver-range-input.type.js';
import { ISemVerRange } from './types/semver-range.types.js';

/**
 * A class to parse and manage semver ranges.
 *
 * @inheritDoc https://devhints.io/semver
 * @inheritDoc https://jubianchi.github.io/semver-check
 */
export class SemVerRange {
  static of(input: ISemVerRangeInput): SemVerRange {
    if (input instanceof SemVerRange) {
      return input;
    } else {
      return new SemVerRange(input);
    }
  }

  readonly #ast: ISemVerRange;

  constructor(input: ISemVerRangeInput) {
    if (typeof input === 'string') {
      this.#ast = parseSemVerRange(input);
    } else {
      this.#ast = input.ast;
    }
  }

  get ast(): ISemVerRange {
    return this.#ast;
  }

  /**
   * Tests if `input` is inside this SemVerRange.
   *
   * @param input The semver to test.
   * @returns Returns `true` if the `input` is inside this `SemVerRange`.
   */
  test(input: ISemVerInput): boolean {
    return testSemVerRange(this.ast, SemVer.of(input));
  }

  /**
   * Converts this SemVerRange to a valid semver range string.
   */
  toString(): string {
    return serializeSemVerRange(this.ast);
  }
}
