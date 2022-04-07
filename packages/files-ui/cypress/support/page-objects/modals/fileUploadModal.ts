export const fileUploadModal = {
  body: () => cy.get("[data-cy=form-upload-file] input", { timeout: 20000 }),
  cancelButton: () => cy.get("[data-testid=button-cancel-upload]"),
  fileList: () => cy.get("[data-testid=list-fileUpload] li"),
  removeFileButton: () => cy.get("[data-testid=button-remove-from-file-list]"),
  uploadButton: () => cy.get("[data-testid=button-start-upload]", { timeout: 10000 }),
  uploadDropzone : () => cy.get("[data-testid=input-file-dropzone-fileUpload]"),
  errorLabel: () => cy.get("[data-testid=meta-error-message-fileUpload]"),

  // helper function only used when needing to invoke error labels
  attachFileForAutomation() {
    this.body().attachFile("../fixtures/uploadedFiles/text-file.txt")
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    this.uploadButton().should("be.visible")

    // we cannot interact with the file picker window in cypress
    // the way we attach files is different than a real user
    // a click is sometimes necessary to invoke an error
    this.uploadButton().then((button) => {
      if (button.is(":enabled")) {
        this.uploadButton().click()
      }
    })
  }
}
