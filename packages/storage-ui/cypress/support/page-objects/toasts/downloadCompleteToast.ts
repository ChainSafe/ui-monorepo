export const downloadCompleteToast = {
  body: () => cy.get("[data-testid=toast-download-complete]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testid=button-close-toast-download-complete]")
}
