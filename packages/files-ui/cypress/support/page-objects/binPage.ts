import { basePage } from "./basePage"

export const binPage = {
  ...basePage,

  // main file browser elements (bin view only)
  recoverSelectedButton: () => cy.get("[data-testId=button-recover-selected-file]"),
  deleteSelectedButton: () => cy.get("[data-testId=button-delete-selected-file]"),

  // file browser row elements
  fileItemRow: () => cy.get("[data-cy=file-item-row]", { timeout: 20000 }),
  fileItemName: () => cy.get("[data-cy=file-item-name]"),
  fileItemKebabButton: () => cy.get("[data-testid=dropdown-title-fileDropdown]"),

  // menu elements (bin view only)
  recoverMenuOption: () => cy.get("[data-cy=menu-recover]"),
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]"),

  // recover modal elements
  recoverFileModal: () => cy.get("[data-cy=modal-recover-file]"),
  folderList: () => cy.get("[data-cy=tree-folder-list]"),
  cancelButton: () => cy.get("[data-cy=button-cancel-recovery]"),
  recoverButton: () => cy.get("[data-cy=button-recover-file]"),
  moveErrorLabel: () => cy.get("[data-cy=label-move-file-error-message]")

}
