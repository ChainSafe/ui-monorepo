export const fileUploadModal = {
  body: () => cy.get("[data-cy=form-upload-file] input", { timeout: 20000 }),
  cancelButton: () => cy.get("[data-testId=button-cancel-upload]"),
  fileList: () => cy.get("[data-testId=list-fileUpload] li"),
  removeFileButton: () => cy.get("[data-testId=button-remove-from-file-list]"),
  uploadButton: () => cy.get("[data-testId=button-start-upload]", { timeout: 10000 }),
  uploadDropzone : () => cy.get("[data-testId=input-file-dropzone-fileUpload]")
}
