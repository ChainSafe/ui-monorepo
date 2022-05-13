export const fileUploadModal = {
  body: () => cy.get("[data-cy=form-upload-file] input"),
  cancelButton: () => cy.get("[data-testid=button-cancel-upload]"),
  fileList: () => cy.get("[data-testid=list-fileUpload] li"),
  removeFileButton: () => cy.get("[data-testid=button-remove-from-file-list]"),
  uploadButton: () => cy.get("[data-testid=button-start-upload]"),
  uploadDropzone : () => cy.get("[data-testid=input-file-dropzone-fileUpload]"),
  errorLabel: () => cy.get("[data-testid=meta-error-message-fileUpload]")
}
