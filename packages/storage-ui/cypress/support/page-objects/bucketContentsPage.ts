import { basePage } from "./basePage"

export const bucketContentsPage = {
  ...basePage,

  // bucket contents browser elements
  bucketHeaderLabel: () => cy.get("[data-cy=header-bucket]", { timeout: 20000 }),
  newFolderButton: () => cy.get("[data-testid=button-new-folder] "),
  uploadButton: () => cy.get("[data-testid=button-upload-file]"),

  // file / folder browser row elements
  fileItemKebabButton: () => cy.get("[data-testid=icon-file-item-kebab]", { timeout: 10000 }),
  fileItemName: () => cy.get("[data-cy=label-file-item-name]"),
  fileItemRow: () => cy.get("[data-cy=row-file-item]", { timeout: 20000 }),

  // kebab menu elements
  downloadMenuOption: () => cy.get("[data-cy=menu-download]"),
  renameMenuOption: () => cy.get("[data-cy=menu-rename]"),
  moveMenuOption: () => cy.get("[data-cy=menu-move]"),
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]")
}