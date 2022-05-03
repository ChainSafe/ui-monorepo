export const fileUploadModal = {
  body: () => cy.get("[data-cy=form-upload-file] input", { timeout: 20000 }),
  cancelButton: () => cy.get("[data-testid=button-cancel-upload]"),
  fileList: () => cy.get("[data-testid=list-fileUpload] li"),
  removeFileButton: () => cy.get("[data-testid=button-remove-from-file-list]"),
  uploadButton: () => cy.get("[data-testid=button-start-upload]", { timeout: 10000 }),
  uploadDropzone : () => cy.get("[data-testid=input-file-dropzone-fileUpload]"),
  errorLabel: () => cy.get("[data-testid=meta-error-message-fileUpload]")
}
