import { basePage } from "./basePage"

export const bucketContentsPage = {
  ...basePage,

  // bucket content browser elements
  bucketHeaderLabel: () => cy.get("[data-cy=header-bucket]"),
  newFolderButton: () => cy.get("[data-testid=button-new-folder] "),
  uploadButton: () => cy.get("[data-testid=button-upload-file]"),

  // file or folder browser row elements
  fileItemKebabButton: () => cy.get("[data-testid=icon-file-item-kebab]"),
  fileItemName: () => cy.get("[data-cy=label-file-item-name]"),
  fileItemRow: () => cy.get("[data-cy=row-file-item]"),

  // kebab menu elements
  downloadMenuOption: () => cy.get("[data-cy=menu-download]"),
  renameMenuOption: () => cy.get("[data-cy=menu-rename]"),
  moveMenuOption: () => cy.get("[data-cy=menu-move]"),
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]"),

  // helpers and convenience functions
  awaitBucketRefresh() {
    cy.intercept("POST", "**/bucket/*/ls").as("refresh")
    cy.wait("@refresh")
  }
}
