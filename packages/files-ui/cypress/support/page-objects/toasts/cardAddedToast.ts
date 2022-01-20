export const cardAddedToast = {
  body: () => cy.get("[data-testid=toast-card-added]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testid=button-close-toast-card-added]")
}