export const deleteFileModal = {
  body: () => cy.get("[data-testid=modal-container-file-deletion]"),
  cancelButton: () => cy.get("[data-testid=button-cancel-deletion]"),
  confirmButton: () => cy.get("[data-testid=button-confirm-deletion]", { timeout: 10000 })
}