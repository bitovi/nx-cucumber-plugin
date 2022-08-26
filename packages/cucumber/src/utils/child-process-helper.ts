import {
  spawn as __node_spawn__,
  SpawnOptions,
  ChildProcess,
} from 'child_process';

/**
 * Promise wrapper for child_process.spawn
 */
export const spawn = async (
  command: string,
  args: readonly string[] = [],
  options: SpawnOptions = {},
  spawnCallback?: (spawnInstance: ChildProcess) => void
): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const spawnInstance = __node_spawn__(command, [...args], {
      stdio: 'inherit',
      ...options,
    });

    spawnCallback?.(spawnInstance);

    let code: unknown;
    let error: unknown;

    const setCode = (_code: unknown) => {
      code = _code;
    };

    const setError = (_error: unknown) => {
      error = _error;
    };

    spawnInstance.on('exit', (exitCode) => {
      setCode(exitCode);
    });

    spawnInstance.on('error', (spawnError) => {
      setError(spawnError);
    });

    spawnInstance.on('close', (closeCode) => {
      setCode(closeCode);

      spawnInstance.stdin?.end();

      if (error) {
        return reject(error);
      }

      if (code === 1) {
        return reject('Unexpected spawn failed. Exit code 1');
      }

      return resolve(code);
    });
  });
