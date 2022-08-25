import { CucumberExecutorSchema } from './schema';
import executor from './executor';

const options: CucumberExecutorSchema = {};

describe('Cucumber Executor', () => {
  it('can run', async () => {
    const context = {} as any;
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
