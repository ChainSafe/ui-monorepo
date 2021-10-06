import { basePage } from "./basePage"
import { fileBrowser } from "./fileBrowser"

export const binPage = {
  ...basePage,
  ...fileBrowser,

  // bin page specific file browser elements
  recoverSelectedButton: () => cy.get("[data-testId=button-recover-selected-file]"),
  deleteSelectedButton: () => cy.get("[data-testId=button-delete-selected-file]"),
  selectAllCheckbox: () => cy.get("[data-testId=checkbox-select-all]"),

  // kebab menu elements
  recoverMenuOption: () => cy.get("[data-cy=menu-recover]"),
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]")
}
