export const removeCardModal = {
  body: () => cy.get("[data-testid=modal-container-remove-card-confirmation]"),
  cancelButton: () => cy.get("[data-testid=button-cancel-remove]"),
  confirmButton: () => cy.get("[data-testid=button-confirm-remove]", { timeout: 10000 })
}

