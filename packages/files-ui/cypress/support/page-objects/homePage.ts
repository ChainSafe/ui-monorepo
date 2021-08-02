import { basePage } from "./basePage"

export const click = ($el: JQuery<HTMLElement>) => $el.trigger("click")

export const homePage = {
  ...basePage,

  // main file browser elements
  uploadButton: () => cy.get("[data-cy=upload-modal-button]"),
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

  clickUploadButton: () => homePage.startUploadButton()
    .should("not.be.disabled")
  // this pipe is needed to prevent https://github.com/ChainSafe/ui-monorepo/issues/1146
  // as described https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
    .pipe(click)
    .should(($el: JQuery<HTMLElement>) => {
      expect($el).to.not.be.visible
    }),

  // helpers and convenience functions
  uploadFile(filePath: string) {
    this.uploadButton().click()
    this.uploadFileForm().attachFile(filePath)
    this.fileUploadList().should("have.length", 1)
    this.fileListRemoveButton().should("be.visible")
    this.clickUploadButton()

    // ensure upload is complete before proceeding
    this.uploadFileForm().should("not.exist")
    this.uploadStatusToast().should("not.exist")
  }

}

