import { ISemVerIncrementRelease } from '../types/semver-increment-release.type.js';
import { ISemVer } from '../types/semver.type.js';

export function incrementSemVer(input: ISemVer, release: ISemVerIncrementRelease): ISemVer {
  switch (release) {
    case 'major':
      return incrementSemVerMajor(input);
    case 'premajor':
      return incrementSemVerPreMajor(input);
    case 'minor':
      return incrementSemVerMinor(input);
    case 'preminor':
      return incrementSemVerPreMinor(input);
    case 'patch':
      return incrementSemVerPatch(input);
    case 'prepatch':
      return incrementSemVerPrePatch(input);
    case 'prerelease':
      return incrementSemVerPreRelease(input);
  }
}

function incrementSemVerMajor(input: ISemVer): ISemVer {
  return {
    major: input.major + 1,
    minor: 0,
    patch: 0,
    prerelease: undefined,
    build: undefined,
  };
}

function incrementSemVerPreMajor(input: ISemVer): ISemVer {
  return {
    major: input.major + 1,
    minor: 0,
    patch: 0,
    prerelease: '0',
    build: undefined,
  };
}

function incrementSemVerMinor(input: ISemVer): ISemVer {
  return {
    major: input.major,
    minor: input.minor + 1,
    patch: 0,
    prerelease: undefined,
    build: undefined,
  };
}

function incrementSemVerPreMinor(input: ISemVer): ISemVer {
  return {
    major: input.major,
    minor: input.minor + 1,
    patch: 0,
    prerelease: '0',
    build: undefined,
  };
}

function incrementSemVerPatch(input: ISemVer): ISemVer {
  return {
    major: input.major,
    minor: input.minor,
    patch: input.patch + 1,
    prerelease: undefined,
    build: undefined,
  };
}

function incrementSemVerPrePatch(input: ISemVer): ISemVer {
  return {
    major: input.major,
    minor: input.minor,
    patch: input.patch + 1,
    prerelease: '0',
    build: undefined,
  };
}

function incrementSemVerPreRelease(input: ISemVer): ISemVer {
  if (input.prerelease === undefined) {
    return incrementSemVerPrePatch(input);
  } else {
    let index: number = input.prerelease.length;

    while (index > 0) {
      const version: number = parseInt(input.prerelease.slice(index - 1));
      if (Number.isNaN(version) || version < 0) {
        break;
      } else {
        index--;
      }
    }

    let prerelease: string;

    if (index === input.prerelease.length) {
      prerelease = `${input.prerelease}.0`;
    } else {
      prerelease = `${input.prerelease.slice(0, index)}${parseInt(input.prerelease.slice(index)) + 1}`;
    }

    return {
      major: input.major,
      minor: input.minor,
      patch: input.patch,
      prerelease,
      build: undefined,
    };
  }
}
