import { CucumberExecutorSchema } from './schema';
import executor from './executor';

const options: CucumberExecutorSchema = {
  // Prevent Cucumber from warning that you can view published results
  args: ['--publish-quiet'],
};

describe('Cucumber Executor', () => {
  it('can run', async () => {
    const context = {} as any;
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
