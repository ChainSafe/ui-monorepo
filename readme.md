# Chainafe Files UI Monorepo

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

- Theme context and other utilities for generating and using the theming capabilities

#### 5\) **`packages/files-ui`**

The UI for Chainsafe Files

## Development

You will need a Github Personal Access token with `read:package` permissions. This can be obtained [here](https://github.com/settings/tokens)

You then need to add it as environment variable, depending on your OS and shell:

- Edit `~/.bash_profile`, or for zsh `~/.zshenv` and add the following line `export GITHUB_PACKAGES_AUTH_TOKEN="YOUR_TOKEN_HERE"`
- Restart your shell and make sure the new variable is loaded, `echo $GITHUB_PACKAGES_AUTH_TOKEN` should print it.
- Run `yarn` at the root to install all project dependencies
- Run `yarn start:storybook` to start the component storybook  
  OR
- Create a `packages/files-ui/.env` based on `packages/files-ui/.env.example`
- Run `yarn start:files-ui` to start the development server.
