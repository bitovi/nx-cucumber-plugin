import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { filePathPrefix } from '../../utils/project-name';
import { CucumberGeneratorSchema } from './schema';

interface NormalizedSchema extends CucumberGeneratorSchema {
  projectName: string;
  projectRoot: string;
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

  return {
    ...options,
    projectName,
    projectRoot,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function (tree: Tree, options: CucumberGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      e2e: {
        executor: '@bitovi/cucumber:cucumber',
      },
    },
    tags: [],
    implicitDependencies: options.project ? [options.project] : undefined,
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
