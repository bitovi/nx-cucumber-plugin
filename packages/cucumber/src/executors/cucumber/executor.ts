/**
 * source: https://gist.github.com/elliottsj/fff86bc2b64ff68871f09cc0cd517393
 */

import { CucumberExecutorSchema } from './schema';
import { basename, dirname } from 'path';
import { ExecutorContext, logger } from '@nrwl/devkit';
import { startDevServer } from '../../utils/start-dev-server';
import { spawn } from '../../utils/child-process-helper';

export type Json = { [k: string]: any };

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CucumberExecutorOptions extends Json {}

export default async function runExecutor(options: CucumberExecutorSchema, context: ExecutorContext) {
  const watch = options.watch || options.watchAll;

  console.log('Executor ran for Cucumber', options);

  let success = false;

  for await (const baseUrl of startDevServer(options, context)) {
    console.log('baseUrl', baseUrl);

    try {
      success = await runCucumber(baseUrl, options, context);
      if (!watch) break;
    } catch (e) {
      logger.error(e.message);
      success = false;
      if (!watch) break;
    }
  }
  
  if (success) {
    logger.log('\nCucumber tests have all passed. Checkout the results at dist/cucumber/<app-name>/thing.json');
  }

  return { success };
}

/**
 * @whatItDoes Initialize the Cypress test runner with the provided project configuration.
 * By default, Cypress will run tests from the CLI without the GUI and provide directly the results in the console output.
 * If `watch` is `true`: Open Cypress in the interactive GUI to interact directly with the application.
 */
 async function runCucumber(baseUrl: string, options: CucumberExecutorOptions, context: ExecutorContext): Promise<boolean>
 {
  // // Cypress expects the folder where a `cypress.json` is present
  // const projectFolderPath = dirname(options.cypressConfig);
  // const options: any = {
  //   project: projectFolderPath,
  //   configFile: basename(options.cypressConfig),
  // };
  // // If not, will use the `baseUrl` normally from `cypress.json`
  // if (baseUrl) {
  //   options.config = { baseUrl };
  // }

  // if (options.browser) {
  //   options.browser = options.browser;
  // }

  // if (options.env) {
  //   options.env = options.env;
  // }
  // if (options.spec) {
  //   options.spec = options.spec;
  // }

  // options.tag = options.tag;
  // options.exit = options.exit;
  // options.headed = options.headed;

  // if (options.headless) {
  //   options.headless = options.headless;
  // }

  // options.record = options.record;
  // options.key = options.key;
  // options.parallel = options.parallel;
  // options.ciBuildId = options.ciBuildId?.toString();
  // options.group = options.group;
  // options.ignoreTestFiles = options.ignoreTestFiles;

  // if (options.reporter) {
  //   options.reporter = options.reporter;
  // }

  // if (options.reporterOptions) {
  //   options.reporterOptions = options.reporterOptions;
  // }

  // options.testingType = options.testingType;
  
  // https://github.com/cucumber/cucumber-js/blob/main/docs/installation.md#invalid-installations
  try {
    await spawn('npx', ['cucumber-js', '--config', options.config],{ env: { ...process.env, FORCE_COLOR: 'true' }, shell: true, stdio: 'pipe' }, (child => {
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    }));

    return true;
  } catch (error) {
    logger.debug(error);
    logger.error('Cucumber tests failed. See errors above');

    return false;
  }
}
