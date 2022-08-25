import {
  spawn as __node_spawn__,
  SpawnOptions,
  ChildProcessWithoutNullStreams,
} from 'child_process';

/**
 * Promise wrapper for child_process.spawn
 */
export const spawn = async (
  command: string,
  args: readonly string[] = [],
  options: SpawnOptions = {},
  spawnCallback?: (spawnInstance: ChildProcessWithoutNullStreams) => void
): Promise<unknown> => {
  

  return new Promise((resolve, reject) => {
    const spawnInstance = __node_spawn__(command, [...args], {
      stdio: 'inherit',
      ...options,
    });

    spawnCallback?.(spawnInstance);

    let code: unknown;
    let error: unknown;

    const setCode = (_code: unknown) => {
      code = _code;
      // return handleComplete();
    };

    const setError = (_error: unknown) => {
      error = _error;
      // return handleComplete();
    };

    const handleComplete = () => {
      spawnInstance.stdin?.end();

      if (error) {
        return reject(error);
      }

      if (code === 1) {
        return reject('Unexpected spawn failed. Exit code 1');
      }

      return resolve(code);
    };

    spawnInstance.on('exit', (exitCode) => {
      setCode(exitCode);
    });

    spawnInstance.on('error', (spawnError) => {
      setError(spawnError);
    });

    spawnInstance.on('close', (closeCode) => {
      setCode(closeCode);

      handleComplete();
    });
  }).then(res => {
    return new Promise(function(resolve, reject) {
        // Setting 2000 ms time
        setTimeout(() => {
          process.stdout.write('AFTER ALL IS SAID AND DONE');
          console.log("THIS TOO SHALL END");
          resolve(res);
        }, 2000);
    }).then(function() {
        console.log("Wrapped setTimeout after 2000ms");
    }) as any;
  });
};
