export const sharingProgressToast = {
  body: () => cy.get("[data-testid=toast-sharing-progress]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testid=button-close-toast-sharing-progress]")
}