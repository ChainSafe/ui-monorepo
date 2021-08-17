import { basePage } from "./basePage"
import { folderName } from "../../fixtures/filesTestData"
import { createFolderModal } from "./modals/createFolderModal"
import { fileUploadModal } from "./modals/fileUploadModal"

export const homePage = {
  ...basePage,

  // main file browser elements
  newFolderButton: () => cy.get("[data-cy=button-new-folder]"),
  uploadButton: () => cy.get("[data-cy=button-upload-file]"),
  moveSelectedButton: () => cy.get("[data-testId=button-move-selected-file]"),
  deleteSelectedButton: () => cy.get("[data-testId=button-delete-selected-file]"),
  uploadStatusToast: () => cy.get("[data-cy=upload-status-toast-message]", { timeout: 10000 }),

  // file browser row elements
  fileItemRow: () => cy.get("[data-cy=file-item-row]", { timeout: 20000 }),
  fileItemName: () => cy.get("[data-cy=file-item-name]"),
  fileRenameInput: () => cy.get("[data-cy=rename-form] input"),
  fileRenameSubmitButton: () => cy.get("[data-cy=rename-submit-button]"),
  fileRenameErrorLabel: () => cy.get("[data-cy=rename-form] span.minimal.error"),
  fileItemKebabButton: () => cy.get("[data-testid=dropdown-title-fileDropdown]"),

  // menu elements
  previewMenuOption: () => cy.get("[data-cy=menu-preview]"),
  downloadMenuOption: () => cy.get("[data-cy=menu-download]"),
  infoMenuOption: () => cy.get("[data-cy=menu-info]"),
  renameMenuOption: () => cy.get("[data-cy=menu-rename]"),
  moveMenuOption: () => cy.get("[data-cy=menu-move]"),
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]"),

  // helpers and convenience functions
  uploadFile(filePath: string) {
    this.uploadButton().click()
    fileUploadModal.body().attachFile(filePath)
    fileUploadModal.fileList().should("have.length", 1)
    fileUploadModal.removeFileButton().should("be.visible")
    fileUploadModal.uploadButton().safeClick()

    // ensure upload is complete before proceeding
    fileUploadModal.body().should("not.exist")
    this.uploadStatusToast().should("not.exist")
  },

  createFolder(name: string = folderName) {
    this.newFolderButton().click()
    createFolderModal.folderNameInput().type(name)
    createFolderModal.createButton().safeClick()
    createFolderModal.body().should("not.exist")
    this.fileItemName().contains(name)
  }

}

