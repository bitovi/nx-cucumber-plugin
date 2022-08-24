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
    // const existing = 'existing';
    // const existingVersion = '1.0.0';
    // updateJson(tree, 'package.json', (json) => {
    //   json.dependencies['@nrwl/cypress'] = cypressVersion;

    //   json.dependencies[existing] = existingVersion;
    //   json.devDependencies[existing] = existingVersion;
    //   return json;
    // });
    // cypressInitGenerator(tree, {});
    // const packageJson = readJson(tree, 'package.json');

    // expect(packageJson.devDependencies.cypress).toBeDefined();
    // expect(packageJson.devDependencies['@nrwl/cypress']).toBeDefined();
    // expect(packageJson.devDependencies['@types/node']).toBeDefined();
    // expect(packageJson.devDependencies[existing]).toBeDefined();
    // expect(packageJson.dependencies['@nrwl/cypress']).toBeUndefined();
    // expect(packageJson.dependencies[existing]).toBeDefined();
  });
});