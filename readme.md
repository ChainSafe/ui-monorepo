# Chainafe Imploy UI Monorepo

Imploy UI monorepo

## Requirements

- Node > 12
- Yarn > 1

## Mono Repo Structure 🏗

The repository is broken up into 4 main packages, managed using yarn workspaces. You can find these in the `packages` directory. These packages are as follows:

#### 1\) **`packages/common-components`**

Various components (atoms/molecules) that are used in the development of UI's. This package forms the base of the UI providing composable components, form elements, icons, small scope elements.

#### 2\) **`packages/common-contexts`**

Various React Context API wrappers

#### 3\) **`packages/common-modules`**

Complex Modules such as Billing, Login modules, basically shared wide scope/opinionated components, that meet some cross-cutting business concern.

#### 4\) **`packages/common-themes`**

- Theme definitions for the projects (light, dark, etc)

#### 5\) **`packages/files-ui`**

The UI for Chainsafe Files

## Requirements

- Node ~10
- Yarn >1

## Development

- Run `yarn` at the root to install all project dependencies
- Run `yarn start:storybook` to start the component storybook  
  OR
- Create a `packages/files-ui/.env` based on `packages/files-ui/.env.sample`
- Run `yarn start:files-ui` to start the development server.
