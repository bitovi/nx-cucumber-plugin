/**
 * source: https://gist.github.com/elliottsj/fff86bc2b64ff68871f09cc0cd517393
 */

import { CucumberExecutorSchema } from './schema';
import { ExecutorContext, logger } from '@nrwl/devkit';
import { startDevServer } from '../../utils/start-dev-server';
import { spawn } from '../../utils/child-process-helper';

export interface CucumberExecutorOptions extends CucumberExecutorSchema {
  baseUrl: string;
  env: NodeJS.ProcessEnv;
}

export default async function runExecutor(
  options: CucumberExecutorSchema,
  context: ExecutorContext
) {
  const watch = options.watch || options.watchAll;

  console.log('Executor ran for Cucumber', options);

  let success = false;

  for await (const baseUrl of startDevServer(options, context)) {
    try {
      const normalizedOptions = normalizeOptions(options, baseUrl);

      success = await runCucumber(normalizedOptions, context);
    } catch (error) {
      logger.error(error.message);
      success = false;
    }

    if (!watch) break;
  }

  return { success };
}

/**
 * @whatItDoes Initialize the Cypress test runner with the provided project configuration.
 * By default, Cypress will run tests from the CLI without the GUI and provide directly the results in the console output.
 * If `watch` is `true`: Open Cypress in the interactive GUI to interact directly with the application.
 */
async function runCucumber(
  options: CucumberExecutorOptions,
  context: ExecutorContext
): Promise<boolean> {
  // https://github.com/cucumber/cucumber-js/blob/main/docs/installation.md#invalid-installations
  try {
    const env: NodeJS.ProcessEnv = {
      // Existing process environment variables
      ...process.env,
      // Preserves the output color in terminal
      FORCE_COLOR: 'true',
      // Schema option environment variables overrides
      ...options.env,
      // baseUrl for hosted server
      baseUrl: options.baseUrl,
    };

    if (options.tsconfig) {
      // Override ts-node's default tsconfig path
      // Each Cucumber application is expected to override this path
      env.TS_NODE_PROJECT = options.tsconfig;
    }

    const args = ['cucumber-js'];

    if (options.config) {
      // Override Cucumber's default Cucumber configuration path
      // Each Cucumber application is expected to override this path
      args.push('--config', options.config);
    }

    await spawn(
      'npx',
      args,
      {
        env,
        shell: true,
        stdio: 'pipe',
      },
      (child) => {
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
      }
    );

    return true;
  } catch (error) {
    logger.debug(error);
    logger.error('Cucumber tests failed. See errors above');

    return false;
  }
}

function normalizeOptions(
  options: CucumberExecutorSchema,
  baseUrl?: string
): CucumberExecutorOptions {
  return {
    ...options,
    env: options.env ?? {},
    // Schema baseUrl or fallback to derived baseUrl from `startDevServer`
    baseUrl: options.baseUrl ?? baseUrl,
  };
}
