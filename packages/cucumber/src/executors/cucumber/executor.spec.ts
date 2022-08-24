import { CucumberExecutorSchema } from './schema';
import executor from './executor';

const options: CucumberExecutorSchema = {};

describe('Cucumber Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
