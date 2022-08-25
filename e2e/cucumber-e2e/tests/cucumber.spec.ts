import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runCommandAsync,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

import {
  cucumberVersion
} from "../../../packages/cucumber/src/utils/versions";

const TIMEOUT = 120000;

const createAngularProject = async (project: string) => {
  await runNxCommandAsync(`generate @nrwl/angular:app ${project} --e2eTestRunner none --unitTestRunner none --skipTests true`);
}

describe('cucumber e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(async () => {
    ensureNxProject('@bitovi/cucumber', 'dist/packages/cucumber');

    // await runCommandAsync(`npm install -D @nrwl/angular`);

    await runNxCommandAsync(
      `generate @bitovi/cucumber:init`
    );
  }, TIMEOUT);

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  describe('--init', () => {
    it('should install @cucumber/cucumber', async () => {
      // await runNxCommandAsync(
      //   `generate @bitovi/cucumber:init`
      // );

      const packageJson = readJson(`package.json`);

      expect(packageJson.devDependencies["@cucumber/cucumber"]).toBe(cucumberVersion);
    }, TIMEOUT);
  });

  describe('default', () => {
    it('should create cucumber application', async () => {
      const project = uniq('cucumber');
  
      await runNxCommandAsync(`generate @bitovi/cucumber:cucumber ${project}-alone`);
  
      const result = await runNxCommandAsync(`e2e ${project}-alone`);
  
      expect(result.stdout).toContain('Executor ran for Cucumber');
    }, TIMEOUT);
  });

  describe('--project', () => {
    it('should be usable with some (Angular) project', async () => {
      const project = 'moo';
  
      await createAngularProject(project);
  
      await runNxCommandAsync(`generate @bitovi/cucumber:cucumber ${project}-e2e --project ${project}`);
  
      const result = await runNxCommandAsync(`e2e ${project}-e2e`);
  
      expect(result.stdout).toContain('Executor ran for Cucumber');
    }, TIMEOUT * 2);
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const project = uniq('cucumber');

      await runNxCommandAsync(
        `generate @bitovi/cucumber:cucumber ${project} --directory subdir`
      );

      expect(() =>
        checkFilesExist(`apps/subdir/${project}/src/features`)
      ).not.toThrow();
    }, TIMEOUT);
  });
});
