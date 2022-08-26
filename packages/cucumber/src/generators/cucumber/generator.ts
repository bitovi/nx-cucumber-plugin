import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  logger,
  names,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { CucumberGeneratorSchema } from './schema';

interface NormalizedSchema extends CucumberGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectOffsetFromRoot: string;
  featuresDirectory: string;
  stepDefinitionsDirectory: string;
  configDirectory: string;
  tsconfigDirectory: string;
}

interface E2eConfiguration {
  executor: string;
  options: {
    config?: string;
    tsconfig?: string;
    baseUrl?: string;
    devServerTarget?: string;
  };
}

function normalizeOptions(
  tree: Tree,
  options: CucumberGeneratorSchema
): NormalizedSchema {
  // const { appsDir } = getWorkspaceLayout(tree);
  const name = names(options.name).fileName;

  // const projectName = filePathPrefix(
  //   options.directory ? `${options.directory}-${options.name}` : options.name
  // );

  // const projectRoot = options.directory
  //   ? joinPathFragments(
  //       appsDir,
  //       names(options.directory).fileName,
  //       options.name
  //     )
  //   : joinPathFragments(appsDir, options.name);

  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const projectOffsetFromRoot = offsetFromRoot(projectRoot);
  const featuresDirectory = path.join(
    projectRoot,
    '/src/features/**/*.feature'
  );
  const stepDefinitionsDirectory = path.join(
    projectRoot,
    '/src/step-definitions/**/*.ts'
  );
  const configDirectory = path.join(projectRoot, '/cucumber.js');
  const tsconfigDirectory = path.join(projectRoot, '/tsconfig.json');

  return {
    ...options,
    projectName,
    projectRoot,
    projectOffsetFromRoot,
    featuresDirectory,
    stepDefinitionsDirectory,
    configDirectory,
    tsconfigDirectory,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: options.projectOffsetFromRoot,
    template: '',
    tmpl: '',
  };

  if (!tree.exists('cucumber.preset.js')) {
    createCucumberPreset(tree, options);
  }

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

function createCucumberPreset(tree: Tree, options: NormalizedSchema): void {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: '',
    template: '',
    tmpl: '',
  };

  generateFiles(tree, path.join(__dirname, 'root'), '', templateOptions);
}

function getDevServerTarget(tree: Tree, projectName: string): string {
  const project = readProjectConfiguration(tree, projectName);

  if (project.targets?.serve && project.targets?.serve?.defaultConfiguration) {
    return `${projectName}:serve:${project.targets.serve.defaultConfiguration}`;
  }

  return `${projectName}:serve`;
}

function getE2eTargetConfiguration(tree: Tree, options: NormalizedSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const e2eConfiguration: E2eConfiguration = {
    executor: '@bitovi/cucumber:cucumber',
    options: {
      config: normalizedOptions.configDirectory,
      tsconfig: normalizedOptions.tsconfigDirectory,
    },
  };

  if (options.baseUrl) {
    e2eConfiguration.options.baseUrl = options.baseUrl;

    return e2eConfiguration;
  }

  if (options.project) {
    e2eConfiguration.options.devServerTarget = getDevServerTarget(
      tree,
      options.project
    );

    return e2eConfiguration;
  }

  logger.warn('Either project or baseUrl should be specified');

  return e2eConfiguration;
}

export default async function (tree: Tree, options: CucumberGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      e2e: getE2eTargetConfiguration(tree, normalizedOptions),
    },
    tags: [],
    implicitDependencies: options.project ? [options.project] : undefined,
  });

  addFiles(tree, normalizedOptions);

  await formatFiles(tree);
}
