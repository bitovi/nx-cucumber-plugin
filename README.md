# Cucumber Nx Plugin

## Description

The Nx Plugin for Cucumber contains executors and generators allowing your workspace to use the powerful Cucumber integration testing capabilities.

Generates a Cucumber project that doesn't have a dependency for any assertion library. This provides flexibility for developers choose whatever assertion library they want to use. This allows for frictionless integration with end-to-end testing libraries such as [Playwright](https://playwright.dev/).

## Contributing

Before adding any new feature or a fix, make sure to open an issue first :)

1. Make sure to use the expected node/npm versions

```bash
node -v # v14.20.0
```

```bash
npm -v # 6.14.17
```

If you have the wrong versions, I suggest using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) or [volta](https://docs.volta.sh/guide/getting-started) for node version management.

2. Clone the project and install dependencies

```
git clone https://github.com/bitovi/nx-cucumber-plugin.git
npm install
```

3. Create a new branch

```bash
git checkout -b feature/some-feature
```

4. Add tests and make sure tests pass

```bash
npm run test # both jest and e2e tests
```

or

```bash
npm run test:demo # only demo
npm run test:lib # only ngx-feature-flag-router lib
```

You can also run unit and e2e tests separately

```bash
npm run jest # only jest tests
npm run e2e # only e2e tests
```

5. commit -> push -> create a pull request 🚀

### npm commands

```bash
npm run format # Use Nx formatter to format project
```

```bash
npm run build # Create a production build of Plugin located in dist directory. Used for publishing
```

```bash
npm run jest # Executes Jest unit tests for executers and generators
```

```bash
npm run e2e # Executes Jest e2e tests for Cucumber Nx plugin by creating a temporary Nx workspace
```

```bash
npm run test # Executes Jest unit and e2e tests for Cucumber Nx plugin
```

## Nx

This project was generated using [Nx](https://nx.dev).

🔎 **Smart, Fast and Extensible Build System**

### Resources

[Create an Nx Plugin](https://nx.dev/packages/nx-plugin#generating-a-plugin) - Steps to create an Nx plugin, write generators, executors, testing, and adding assets.

[Publish an Nx Plugin](https://nx.dev/packages/nx-plugin#publishing-your-nx-plugin) - Steps to build, publish, and add to Nx Plugin listings.

[Nx Plugin Directory](https://nx.dev/community#plugin-directory) - collection of published Nx Plugins.

1. [@nrwl/cypress](https://github.com/nrwl/nx/tree/master/packages/cypress)
2. [nx-plugins/nx-jest-playwright](https://github.com/Bielik20/nx-plugins/tree/master/packages/nx-jest-playwright)
3. [@nrwl/jest](https://github.com/nrwl/nx/tree/master/packages/jest)
