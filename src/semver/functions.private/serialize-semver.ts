import { ISemVer } from '../types/semver.type.js';

export function serializeSemVer(input: ISemVer): string {
  let str: string = `${input.major}.${input.minor}.${input.patch}`;

  if (input.prerelease !== undefined) {
    str += `-${input.prerelease}`;
  }

  if (input.build !== undefined) {
    str += `+${input.build}`;
  }

  return str;
}
