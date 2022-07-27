export const deleteFileModal = {
  body: () => cy.get("[data-testid=modal-container-file-deletion]"),
  cancelButton: () => cy.get("[data-testid=button-reject-file-deletion]"),
  confirmButton: () => cy.get("[data-testid=button-confirm-file-deletion]", { timeout: 10000 })
}