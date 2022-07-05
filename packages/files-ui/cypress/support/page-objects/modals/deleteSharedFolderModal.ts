export const deleteSharedFolderModal = {
  body: () => cy.get("[data-testid=modal-container-shared-folder-deletion]"),
  cancelButton: () => cy.get("[data-testid=button-reject-shared-folder-deletion]"),
  confirmButton: () => cy.get("[data-testid=button-confirm-shared-folder-deletion]", { timeout: 10000 })
}