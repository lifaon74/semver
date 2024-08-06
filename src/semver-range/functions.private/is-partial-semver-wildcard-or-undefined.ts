import { IPartialSemVerWildcardOrUndefined } from '../types/semver-range.types.js';
import { isPartialSemVerWildcard } from './is-partial-semver-wildcard.js';

export function isPartialSemVerWildcardOrUndefined(
  input: unknown,
): input is IPartialSemVerWildcardOrUndefined {
  return isPartialSemVerWildcard(input) || input === undefined;
}
