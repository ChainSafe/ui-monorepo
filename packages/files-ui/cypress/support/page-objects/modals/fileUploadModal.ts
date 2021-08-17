export const fileUploadModal = {
  body: () => cy.get("[data-cy=upload-file-form] input", { timeout: 20000 }),
  cancelButton: () => cy.get("[data-testId=button-cancel-upload]"),
  fileList: () => cy.get("[data-testid=file-list-fileUpload] li"),
  removeFileButton: () => cy.get("[data-testid=button-remove-from-file-list]"),
  uploadButton: () => cy.get("[data-testId=button-start-upload]", { timeout: 10000 }),
  uploadDropzone : () => cy.get("[data-testid=file-input-dropzone-fileUpload]")
}
