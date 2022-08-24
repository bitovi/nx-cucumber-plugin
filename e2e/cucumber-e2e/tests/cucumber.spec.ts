import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

import {
  cucumberVersion
} from "../../../packages/cucumber/src/utils/versions";

describe('cucumber e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject('@bitovi/cucumber', 'dist/packages/cucumber');
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it('should create cucumber', async () => {
    const project = uniq('cucumber');
    await runNxCommandAsync(`generate @bitovi/cucumber:cucumber ${project}`);
    const result = await runNxCommandAsync(`e2e ${project}`);
    expect(result.stdout).toContain('Executor ran for Cucumber');
  }, 120000);

  describe('--init', () => {
    it('should install', async () => {
      await runNxCommandAsync(
        `generate @bitovi/cucumber:init`
      );

      const packageJson = readJson(`package.json`);
      expect(packageJson.devDependencies["@cucumber/cucumber"]).toBe(cucumberVersion);
    }, 120000);
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const project = uniq('cucumber');
      await runNxCommandAsync(
        `generate @bitovi/cucumber:cucumber ${project} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${project}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });
});
