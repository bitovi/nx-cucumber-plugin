/**
 * source: https://github.com/nrwl/nx/blob/master/packages/cypress/src/generators/init/init.spec.ts
 */

import { readJson, Tree, updateJson } from '@nrwl/devkit';
import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';

import { cucumberVersion } from '../../utils/versions';
import { cucumberInitGenerator } from './init';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyV1Workspace();
  });

  it('should add dependencies into `package.json` file', async () => {
    expect(true).toBeTruthy();
    const existing = 'existing';
    const existingVersion = '1.0.0';
    updateJson(tree, 'package.json', (json) => {
      json.dependencies['@cucumber/cucumber'] = cucumberVersion;

      json.dependencies[existing] = existingVersion;
      json.devDependencies[existing] = existingVersion;
      return json;
    });
    cucumberInitGenerator(tree, {});
    const packageJson = readJson(tree, 'package.json');

    expect(packageJson.devDependencies['@cucumber/cucumber']).toBeDefined();
    expect(packageJson.devDependencies[existing]).toBeDefined();
    expect(packageJson.dependencies['@cucumber/cucumber']).toBeUndefined();
    expect(packageJson.dependencies[existing]).toBeDefined();
  });
});
