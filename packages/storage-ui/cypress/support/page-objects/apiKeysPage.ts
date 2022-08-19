// Only add things here that could be applicable to the api keys page

import { basePage } from "./basePage"

export const apiKeysPage = {
  ...basePage,

  // main api keys elements
  apiKeysHeaderLabel: () => cy.get("[data-cy=header-api-keys]", { timeout: 20000 }),
  addApiKeyButton: () => cy.get("[data-cy=button-add-api-key]"),
  addS3KeyButton: () => cy.get("[data-cy=button-add-s3-key]"),

  // api keys table row elements
  apiKeyIdCell: () => cy.get("[data-cy=cell-api-keys-id]"),
  apiKeyTypeCell: () => cy.get("[data-cy=cell-api-keys-type]"),
  apiKeyStatusCell: () => cy.get("[data-cy=cell-api-keys-status]"),
  apiKeyRowKebabButton: () => cy.get("[data-testid=dropdown-title-api-keys-kebab]"),

  // kebab menu elements
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]")
}