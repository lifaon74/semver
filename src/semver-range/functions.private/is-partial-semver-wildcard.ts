import { IPartialSemVerWildcard } from '../types/semver-range.types.js';

export function isPartialSemVerWildcard(input: unknown): input is IPartialSemVerWildcard {
  return input === '*' || input === 'x';
}
