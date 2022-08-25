/**
 * source: https://github.com/nrwl/nx/blob/master/packages/cypress/src/utils/project-name.ts
 */

import { names } from '@nrwl/devkit';

export function getUnscopedLibName(libRoot: string): string {
  return libRoot.slice(libRoot.lastIndexOf('/') + 1);
}

export function filePathPrefix(directory: string): string {
  return `${names(directory).fileName}`.replace(new RegExp('/', 'g'), '-');
}
