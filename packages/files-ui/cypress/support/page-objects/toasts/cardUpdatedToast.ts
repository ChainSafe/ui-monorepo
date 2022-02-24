export const cardUpdatedToast = {
  body: () => cy.get("[data-testid=toast-card-updated]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testid=button-close-toast-card-updated]")
}