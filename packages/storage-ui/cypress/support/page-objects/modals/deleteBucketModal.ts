export const deleteBucketModal = {
  body: () => cy.get("[data-testid=modal-container-bucket-deletion]"),
  cancelButton: () => cy.get("[data-testid=button-bucket-cancel-deletion]"),
  confirmButton: () => cy.get("[data-testid=button-bucket-confirm-deletion]", { timeout: 10000 })
}