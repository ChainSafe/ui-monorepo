import { basePage } from "./basePage"
import { fileBrowser } from "./fileBrowser"
import { fileUploadModal } from "./modals/fileUploadModal"
import { uploadCompleteToast } from "./toasts/uploadCompleteToast"

export const homePage = {
  ...basePage,
  ...fileBrowser,

  // home page specific file browser elements
  newFolderButton: () => cy.get("[data-cy=button-new-folder]"),
  uploadButton: () => cy.get("[data-cy=button-upload-file]"),
  moveSelectedButton: () => cy.get("[data-testId=button-move-selected-file]"),
  deleteSelectedButton: () => cy.get("[data-testId=button-delete-selected-file]"),
  selectAllCheckbox: () => cy.get("[data-testId=checkbox-select-all]"),
  fileRenameInput: () => cy.get("[data-cy=rename-form] input"),
  fileRenameSubmitButton: () => cy.get("[data-cy=rename-submit-button]"),
  fileRenameErrorLabel: () => cy.get("[data-cy=rename-form] span.minimal.error"),

  // kebab menu elements
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
    uploadCompleteToast.body().should("be.visible")
    uploadCompleteToast.closeButton().click()
  }

}

