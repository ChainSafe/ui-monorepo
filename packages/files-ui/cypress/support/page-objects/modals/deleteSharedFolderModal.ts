export const deleteSharedFolderModal = {
  body: () => cy.get("[data-testId=modal-container-shared-folder-deletion]"),
  cancelButton: () => cy.get("[data-testId=button-cancel-deletion]"),
  confirmButton: () => cy.get("[data-testId=button-confirm-deletion]", { timeout: 10000 })
}