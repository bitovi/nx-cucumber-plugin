/**
 * source: https://gist.github.com/elliottsj/fff86bc2b64ff68871f09cc0cd517393
 */

import { CucumberExecutorSchema } from './schema';
import { ExecutorContext, logger } from '@nrwl/devkit';
import { startDevServer } from '../../utils/start-dev-server';
import { spawn } from '../../utils/child-process-helper';
import { ChildProcess, SpawnOptions } from 'child_process';
import { handleErrors } from 'nx/src/utils/params';

export interface CucumberExecutorOptions extends CucumberExecutorSchema {
  baseUrl?: string;
  env: NodeJS.ProcessEnv;
  args: string[];
}

export default async function runExecutor(
  options: CucumberExecutorSchema,
  context: ExecutorContext
) {
  const watch = options.watch || options.watchAll;

  console.log('Executor ran for Cucumber', options);

  let success = false;

  // Run Cucumber for each application that serves
  for await (const baseUrl of startDevServer(options, context)) {
    try {
      const normalizedOptions = normalizeOptions(options, baseUrl);

      success = await runCucumber(normalizedOptions);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
      } else {
        logger.error(error);
      }

      success = false;
    }

    // Wait if Spawn option has watch or watchAll
    if (!watch) break;
  }

  return { success };
}

/**
 * @whatItDoes Initialize the Cypress test runner with the provided project configuration.
 * By default, Cypress will run tests from the CLI without the GUI and provide directly the results in the console output.
 * If `watch` is `true`: Open Cypress in the interactive GUI to interact directly with the application.
 */
async function runCucumber(options: CucumberExecutorOptions): Promise<boolean> {
  // https://github.com/cucumber/cucumber-js/blob/main/docs/installation.md#invalid-installations
  try {
    const env = getProcessEnv(options);
    const args = getArgs(options);
    const spawnOptions = getSpawnOptions(env);

    await spawnCucumber(args, spawnOptions, process);

    return true;
  } catch (error) {
    handleError(error);

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
    args: options.args ?? [],
  };
}

function getProcessEnv(options: CucumberExecutorOptions): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    // Existing process environment variables
    ...process.env,
    // Preserves the output color in terminal
    FORCE_COLOR: 'true',
    // Schema option environment variables overrides
    ...options.env,
  };

  // baseUrl for hosted server
  if (options.baseUrl) {
    env.BASE_URL = options.baseUrl;
  }

  if (options.tsconfig) {
    // Override ts-node's default tsconfig path
    // Each Cucumber application is expected to override this path
    env.TS_NODE_PROJECT = options.tsconfig;
  }

  return env;
}

function getArgs(options: CucumberExecutorOptions): string[] {
  const args = ['cucumber-js'];

  if (options.config) {
    // Override Cucumber's default Cucumber configuration path
    // Each Cucumber application is expected to override this path
    args.push('--config', options.config);
  }

  // Add any args from Schema
  args.push(...options.args);

  return args;
}

function getSpawnOptions(env: NodeJS.ProcessEnv): SpawnOptions {
  return {
    env,
    shell: true,
    stdio: 'pipe',
  };
}

function getSyncStdioFunction(
  parentProcess: NodeJS.Process
): (childProcess: ChildProcess) => void {
  return (childProcess: ChildProcess) => {
    const { stdout, stderr } = childProcess;

    if (!stdout) {
      logger.warn("stdout not defined for child process. Output won't display");
    } else {
      stdout.pipe(parentProcess.stdout);
    }

    if (!stderr) {
      logger.warn(
        "stdout not defined for child process. Error output won't display"
      );
    } else {
      stderr.pipe(parentProcess.stderr);
    }
  };
}

async function spawnCucumber(
  args: string[],
  spawnOptions: SpawnOptions,
  parentProcess: NodeJS.Process
): Promise<unknown> {
  return spawn('npx', args, spawnOptions, getSyncStdioFunction(parentProcess));
}

function handleError(error: unknown): void {
  logger.debug(error);
  logger.error('Cucumber tests failed. See errors above');
}
