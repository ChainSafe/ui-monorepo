export const deleteBucketModal = {
  body: () => cy.get("[data-testid=modal-container-bucket-deletion]"),
  cancelButton: () => cy.get("[data-testid=button-reject-bucket-deletion]"),
  confirmButton: () => cy.get("[data-testid=button-confirm-bucket-deletion]", { timeout: 10000 })
}