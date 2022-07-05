import { basePage } from "./basePage"
import { createFolderModal } from "./modals/createFolderModal"
import { fileUploadModal } from "./modals/fileUploadModal"

export const bucketContentsPage = {
  ...basePage,

  // bucket content browser elements
  bucketHeaderLabel: () => cy.get("[data-cy=header-bucket]"),
  newFolderButton: () => cy.get("[data-testid=button-new-folder] "),
  uploadButton: () => cy.get("[data-testid=button-upload-file]"),

  // file or folder browser row elements
  fileItemKebabButton: () => cy.get("[data-testid=dropdown-title-file-item-kebab]"),
  fileItemName: () => cy.get("[data-cy=label-file-item-name]"),
  fileItemRow: () => cy.get("[data-cy=row-file-item]"),
  fileRenameInput: () => cy.get("[data-cy=input-rename-file-or-folder]"),
  fileRenameErrorLabel: () => cy.get("[data-cy=form-rename] span.minimal.error"),

  // kebab menu elements
  downloadMenuOption: () => cy.get("[data-cy=menu-download]"),
  renameMenuOption: () => cy.get("[data-cy=menu-rename]"),
  moveMenuOption: () => cy.get("[data-cy=menu-move]"),
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]"),

  // helpers and convenience functions
  awaitBucketRefresh() {
    cy.intercept("POST", "**/bucket/*/ls").as("refresh")
    cy.wait("@refresh")
  },

  uploadFileToBucket(filePath: string) {
    this.uploadButton().click()
    fileUploadModal.body().attachFile(filePath)
    fileUploadModal.fileList().should("have.length", 1)
    fileUploadModal.uploadButton().safeClick()
    fileUploadModal.body().should("not.exist")
    this.awaitBucketRefresh()
  },

  createNewFolder(folderName: string) {
    this.newFolderButton().click()
    createFolderModal.body().should("exist")
    createFolderModal.folderNameInput().type(folderName)
    createFolderModal.createButton().click()
    createFolderModal.body().should("not.exist")
  },

  renameFileOrFolder(newName: string) {
    bucketContentsPage.fileItemKebabButton().first().click()
    bucketContentsPage.renameMenuOption().click()
    bucketContentsPage.fileRenameInput().type(newName)
  }
}
