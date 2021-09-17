export const recoverItemModal = {
  body: () => cy.get("[data-testId=modal-container-modal-recover-file]"),
  cancelButton: () => cy.get("[data-cy=button-cancel-recovery]"),
  errorLabel: () => cy.get("[data-cy=label-move-file-error-message]"),
  folderList: () => cy.get("[data-cy=tree-folder-list]"),
  recoverButton: () => cy.get("[data-cy=button-recover-file]")
}