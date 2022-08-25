/**
 * source: https://github.com/Bielik20/nx-plugins/blob/master/packages/nx-jest-playwright/src/executors/jest-playwright/lib/start-dev-server.ts
 */

import { ExecutorContext, runExecutor } from '@nrwl/devkit';
import { CucumberExecutorOptions } from '../executors/cucumber/executor';

interface ExecutorResult {
  success: boolean;
  baseUrl?: string;
}

export async function* startDevServer(
  opts: CucumberExecutorOptions,
  context: ExecutorContext,
) {
  const watch = opts.watch || opts.watchAll;

  // no dev server, return the provisioned base url
  if (!opts.devServerTarget) {
    yield opts.baseUrl;
    return;
  }

  const [project, target, configuration] = opts.devServerTarget.split(':');

  for await (const output of await runExecutor<ExecutorResult>(
    { project, target, configuration },
    watch ? { watch } : {},
    context,
  )) {
    if (!output.success && !watch) {
      throw new Error('Could not compile application files');
    }

    yield opts.baseUrl || (output.baseUrl as string);
  }
}