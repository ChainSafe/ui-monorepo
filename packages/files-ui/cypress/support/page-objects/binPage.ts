import { basePage } from "./basePage"
import { fileBrowser } from "./fileBrowser"

export const binPage = {
  ...basePage,
  ...fileBrowser,

  // bin page specific file browser elements
  recoverSelectedButton: () => cy.get("[data-testId=button-recover-selected-file]"),
  deleteSelectedButton: () => cy.get("[data-testId=button-delete-selected-file]"),
  permanentDeleteSuccessToast: () => cy.get("[data-testId=toast-deletion-success]", { timeout: 10000 }),

  // kebab menu elements
  recoverMenuOption: () => cy.get("[data-cy=menu-recover]"),
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]")
}
