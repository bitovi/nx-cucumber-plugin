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
    // Placeholder dependency name
    const existing = 'existing';
    // Placeholder dependency version
    const existingVersion = '1.0.0';

    updateJson(tree, 'package.json', (json) => {
      json.dependencies['@cucumber/cucumber'] = cucumberVersion;

      // Ensure that dependencies and DevDependencies exist
      json.dependencies[existing] = existingVersion;
      json.devDependencies[existing] = existingVersion;
      return json;
    });

    cucumberInitGenerator(tree, {});

    const packageJson = readJson(tree, 'package.json');

    // Check devDependencies
    expect(packageJson.devDependencies['@bitovi/cucumber']).toBeDefined();
    expect(packageJson.devDependencies['@cucumber/cucumber']).toBeDefined();
    expect(packageJson.devDependencies[existing]).toBeDefined();

    // Check dependencies
    expect(packageJson.dependencies['@bitovi/cucumber']).toBeUndefined();
    expect(packageJson.dependencies['@cucumber/cucumber']).toBeUndefined();
    expect(packageJson.dependencies[existing]).toBeDefined();
  });
});
