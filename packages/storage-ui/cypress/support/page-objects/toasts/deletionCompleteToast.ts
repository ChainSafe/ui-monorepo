export const deletionCompleteToast = {
  body: () => cy.get("[data-testid=toast-deletion-complete]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testid=button-close-toast-deletion-complete]")
}
