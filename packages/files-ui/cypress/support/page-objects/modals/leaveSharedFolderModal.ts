export const leaveSharedFolderModal = {
  body: () => cy.get("[data-testid=modal-container-shared-folder-leave]"),
  cancelButton: () => cy.get("[data-testid=button-reject-shared-folder-leave]"),
  confirmButton: () => cy.get("[data-testid=button-confirm-shared-folder-leave]", { timeout: 10000 })
}