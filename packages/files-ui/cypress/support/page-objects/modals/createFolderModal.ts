export const createFolderModal = {
  body: () => cy.get("[data-cy=modal-create-folder]", { timeout: 10000 }),
  cancelButton: () => cy.get("[data-cy=button-cancel-create-folder]"),
  createButton: () => cy.get("[data-cy=button-create-folder]", { timeout: 10000 }),
  errorLabel: () => cy.get("[data-cy=folder-creation-form] span.default.error"),
  folderNameInput: () => cy.get("[data-cy=input-folder-name]")
}