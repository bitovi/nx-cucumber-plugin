import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { CucumberGeneratorSchema } from './schema';

// Disable publish warning from Cucumber
process.env.CUCUMBER_PUBLISH_ENABLED = 'false';

describe('cucumber generator', () => {
  let appTree: Tree;
  const options: CucumberGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
