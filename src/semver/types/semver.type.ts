export interface ISemVer {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease?: string | undefined;
  readonly build?: string | undefined;
}
