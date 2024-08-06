export type ISemVerRange =
  | ISemVerUnionRange
  | ISemVerIntersectionRange
  | ISemVerHyphenatedRange
  | ISemVerSimpleRange
  | ISemVerShortcutRange;

export interface ISemVerUnionRange {
  readonly type: 'union';
  readonly ranges: readonly any[];
}

export interface ISemVerIntersectionRange {
  readonly type: 'intersection';
  readonly ranges: readonly (ISemVerSimpleRange | ISemVerShortcutRange)[];
}

export interface ISemVerHyphenatedRange {
  readonly type: 'hyphenated';
  readonly left: IPartialSemVer;
  readonly right: IPartialSemVer;
}

export type ISemVerSimpleRangeOperator = '=' | '>' | '<' | '>=' | '<=';

export interface ISemVerSimpleRange {
  readonly type: 'simple';
  readonly operator: '' | ISemVerSimpleRangeOperator;
  readonly semver: IPartialSemVer;
}

export type ISemVerShortcutRangeOperator = '~' | '^';

export interface ISemVerShortcutRange {
  readonly type: 'shortcut';
  readonly operator: ISemVerShortcutRangeOperator;
  readonly semver: IPartialSemVer;
}

export type IPartialSemVerWildcard = '*' | 'x';
export type IPartialSemVerWildcardOrUndefined = IPartialSemVerWildcard | undefined;
export type IPartialSemVerNumberOrWildcard = number | IPartialSemVerWildcard;
export type IPartialSemVerNumberOrWildcardOrUndefined = number | IPartialSemVerWildcardOrUndefined;

export interface IPartialSemVer {
  readonly major: IPartialSemVerNumberOrWildcard;
  readonly minor: IPartialSemVerNumberOrWildcardOrUndefined;
  readonly patch: IPartialSemVerNumberOrWildcardOrUndefined;
  readonly prerelease: string | undefined;
  readonly build: string | undefined;
}
