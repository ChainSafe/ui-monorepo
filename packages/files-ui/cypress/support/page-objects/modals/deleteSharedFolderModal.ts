export const deleteSharedFolderModal = {
  body: () => cy.get("[data-testid=modal-container-shared-folder-deletion]"),
  cancelButton: () => cy.get("[data-testid=button-cancel-deletion]"),
  confirmButton: () => cy.get("[data-testid=button-confirm-deletion]", { timeout: 10000 })
}