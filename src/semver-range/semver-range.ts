import { SemVer } from '../semver/semver.js';
import { ISemVerInput } from '../semver/types/semver-input.type.js';
import { parseSemVerRange } from './functions.private/parse-semver-range.js';

import { serializeSemVerRange } from './functions.private/serialize-semver-range.js';
import { testSemVerRange } from './functions.private/test-semver-range.js';
import { ISemVerRange } from './types/semver-range.types.js';

/**
 * @inheritDoc https://devhints.io/semver
 * @inheritDoc https://jubianchi.github.io/semver-check
 */
export class SemVerRange {
  readonly #ast: ISemVerRange;

  constructor(input: string) {
    this.#ast = parseSemVerRange(input);
  }

  get ast(): ISemVerRange {
    return this.#ast;
  }

  test(input: ISemVerInput): boolean {
    return testSemVerRange(this.ast, SemVer.of(input));
  }

  toString(): string {
    return serializeSemVerRange(this.ast);
  }
}
