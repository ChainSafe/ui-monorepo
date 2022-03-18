export const shareFileModal = {
  body: () => cy.get("[data-testid=modal-container-share-file]", { timeout: 10000 }),
  shareNameInput: () => cy.get("[data-cy=input-new-share-name]"),
  selectFolderInput: () => cy.get("[data-cy=input-select-existing-folder]"),
  existingFolderInputOption: () => cy.get("[data-cy=input-select-existing-folder]"),
  keepOriginalFilesCheckbox: () => cy.get("[data-testid=checkbox-keep-original-files]"),
  cancelButton: () => cy.get("[data-testid=button-cancel-share-file]"),
  copyOverButton: () => cy.get("[data-testid=button-copy-over]"),
  moveOverButton: () => cy.get("[data-testid=button-move-over]")
}
