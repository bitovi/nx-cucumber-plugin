import { CucumberExecutorSchema } from './schema';

export default async function runExecutor(options: CucumberExecutorSchema) {
  console.log('Executor ran for Cucumber', options);
  
  return {
    success: true,
  };
}
