export interface CucumberExecutorSchema {
  watch?: boolean;
  watchAll?: boolean;
  baseUrl?: string;
  devServerTarget?: string;
  config?: string;
  tsconfig?: string;
  env?: ProcessEnv;
} // eslint-disable-line
