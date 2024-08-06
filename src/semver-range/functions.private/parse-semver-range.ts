import {
  IPartialSemVer,
  ISemVerHyphenatedRange,
  ISemVerIntersectionRange,
  ISemVerRange,
  ISemVerShortcutRange,
  ISemVerShortcutRangeOperator,
  ISemVerSimpleRange,
  ISemVerSimpleRangeOperator,
  ISemVerUnionRange,
} from '../types/semver-range.types.js';
import { isPartialSemVerWildcardOrUndefined } from './is-partial-semver-wildcard-or-undefined.js';
import { isPartialSemVerWildcard } from './is-partial-semver-wildcard.js';

export function parseSemVerRange(input: string): ISemVerRange {
  const unions: string[] = input.split('||');

  if (unions.length === 1) {
    return parseSemVerIntersectionOrHyphenatedSimpleOrShortcutRange(unions[0].trim());
  } else {
    return {
      type: 'union',
      ranges: unions.map((input: string): any => {
        return parseSemVerIntersectionOrHyphenatedSimpleOrShortcutRange(input.trim());
      }),
    } satisfies ISemVerUnionRange;
  }
}

function parseSemVerIntersectionOrHyphenatedSimpleOrShortcutRange(
  input: string,
): ISemVerIntersectionRange | ISemVerHyphenatedRange | ISemVerSimpleRange | ISemVerShortcutRange {
  const index: number = input.indexOf(' - ');

  if (index === -1) {
    const intersections: string[] = input.split(/\s+/);

    if (intersections.length === 1) {
      return parseSemVerSimpleOrShortcutRange(input);
    } else {
      return {
        type: 'intersection',
        ranges: intersections.map((input: string): any => {
          return parseSemVerSimpleOrShortcutRange(input);
        }),
      } satisfies ISemVerIntersectionRange;
    }
  } else {
    return {
      type: 'hyphenated',
      left: parsePartialSemVer(input.slice(0, index).trimEnd()),
      right: parsePartialSemVer(input.slice(index + 3).trimStart()),
    } satisfies ISemVerHyphenatedRange;
  }
}

function parseSemVerSimpleOrShortcutRange(
  input: string,
): ISemVerSimpleRange | ISemVerShortcutRange {
  for (const operator of ['=', '>=', '<=', '>', '<']) {
    if (input.startsWith(operator)) {
      return {
        type: 'simple',
        operator: operator as ISemVerSimpleRangeOperator,
        semver: parsePartialSemVer(input.slice(operator.length)),
      } satisfies ISemVerSimpleRange;
    }
  }

  for (const operator of ['~', '^']) {
    if (input.startsWith(operator)) {
      return {
        type: 'shortcut',
        operator: operator as ISemVerShortcutRangeOperator,
        semver: parsePartialSemVer(input.slice(operator.length)),
      } satisfies ISemVerShortcutRange;
    }
  }

  return {
    type: 'simple',
    operator: '',
    semver: parsePartialSemVer(input),
  } satisfies ISemVerSimpleRange;
}

const PARTIAL_SEMVER_REGEXP =
  /^(?<major>0|[1-9]\d*|\*|x)(?:\.(?<minor>0|[1-9]\d*|\*|x))?(?:\.(?<patch>0|[1-9]\d*|\*|x))?(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<build>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

function parsePartialSemVerVersion<GFunction extends (input: unknown) => input is any>(
  input: unknown,
  isFnc: GFunction,
): number | (GFunction extends (input: unknown) => input is infer GIs ? GIs : never) {
  return isFnc(input) ? input : Number(input);
}

function parsePartialSemVer(input: string): IPartialSemVer {
  const match: RegExpExecArray | null = PARTIAL_SEMVER_REGEXP.exec(input);
  if (match === null) {
    throw new Error('Malformed partial semver.');
  }

  return {
    major: parsePartialSemVerVersion(match.groups!.major, isPartialSemVerWildcard),
    minor: parsePartialSemVerVersion(match.groups!.minor, isPartialSemVerWildcardOrUndefined),
    patch: parsePartialSemVerVersion(match.groups!.patch, isPartialSemVerWildcardOrUndefined),
    build: match.groups!.build,
    prerelease: match.groups!.prerelease,
  };
}
