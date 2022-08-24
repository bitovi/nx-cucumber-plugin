/**
 * source: https://github.com/nrwl/nx/blob/master/packages/cypress/src/utils/project-name.ts
 */

import { names } from '@nrwl/devkit';

export function getUnscopedLibName(libRoot: string): string {
  return libRoot.slice(libRoot.lastIndexOf('/') + 1);
}

export function getE2eProjectName(
  targetProjectName: string,
  targetLibRoot: string,
  cypressDirectory?: string
): string {
  if (cypressDirectory) {
    return `${filePathPrefix(cypressDirectory)}-${getUnscopedLibName(
      targetLibRoot
    )}-e2e`;
  }
  return `${targetProjectName}-e2e`;
}

export function filePathPrefix(directory: string): string {
  return `${names(directory).fileName}`.replace(new RegExp('/', 'g'), '-');
}
