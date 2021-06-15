# ChainSafe UI Monorepo

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/700aaf66f15641be8db21e180064e252)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ChainSafe/files-ui&amp;utm_campaign=Badge_Grade)
[![Lint](https://github.com/ChainSafe/files-ui/actions/workflows/lint.yml/badge.svg?branch=dev)](https://github.com/ChainSafe/files-ui/actions/workflows/lint.yml)

## Mono Repo Structure 🏗

The repository is broken up into packages, managed using yarn workspaces. You can find these in the `packages` directory. These packages are as follows:

#### **`packages/common-components`**

Various components (atoms/molecules) that are used in the development of UI's. This package forms the base of the UI providing composable components, form elements, icons, small scope elements.


#### **`packages/common-theme`**

Theme context and other utilities for generating and using the theming capabilities

#### **`packages/files-ui`**

The UI for Chainsafe Files

#### **`packages/storage-ui`**

The UI for Chainsafe Storage

## Development

Requirements: 
- Node > 12
- Yarn > 1
- A Github Personal Access token with `read:package` permissions. 


The Github Personal Access token can be obtained [here](https://github.com/settings/tokens)

You then need to add it as environment variable, depending on your OS and shell:

- Edit `~/.bash_profile`, or for zsh `~/.zshenv` and add the following line `export GITHUB_PACKAGES_AUTH_TOKEN="YOUR_TOKEN_HERE"`
- Restart your shell and make sure the new variable is loaded, `echo $GITHUB_PACKAGES_AUTH_TOKEN` should print it.
- Run `yarn` at the root to install all project dependencies
- Run `yarn start:storybook` to start the component storybook  
  OR
- Create a `packages/files-ui/.env` based on `packages/files-ui/.env.example`
- Run `yarn start:files-ui` to start the development server.

## Run Tests

Our tests use Cypress running against the local instance of the Files UI. The files UI needs to run **before** the test are launched.
By default the tests are run against `localhost:3000`

- To start the tests UI run `yarn test:files-ui`
- To start all the tests like in CI run `yarn test:ci:files-ui` 

## License
All `files-ui` code are licensed under the [GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html) also included in our repository in the [LICENSE.md](https://github.com/ChainSafe/files-ui/blob/dev/LICENSE.md) file

© Copyright Protected & All Rights Reserved by [ChainSafe Systems](https://chainsafe.io)