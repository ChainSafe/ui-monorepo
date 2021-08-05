import { basePage } from "./basePage"
import { folderName } from "../../fixtures/filesTestData"

export const click = ($el: JQuery<HTMLElement>) => $el.trigger("click")

export const homePage = {
  ...basePage,

  // main file browser elements
  newFolderButton: () => cy.get("[data-cy=button-new-folder]"),
  uploadButton: () => cy.get("[data-cy=button-upload-file]"),
  uploadFileForm: () => cy.get("[data-cy=upload-file-form] input", { timeout: 20000 }),
  moveSelectedButton: () => cy.get("[data-testId=button-move-selected-file]"),
  deleteSelectedButton: () => cy.get("[data-testId=button-delete-selected-file]"),
  deleteFileDialog: () => cy.get("[data-testid=modal-container-file-deletion]"),
  deleteFileCancelButton: () => cy.get("[data-testid=button-cancel-deletion]"),
  deleteFileConfirmButton: () => cy.get("[data-testid=button-confirm-deletion]"),
  uploadStatusToast: () => cy.get("[data-cy=upload-status-toast-message]", { timeout: 10000 }),

  // file browser row elements
  fileItemRow: () => cy.get("[data-cy=file-item-row]", { timeout: 20000 }),
  fileItemName: () => cy.get("[data-cy=file-item-name]"),
  fileRenameInput: () => cy.get("[data-cy=rename-form] input"),
  fileRenameSubmitButton: () => cy.get("[data-cy=rename-submit-button]"),
  fileRenameErrorLabel: () => cy.get("[data-cy=rename-form] span.minimal.error"),
  fileItemKebabButton: () => cy.get("[data-testid=dropdown-title-fileDropdown]"),

  // create folder modal elements
  createFolderModal: () => cy.get("[data-cy=modal-create-folder]", { timeout: 10000 }),
  folderNameInput: () => cy.get("[data-cy=input-folder-name]"),
  cancelButton: () => cy.get("[data-cy=button-cancel-create-folder]"),
  createButton: () => cy.get("[data-cy=button-create-folder]"),
  folderCreationErrorLabel: () => cy.get("[data-cy=folder-creation-form] span.default.error"),

  // upload modal elements
  startUploadButton: () => cy.get("[data-testId=button-start-upload]"),
  uploadCancelButton: () => cy.get("[data-testId=button-cancel-upload]"),
  fileListRemoveButton: () => cy.get("[data-testid=button-remove-from-file-list]"),
  fileUploadList: () => cy.get("[data-testid=file-list-fileUpload] li"),
  fileUploadDropzone : () => cy.get("[data-testid=file-input-dropzone-fileUpload]"),

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
    this.uploadFileForm().attachFile(filePath)
    this.fileUploadList().should("have.length", 1)
    this.fileListRemoveButton().should("be.visible")
    this.startUploadButton().safeClick()

    // ensure upload is complete before proceeding
    this.uploadFileForm().should("not.exist")
    this.uploadStatusToast().should("not.exist")
  },

  createFolder(name: string = folderName) {
    this.newFolderButton().click()
    this.folderNameInput().type(name)
    this.createButton().safeClick()
    this.createFolderModal().should("not.exist")
    this.fileItemName().contains(name)
  }

}

