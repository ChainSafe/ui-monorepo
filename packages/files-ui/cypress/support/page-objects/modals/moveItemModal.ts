export const moveItemModal = {
  body: () => cy.get("[data-testId=modal-container-modal-move-file]"),
  cancelButton: () => cy.get("[data-cy=button-cancel-move]"),
  errorLabel: () => cy.get("[data-cy=label-move-file-error-message]"),
  folderList: () => cy.get("[data-cy=tree-folder-list]"),
  moveButton: () => cy.get("[data-cy=button-move-file]")
}