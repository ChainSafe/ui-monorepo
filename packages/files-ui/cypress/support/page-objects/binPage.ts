import { basePage } from "./basePage"
import { fileBrowser } from "./fileBrowser"

export const binPage = {
  ...basePage,
  ...fileBrowser,

  // bin page specific file browser elements
  recoverSelectedButton: () => cy.get("[data-testid=button-recover-selected-file]"),
  deleteSelectedButton: () => cy.get("[data-testid=button-delete-selected-file]"),
  selectAllCheckbox: () => cy.get("[data-testid=checkbox-select-all]"),

  // kebab menu elements
  recoverMenuOption: () => cy.get("[data-cy=menu-recover]"),
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]")
}
