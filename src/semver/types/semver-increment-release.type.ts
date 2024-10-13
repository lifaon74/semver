/**
 * The kind of increment to apply to the semver.
 */
export type ISemVerIncrementRelease =
  | 'major'
  | 'premajor'
  | 'minor'
  | 'preminor'
  | 'patch'
  | 'prepatch'
  | 'prerelease';
