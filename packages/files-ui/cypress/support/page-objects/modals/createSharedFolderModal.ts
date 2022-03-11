export const createSharedFolderModal = {
  body: () => cy.get("[data-testid=modal-container-create-shared-folder]", { timeout: 10000 }),
  cancelButton: () => cy.get("[data-cy=button-cancel-create-shared-folder]"),
  createButton: () => cy.get("[data-cy=button-create-shared-folder]", { timeout: 10000 }),
  folderNameInput: () => cy.get("[data-cy=input-shared-folder-name]")
}
