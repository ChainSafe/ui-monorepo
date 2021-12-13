export const leaveSharedFolderModal = {
  body: () => cy.get("[data-testid=modal-container-shared-folder-leave]"),
  cancelButton: () => cy.get("[data-testid=button-cancel-deletion]"),
  confirmButton: () => cy.get("[data-testid=button-confirm-deletion]", { timeout: 10000 })
}