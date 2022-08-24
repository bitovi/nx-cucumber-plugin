/**
 * source: https://github.com/nrwl/nx/blob/master/packages/cypress/src/generators/init/init.ts
 */

import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  removeDependenciesFromPackageJson,
  Tree,
} from '@nrwl/devkit';
import { cucumberVersion, nxVersion } from '../../utils/versions';
import { Schema } from './schema';

function updateDependencies(host: Tree) {
  removeDependenciesFromPackageJson(host, ['@bitovi/cucumber'], []);

  return addDependenciesToPackageJson(
    host,
    {},
    {
      ['@bitovi/cucumber']: nxVersion,
      ['@cucumber/cucumber']: cucumberVersion,
    }
  );
}

export function cucumberInitGenerator(host: Tree, options: Schema) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return !options.skipPackageJson ? updateDependencies(host) : () => {};
}

export default cucumberInitGenerator;
export const cucumberInitSchematic = convertNxGenerator(cucumberInitGenerator);
