import { basePage } from "./basePage"

export const homePage = {
  ...basePage,

  // main browser elements
  uploadButton: () => cy.get("[data-cy=upload-modal-button]"),
  uploadFileForm: () => cy.get("[data-cy=upload-file-form] input"),

  // file browser row elements
  fileItemRow: () => cy.get("[data-cy=file-item-row]"),
  fileItemName: () => cy.get("[data-cy=file-item-name]"),
  fileRenameInput: () => cy.get("[data-cy=rename-form] input"),
  fileRenameSubmitButton: () => cy.get("[data-cy=rename-submit-button]"),
  fileRenameErrorLabel: () => cy.get("[data-cy=rename-form] span.minimal.error"),
  fileItemKebabButton: () => cy.get("[data-testid=dropdown-title-fileDropdown]"),

  // upload modal elements
  startUploadButton: () => cy.get("[data-cy=upload-ok-button]"),
  uploadCancelButton: () => cy.get("[data-cy=upload-cancel-button"),
  fileListCloseButton: () => cy.get("[data-testid=file-list-close-button-fileUpload]"),
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

    // get count of current items in list
    let preExistingItems = 0
    
    if this.fileItemRow().length != 0 {
      preExistingItems = this.fileItemRow().length
    }

    // invoke upload modal dialog
    this.uploadButton().click()

    // attach file
    this.uploadFileForm().attachFile(filePath)
    this.startUploadButton().click()

    // Wait for upload to complete by ensuring the upload modal has disappeared
    this.uploadFileForm().should("not.exist")

    const currentItems = this.fileItemRow().
    cy.log("Pre-existing file count: " + String(preExistingItems))
    cy.log("Current file count: " + String(currentItems))
    if (currentItems != preExistingItems + 1) {
      cy.log("The amount of files did not increase as expected")
    }
  }
}



