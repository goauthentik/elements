# Building the elements

Building is driven through the script `build.mjs`, and a collection of asynchronous functions kept
in the `lib` folder. Each function describes a step in the build process, and each is named as
informatively as possible: `transformScssToCss`, `transformCssToLitCss`, `compileTypescriptFiles`,
etc.

The typescript compiler currently in use is SWC.  There is a Sass layer, but it has been deprecated
in favor of modern CSS.  Our Typescript configuration is based on `@goauthentik/tsconfig`.

The build places all compiled artifacts, and copies any required assets, into the `./dist` folder.

We use `@goauthentik/eslint-config` and eslint, but also `lit-analyze` and
`custom-elements-manifest/analyzer`.

# Testing the elements

The component and builder files are tested using WebdriverIO 9's Unit Test facility.

All tests are conducted out of the `./dist/` folder. We test what we deploy, not what a third-party
compiler thinks we're going to deploy.

# Demonstrations and documentation for the library

Storybook is used. Most components have multiple stories, along with a configurable "stock" variant.
We use Custom Elements Manifest to build the properties and attributes documents for the component,
which relies on accurate JSDoc blocks in the component.

# Formatting

We use the `@goauthentik/prettier-config` configuration exclusively.

