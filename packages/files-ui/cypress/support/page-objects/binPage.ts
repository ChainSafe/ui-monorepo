import { basePage } from "./basePage"

export const binPage = {
  ...basePage,

  // main file browser elements (bin view only)
  recoverSelectedButton: () => cy.get("[data-cy=recover_selected_file_button]"),
  deleteSelectedButton: () => cy.get("[data-cy=delete_selected_file_button]"),

  // file browser row elements
  fileItemRow: () => cy.get("[data-cy=file-item-row]", { timeout: 20000 }),
  fileItemName: () => cy.get("[data-cy=file-item-name]"),
  fileItemKebabButton: () => cy.get("[data-testid=dropdown-title-fileDropdown]"),

  // menu elements (bin view only)
  recoverMenuOption: () => cy.get("[data-cy=menu-recover]"),
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]")
}
