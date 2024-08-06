import {
  IPartialSemVer,
  ISemVerHyphenatedRange,
  ISemVerIntersectionRange,
  ISemVerRange,
  ISemVerShortcutRange,
  ISemVerSimpleRange,
  ISemVerUnionRange,
} from '../types/semver-range.types.js';

/**
 * @deprecated
 */
export function simplifySemVerRange(input: ISemVerRange): ISemVerRange {
  switch (input.type) {
    case 'union':
      return simplifySemVerUnionRange(input);
    case 'intersection':
      return simplifySemVerIntersectionRange(input);
    case 'hyphenated':
      return simplifySemVerHyphenatedRange(input);
    case 'simple':
      return simplifySemVerSimpleRange(input);
    case 'shortcut':
      return simplifySemVerShortcutRange(input);
  }
}

function simplifySemVerUnionRange(input: ISemVerUnionRange): ISemVerRange {
  // TODO
  if (input.ranges.length === 1) {
    return simplifySemVerRange(input.ranges[0]);
  } else {
    return input;
  }
}

function simplifySemVerIntersectionRange(input: ISemVerIntersectionRange): ISemVerRange {
  // TODO
  if (input.ranges.length === 1) {
    return simplifySemVerRange(input.ranges[0]);
  } else {
    return input;
  }
}

function simplifySemVerHyphenatedRange(input: ISemVerHyphenatedRange): ISemVerRange {
  throw 'TODO';
}

function simplifySemVerSimpleRange({ operator, semver }: ISemVerSimpleRange): ISemVerRange {
  if (operator === '=') {
    return {
      type: 'simple',
      operator: '',
      semver: simplifyPartialSemVer(semver),
    } satisfies ISemVerSimpleRange;
  } else {
    return {
      type: 'simple',
      operator: operator,
      semver: simplifyPartialSemVer(semver),
    } satisfies ISemVerSimpleRange;
  }
}

function simplifySemVerShortcutRange(input: ISemVerShortcutRange): ISemVerRange {
  // TODO
  switch (input.operator) {
    case '~':
      return {
        type: 'intersection',
        ranges: [],
      };
    case '^':
      return {
        type: 'intersection',
        ranges: [],
      };
  }
}

function simplifyPartialSemVer({
  major,
  minor,
  patch,
  prerelease,
  build,
}: IPartialSemVer): IPartialSemVer {
  if (major === '*') {
    major = 'x';
  }

  if (minor === '*') {
    minor = 'x';
  }

  if (patch === '*') {
    patch = 'x';
  }

  // if (prerelease === undefined && build === undefined) {
  //   if (patch === 'x') {
  //     patch = undefined; // can be removed
  //     if (minor === 'x') {
  //       minor = undefined; // can be removed
  //
  //       if (major === 'x') {
  //         major = '*'; // any
  //       }
  //     }
  //   }
  // }

  return {
    major,
    minor,
    patch,
    build,
    prerelease,
  };
}
