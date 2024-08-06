import {
  IPartialSemVer,
  ISemVerHyphenatedRange,
  ISemVerIntersectionRange,
  ISemVerRange,
  ISemVerShortcutRange,
  ISemVerSimpleRange,
  ISemVerUnionRange,
} from '../types/semver-range.types.js';

export function serializeSemVerRange(input: ISemVerRange): string {
  switch (input.type) {
    case 'union':
      return serializeSemVerUnionRange(input);
    case 'intersection':
      return serializeSemVerIntersectionRange(input);
    case 'hyphenated':
      return serializeSemVerHyphenatedRange(input);
    case 'simple':
      return serializeSemVerSimpleRange(input);
    case 'shortcut':
      return serializeSemVerShortcutRange(input);
  }
}

function serializeSemVerUnionRange(input: ISemVerUnionRange): string {
  return input.ranges.map(serializeSemVerRange).join(' || ');
}

function serializeSemVerIntersectionRange(input: ISemVerIntersectionRange): string {
  return input.ranges.map(serializeSemVerRange).join(' ');
}

function serializeSemVerHyphenatedRange(input: ISemVerHyphenatedRange): string {
  return `${serializePartialSemVer(input.left)} - ${serializePartialSemVer(input.right)}`;
}

function serializeSemVerSimpleRange(input: ISemVerSimpleRange): string {
  return `${input.operator}${serializePartialSemVer(input.semver)}`;
}

function serializeSemVerShortcutRange(input: ISemVerShortcutRange): string {
  return `${input.operator}${serializePartialSemVer(input.semver)}`;
}

function serializePartialSemVer(input: IPartialSemVer): string {
  let str: string = `${input.major}`;

  if (input.minor !== undefined) {
    str += `.${input.minor}`;
  }

  if (input.patch !== undefined) {
    str += `.${input.patch}`;
  }

  if (input.prerelease !== undefined) {
    str += `-${input.prerelease}`;
  }

  if (input.build !== undefined) {
    str += `+${input.build}`;
  }

  return str;
}
